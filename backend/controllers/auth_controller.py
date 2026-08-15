from backend.http.http_response import HTTPResponse
from backend.http.http_request import HTTPRequest
from backend.utils.json_parser import JSONParser
from backend.requests.register_request import RegisterRequest
from backend.requests.login_request import LoginRequest
from backend.database.database_manager import DatabaseManager
from backend.session.session_manager import SessionManager
from backend.cookie.cookie import Cookie
import config
import bcrypt
import socket

class AuthController:
    @staticmethod
    def connect(request: HTTPRequest) -> HTTPResponse:
        cookie_header = request.get_headers().get("cookie")
        session_id = Cookie.parse(str(cookie_header).encode(config.FORMAT)).get("session_id")
        session = SessionManager.get(session_id)

        body = JSONParser.stringify({
            "status": session and session.is_authenticated()
        })

        return HTTPResponse(
            headers={
                "Content-Type": "application/json",
                "Content-Length": len(body.encode(config.FORMAT))
            },
            body=body
        )

    @staticmethod
    def register(request: HTTPRequest) -> HTTPResponse:
        register_request = RegisterRequest.from_data(request.get_body())
        username = register_request.get_username()

        db = DatabaseManager.get_connection()
        cursor = db.cursor()        
        body = b""

        with cursor as cur:
            cur.execute("SELECT * FROM chat_users WHERE username=%s", (username,))
            user_data = cur.fetchone()

        body = JSONParser.stringify({
            "success": True,
            "redirect": "/page/login"
        })

        if user_data:
            body = JSONParser.stringify({
                "success": False,
                "message": "Username already exists."
            })
        
        email = register_request.get_email()
        password = register_request.get_password()
        confirm_password = register_request.get_confirm_password()

        if password != confirm_password:
            body = JSONParser.stringify({
                "success": False,
                "message": "Mismatch password."
            })            

        response = HTTPResponse(
            "HTTP/1.1",
            "200",
            "OK",
            {
                "Content-Type": "application/json",
                "Content-Length": str(len(body.encode(config.FORMAT)))
            },
            body
        )

        hash_password = bcrypt.hashpw(password.encode(config.FORMAT), bcrypt.gensalt()).decode(config.FORMAT)

        db = DatabaseManager.get_connection()
        cursor = db.cursor()
        try:
            with cursor as cur:
                cur.execute(
                    "INSERT INTO chat_users (username, email, hash_password) VALUES (%s, %s, %s)",
                    (username, email, hash_password)
                )
            db.commit()
            cookie_bytes = str(request.get_headers().get("cookie")).encode(config.FORMAT)
            session_id = Cookie.parse(cookie_bytes).get("session_id")
            session = SessionManager.get(session_id)
            session.set_username(username)
            session.set_email(email)
            session.authenticate()
        except Exception:
            db.rollback()
            raise        
        return response

    @staticmethod
    def login(request: HTTPRequest) -> HTTPResponse:
        login_request = LoginRequest.from_data(request.get_body())
        username = login_request.get_username()

        db = DatabaseManager.get_connection()
        cursor = db.cursor()
        with cursor as cur:
            cur.execute("SELECT email, hash_password FROM chat_users WHERE username=%s", (username,))
            user_data = cur.fetchone()

        body = b""

        body = JSONParser.stringify({
            "success": True,
            "redirect": "/page/chat"
        })

        if not user_data:
            body = JSONParser.stringify({
                "success": False,
                "message": "Wrong password or username not exists."
            })
        else:
            hash_password = str(user_data[1])
            password = login_request.get_password()

            check_pw = bcrypt.checkpw(password.encode(config.FORMAT), hash_password.encode(config.FORMAT))
            if not check_pw:
                body = JSONParser.stringify({
                    "success": False,
                    "message": "Wrong password or username not exists."
                })
            else:
                cookie = request.get_headers().get("cookie")
                parsed_cookie = Cookie.parse(str(cookie).encode(config.FORMAT))
                session_id = parsed_cookie.get("session_id")

                email = str(user_data[0])
                session = SessionManager.get(session_id)
                session.set_username(username)
                session.set_email(email)

                session.authenticate()

                # print("THE ID:", session_id)
                # print("THE EMAIL:", email)

        response = HTTPResponse("HTTP/1.1", "200", "OK", {
            "Content-Type": "application/json",
            "Content-Length": len(body.encode(config.FORMAT))
        }, body)
        return response
