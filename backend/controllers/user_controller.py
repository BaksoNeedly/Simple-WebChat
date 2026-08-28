from backend.http.http_response import HTTPResponse
from backend.http.http_request import HTTPRequest
from backend.utils.json_parser import JSONParser
from backend.session.session_manager import SessionManager
from backend.cookie.cookie import Cookie

from ..session.client_session import ClientSession
from ..session.client_session_manager import ClientSessionManager

from ..packets.http.new_chat_packet import NewChatPacket
from ..packets.http.new_contact_packet import NewContactPacket
from ..packets.http.user_packet import UserPacket

from ..repositories.user_repository import UserRepository
from ..repositories.contact_repository import ContactRepository
from ..repositories.room_repository import RoomRepository

from ..models.room import Room

import config
import socket


from ..database.database_manager import DatabaseManager

from ..http.multipart import Multipart

from pathlib import Path

import random


class UserController:

    @staticmethod
    def verify(request: HTTPRequest) -> HTTPResponse:
        session = SessionManager.extract_session(request)

        if not session:
            return HTTPResponse(
                status="401",
                reason_phrase="Unauthorized"
            )

        session_id = session.get_session_id()
        client_session = ClientSessionManager.get(session_id)

        if not client_session:
            return HTTPResponse(
                status="401",
                reason_phrase="Unauthorized"
            )

        user = UserRepository.get_by_id(client_session.get_serial_id())

        if not user:
            return HTTPResponse(
                status="403",
                reason_phrase="Forbidden"
            )

        verify_code = user.get_verify_code()

        if user.is_verified() and verify_code:
            return HTTPResponse(
                status="303",
                reason_phrase="See Other",
                headers={
                    "Location": "/page/verified"
                }
            )
        
        if not verify_code:
            UserRepository.update_verify_code(user.get_id(), random.randint(100000, 999999))

        return HTTPResponse(
            status="303",
            reason_phrase="See Other",
            headers={
                "Location": "/page/verification"
            }
        )

    @staticmethod
    def new_contact(request: HTTPRequest) -> HTTPResponse:
        session = SessionManager.extract_session(request)
        session_id = session.get_session_id()
        client_session = ClientSessionManager.get(session_id)

        packet = NewContactPacket.from_data(JSONParser.parse(request.get_body()))

        target_user = UserRepository.get_by_username(packet.get_username())
        if target_user:
            UserRepository.add_contact_to(
                client_session.get_serial_id(),
                target_user
            )
            return HTTPResponse()
        else:
            return HTTPResponse(
                status="404",
                reason_phrase="Not Found"
            )

    @staticmethod
    def new_chat(request: HTTPRequest) -> HTTPResponse:
        session = SessionManager.extract_session(request)
        session_id = session.get_session_id()
        user = ClientSessionManager.get(session_id)

        packet = NewContactPacket.from_data(JSONParser.parse(request.get_body()))

        target_user = ClientSessionManager.get_by_name(packet.get_username())

        if(target_user):
            status = "200"
            reason_phrase = "OK"
        else:
            status = "404"
            reason_phrase = "Not Found"

        return HTTPResponse(status=status, reason_phrase=reason_phrase)

    @staticmethod
    def load_message(request: HTTPRequest) -> HTTPResponse:
        session = SessionManager.extract_session(request)
        session_id = session.get_session_id()

        user = ClientSessionManager.get(session_id)
        if(user):
            return HTTPResponse(
                status="200",
                reason_phrase="OK",
                body=JSONParser.stringify(user.get_contacts())
            )
        else:
            return HTTPResponse(
                status="404",
                reason_phrase="Not Found"
            )

    @staticmethod
    def load_contact(request: HTTPRequest) -> HTTPResponse:
        session = SessionManager.extract_session(request)

        if not session:
            return HTTPResponse(
                status="401",
                reason_phrase="Unauthorized"
            )

        client_session = ClientSessionManager.get(session.get_session_id())

        if not client_session:
            return HTTPResponse(
                status="401",
                reason_phrase="Unauthorized"
            )

        client_session_id = client_session.get_serial_id()

        contacts = ContactRepository.get_by_user_id(client_session_id)

        usernames = []
        for contact in contacts:

            contact_user = UserRepository.get_by_id(contact.get_contact_id())

            if contact_user:
                usernames.append(contact_user.get_username())

        return HTTPResponse(
            body=JSONParser.stringify(usernames)
        )

    @staticmethod
    def load_chat(request: HTTPRequest) -> HTTPResponse:
        session = SessionManager.extract_session(request)
        client_session = ClientSessionManager.get(session.get_session_id())
        client_session_id = client_session.get_serial_id()

        if not session or not session.is_authenticated():
            return HTTPResponse(
                status="302",
                headers={
                    "Location": "/page/login"
                },
            )

        user = UserRepository.get_by_id(client_session_id)
        if not user:
            return HTTPResponse(
                status="302",
                headers={
                    "Location": "/page/login"
                },
            )
        user_data = JSONParser.stringify(user.to_data())
        return HTTPResponse(
            headers={
                "Content-Length": len(user_data.encode(config.FORMAT)),
                "Content-Type": "application/json"
            },
            body=user_data
        )


    @staticmethod
    def is_user_valid(request: HTTPRequest) -> HTTPResponse:
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
    def is_user(request: HTTPRequest) -> HTTPResponse:
        session = SessionManager.extract_session(request)
        session_id = session.get_session_id()
        packet = NewChatPacket.from_data(JSONParser.parse(request.get_body()))
        target_username = packet.get_username()
        target_user = ClientSessionManager.get_by_name(target_username)

        if target_user:
            return HTTPResponse()
        else:
            return HTTPResponse(status="404", reason_phrase="Not Found")

    # @staticmethod
    # def new_chat(request: HTTPRequest) -> HTTPResponse:
    #     session = SessionManager.extract_session(request)
    #     session_id = session.get_session_id()
    #     user = ClientSessionManager.get(session_id)
    #     packet = NewChatPacket.from_data(JSONParser.parse(request.get_body()))
    #     target_username = packet.get_username()
    #     target_user = ClientSessionManager.get_by_name(target_username)

    #     response_body = {}

    #     if target_user:
    #         response_body = {
    #             "success": True,
    #         }
    #         user.add_contact(target_user)
    #     else:
    #         response_body = {
    #             "success": False,
    #             "message": "User not found."
    #         }
    #     return HTTPResponse(
    #         headers={
    #             "Content-Type": "application/json",
    #             "Content-Length": len(JSONParser.stringify(response_body).encode(config.FORMAT))
    #         },
    #         body=JSONParser.stringify(response_body)
    #     )

    # @staticmethod
    # def chat(request: HTTPRequest) -> HTTPResponse:
    #     session = SessionManager.extract_session(request)
    #     session_id = session.get_session_id()
    #     user = ClientSessionManager.get(session_id)
    #     packet = UserPacket.from_data(JSONParser.parse(request.get_body()))
    #     target_username = packet.get_username()
    #     target_user = ClientSessionManager.get_by_name(target_username)

    #     if user.has_contact(target_username):
    #         calculated_id = RoomManager.calculate(user.get_username(), target_username)
    #         room = RoomManager.get_room(calculated_id)
    #         if not room:
    #             room = Room(calculated_id)
    #             RoomManager.add_room(room, [user.get_username(), target_username])

    #         if not user.get_current_room_id() or user.get_current_room_id() != room.get_id():
    #             user.set_current_room_id(room.get_id())

    #         # DEBUG
    #         print(calculated_id)
    #         print(RoomManager.get_room(calculated_id).get_members())
    #         print(f"CHAT: {user.get_username()} CURRENT ROOM IS {user.get_current_room_id()}")

    #         return HTTPResponse()
    #     return HTTPResponse(
    #         status="404",
    #         reason_phrase="Not Found"
    #     )
