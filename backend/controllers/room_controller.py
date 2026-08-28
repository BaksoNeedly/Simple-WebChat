from ..http.http_response import HTTPResponse
from ..http.http_request import HTTPRequest
from ..utils.json_parser import JSONParser

from ..repositories.room_repository import RoomRepository
from ..session.session_manager import SessionManager
from ..session.client_session_manager import ClientSessionManager

from ..repositories.message_repository import MessageRepository
from ..repositories.message_read_repository import MessageReadRepository

from ..repositories.user_repository import UserRepository

from ..packets.message_packet import MessagePacket

class RoomController:

    @staticmethod
    def load_message(request: HTTPRequest) -> HTTPResponse:
        session = SessionManager.extract_session(request)
        session_id = session.get_session_id()

        client_session = ClientSessionManager.get(session_id)

        if not client_session:
            return HTTPResponse(
                status="404",
                reason_phrase="Not Found"
            )

        packet = JSONParser.parse(request.get_body())

        room_id = RoomRepository.calculate(
            client_session.get_username(),
            packet["identifier"]
        )

        room = RoomRepository.get_by_id(room_id)

        if not room:
            return HTTPResponse(
                status="404",
                reason_phrase="Not Found"
            )

        messages = [
            MessagePacket(
                content=message.get_content(),
                created_at=message.get_created_at(),
                sender=UserRepository.get_by_id(message.get_sender_id()).get_username(),
                file="",
                is_read=MessageReadRepository.exists(message.get_id())
            ).to_data()
            for message in MessageRepository.get_messages_by_room_id(room_id=room.get_id())
        ]

        # DEBUG
        # print("ROOM CONTROLLER: ", messages)

        return HTTPResponse(
            body=JSONParser.stringify(messages)
        )
