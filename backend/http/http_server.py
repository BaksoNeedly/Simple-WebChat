import config
import socket
import threading
from backend.http.http_request import HTTPRequest
from backend.http.http_parser import HTTPParser
from backend.http.http_router import HTTPRouter
from backend.session.session import Session
from backend.session.session_manager import SessionManager
from backend.websocket.websocket_server import WebSocketServer
from pathlib import Path
from backend.cookie.cookie import Cookie
from backend.http.http_response import HTTPResponse
from backend.managers.asset_manager import AssetManager
from .http_router_registrar import HttpRouterRegistrar
from ..utils.path_parser import PathParser
from ..chat.room.room_manager import RoomManager

class HTTPServer:

    def __init__(self):
        self._status = False

    def get_status(self):
        return self._status

    def start(self) -> None:
        self._server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self._server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self._server.bind(config.ADDRESS)
        self._server.listen()
        self._status = True

        self._router = HTTPRouter()       
        HttpRouterRegistrar(self._router).register_routes()

        self.on_enable()

        while self.get_status():
            conn, addr = self._server.accept()
            threading.Thread(target=self.handle_client, args=(conn,)).start()

    def close(self) -> None:
        self._server.close()
        self.on_disable()

    def get_router(self) -> HTTPRouter:
        return self._router

    def handle_client(self, client_socket: socket.socket) -> None:
        data = b""
        while b"\r\n\r\n" not in data:
            raw = client_socket.recv(config.BUFSIZE)
            if not raw:
                break
            data += raw

        response = HTTPResponse(body="HELLO").build()

        if data:
            request = HTTPRequest(data)

            cookie = request.get_headers().get("cookie")
            headers = request.get_headers()
            upgrade = headers.get("upgrade")
            connection = headers.get("connection")

            if upgrade and connection:
                WebSocketServer.handle(client_socket, request)
                return

            self.write_log(data.decode(config.FORMAT))
            router_result = self.get_router().route(request, client_socket)

            if router_result:
                if not cookie:
                    id = SessionManager.generate_id()
                    session = Session(id)
                    SessionManager.set(id, session)
                    print("Do not have session yet.")
                    router_result.add_headers("Set-Cookie", Cookie.build({
                        "session_id": id
                    }))
                else:
                    id = Cookie.parse(str(cookie).encode(config.FORMAT)).get("session_id")
                    if id is None:
                        new_id = SessionManager.generate_id()
                        session = Session(new_id)
                        SessionManager.set(new_id, session)
                        print("Has cookie but no session_id.")
                        router_result.add_headers("Set-Cookie", Cookie.build({
                            "session_id": new_id
                        }))
                    else:
                        if not SessionManager.get(id):
                            session = Session(id)
                            SessionManager.set(id, session)
                            print("Has cookie and id.")
                response = router_result.build()

        if request.get_path() == "/page/chat":
            session = SessionManager.get(Cookie.parse(request.get_headers().get("cookie").encode(config.FORMAT)).get("session_id"))
            if not session or not session.is_authenticated():
                response = HTTPResponse(
                    status="302",
                    headers={
                        "Location": "/page/login"
                    }
                ).build()

        # DEBUG
        # print("HTTPSERVER: ", SessionManager.size(), "sessions.")
        # print(len(RouteManager.get_all()), "ROUTES")
        # print("PATHS:", paths)
        print("PATH:", request.get_path())
        # print("REQUEST:", request.get_body())
        # print("RESPONSE BODY:", response.decode().split("\r\n\r\n",1)[1])
        # print(request.get_data(), "\r\n")
        # print(response.decode(config.FORMAT), "\r\n")
        # for id, s in SessionManager.get_all().items():
        #     print(s.get_id(), f": {s.get_username()} {s.get_email()} {s.is_authenticated()}")

        client_socket.sendall(response)
        client_socket.close()

    def on_enable(self) -> None:
        self.info("Listening on " + f"{config.ADDRESS}...")
        threading.Thread(target=self.on_command).start()

    def on_disable(self) -> None:
        self.info("Server closed...")

    def info(self, msg: str) -> None:
        print("[SERVER]", msg)

    def write_log(self, log: str):
        with open(Path(__file__).parent / "log.txt", "w", encoding="utf-8") as file:
            file.write(repr(log) + "\n\n")
        with open(Path(__file__).parent / "log_.txt", "a", encoding="utf-8") as file:
            file.write(log)

    def on_command(self) -> None:
        try:
            while self.get_status():
                command = input("> ")
        except (Exception, KeyboardInterrupt, EOFError) as e:
            self.info(e)
        finally:
            # print("HTTPSERVER:", "ROOMS:", len(RoomManager.get_rooms()))
            # for room_id, room in RoomManager.get_rooms().items():
            #     print("HTTPSERVER:", f"ROOM: {room.get_id()}, MEMBERS: {room.get_members()}")
            RoomManager.save()
            self.on_disable()
            self.close()