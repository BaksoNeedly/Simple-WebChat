from backend.http.http_response import HTTPResponse
from backend.http.http_request import HTTPRequest
from backend.utils.json_parser import JSONParser
from backend.session.session_manager import SessionManager
from backend.cookie.cookie import Cookie

from ..user.user import User
from ..user.user_manager import UserManager

from ..packets.http.new_chat_packet import NewChatPacket
from ..packets.http.user_packet import UserPacket

import config
import socket

from ..chat.room.room_manager import RoomManager
from ..chat.room.room import Room

from ..database.database_manager import DatabaseManager

class UserController:

    @staticmethod
    def load_chat(request: HTTPRequest, client_socket) -> HTTPResponse:
        cookie_header = request.get_headers().get("cookie")
        session_id = Cookie.parse(str(cookie_header).encode(config.FORMAT)).get("session_id")
        session = SessionManager.get(session_id)

        if not session or not session.is_authenticated():
            return HTTPResponse(
                status="302",
                headers={
                    "Location": "/page/login"
                },
            )

        user = UserManager.get(session_id)
        user_data = JSONParser.stringify(user.to_data())

        return HTTPResponse(
            headers={
                "Content-Length": len(user_data.encode(config.FORMAT)),
                "Content-Type": "application/json"
            },
            body=user_data
        )


    @staticmethod
    def is_user_valid(request: HTTPRequest, client_socket) -> HTTPResponse:
        cookie_header = request.get_headers().get("cookie")
        session_id = Cookie.parse(str(cookie_header).encode(config.FORMAT)).get("session_id")
        session = SessionManager.get(session_id)

        body = {
            ""
        }

        return HTTPResponse(
            header={
                "Content-Type": "application/json",
                "Content-Length": ""
            }
        )


    @staticmethod
    def new_chat(request: HTTPRequest, client_socket: socket.socket) -> HTTPResponse:
        session = SessionManager.extract_session(request)
        session_id = session.get_id()
        user = UserManager.get(session_id)
        packet = NewChatPacket.from_data(JSONParser.parse(request.get_body()))
        target_username = packet.get_username()
        target_user = UserManager.get_by_name(target_username)

        response_body = {}

        if target_user:
            response_body = {
                "success": True,
            }
            user.add_contact(target_user)
        else:
            response_body = {
                "success": False,
                "message": "User not found."
            }
        return HTTPResponse(
            headers={
                "Content-Type": "application/json",
                "Content-Length": len(JSONParser.stringify(response_body).encode(config.FORMAT))
            },
            body=JSONParser.stringify(response_body)
        )

    @staticmethod
    def chat(request: HTTPRequest, client_socket: socket.socket) -> HTTPResponse:
        session = SessionManager.extract_session(request)
        session_id = session.get_id()
        user = UserManager.get(session_id)
        packet = UserPacket.from_data(JSONParser.parse(request.get_body()))
        target_username = packet.get_username()
        target_user = UserManager.get_by_name(target_username)

        response_body = {}

        response_body = {
            "success": False
        }

        if user.has_contact(target_username):
            calculated_id = RoomManager.calculate(user.get_username(), target_username)
            room = RoomManager.get_room(calculated_id)
            if not room:
                room = Room(calculated_id)
                RoomManager.add_room(room, [user.get_username(), target_username])


            if not user.get_current_room_id() or user.get_current_room_id() != room.get_id():
                response_body = {
                    "success": True,
                }
                user.set_current_room_id(room.get_id())

            # DEBUG
            # print(calculated_id)
            # print(RoomManager.get_room(calculated_id).get_members())
            # print(f"CHAT: {user.get_username()} CURRENT ROOM IS {user.get_current_room_id()}")
                        

        return HTTPResponse(
            headers={
                "Content-Type": "application/json",
                "Content-Length": len(JSONParser.stringify(response_body).encode(config.FORMAT))
            },
            body=JSONParser.stringify(response_body)
        )

