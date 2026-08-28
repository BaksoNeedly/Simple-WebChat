import base64
from unittest import case
import config
import hashlib
import socket
from backend.http.http_request import HTTPRequest
from backend.http.http_response import HTTPResponse
from backend.websocket.websocket_frame import WebSocketFrame
from backend.utils.json_parser import JSONParser
from backend.models.chat_message import ChatMessage
from backend.models.disconnect_message import DisconnectMessage
from backend.models.join_message import JoinMessage
from backend.models.online_users import OnlineUsers
from backend.cookie.cookie import Cookie
from ..session.session import Session
from ..session.session_manager import SessionManager
from ..packets.search_user import SearchUser
from ..packets.packet import Packet

from .websocket_handshake import WebSocketHandshake
from .websocket_broadcaster import WebSocketBroadcaster
from .websocket_router import WebSocketRouter

from ..session.client_session import ClientSession
from ..session.client_session_manager import ClientSessionManager

class WebSocketServer:    

    @classmethod
    def handle(cls, client_socket: socket.socket, request: HTTPRequest):
        WebSocketHandshake.perform(client_socket, request)        
        session = SessionManager.extract_session(request)
        if not session or not session.is_authenticated():
            print("Session not found or not authenticated.")
            client_socket.close()
            return
        session_id = session.get_session_id()
        client_session = ClientSession(client_socket, session)
        ClientSessionManager.set(client_session)
        if not client_session:
            client_socket.sendall(HTTPResponse(status="404", reason_phrase="Not Found"))
            client_socket.close()
            return
        print(client_session.get_username(), "connected.")
        # try:
        while True:
            raw_frame = client_socket.recv(config.BUFSIZE)
            if not raw_frame:
                return

            # DEBUG
            # print("Payload:", WebSocketFrame.parse(raw_frame))

            opcode = raw_frame[0] & 0b00001111
            if opcode == 0b00001000: # Close frame
                print("CLOSE FRAME DETECTED.")
                break

            WebSocketRouter.route(raw_frame, client_session)
        # except Exception as e:
        #     print(f"Error occurred while handling WebSocket connection: {e}")
        # finally:
        #     UserManager.close(user)
