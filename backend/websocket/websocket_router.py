from ..utils.json_parser import JSONParser
from .websocket_frame import WebSocketFrame
from ..session.client_session import ClientSession
from .websocket_broadcaster import WebSocketBroadcaster
from ..packets.websocket.enter_room_packet import EnterRoomPacket
from ..packets.websocket.leave_room_packet import LeaveRoomPacket
from ..packets.websocket.update_status_packet import UpdateStatusPacket
from ..packets.websocket.join_message_packet import JoinMessagePacket
from ..packets.websocket.total_user_packet import TotalUserPacket
from ..packets.websocket.message_packet import MessagePacket
from ..packets.websocket.user_enter_room_packet import UserEnterRoomPacket
from ..packets.websocket.message_history_packet import MessageHistoryPacket
from ..repositories.room_repository import RoomRepository
from ..session.client_session_manager import ClientSessionManager
from ..models.message import Message
from ..models.room import Room
from ..repositories.message_repository import MessageRepository
from ..repositories.message_read_repository import MessageReadRepository
from ..repositories.contact_repository import ContactRepository
from ..repositories.user_repository import UserRepository
from ..utils.time_utils import TimeUtils

class WebSocketRouter:

    @staticmethod
    def route(frame: bytes, client_session: ClientSession):
        raw_payload = WebSocketFrame.parse(frame)
        payload = JSONParser.parse(raw_payload)
        
        # 1. Avoid shadowing built-in 'type'
        msg_type = str(payload.get("type", "")).strip().lower()
        if not msg_type:
            return

        # if msg_type == "ping":
        #     print("ping")
        #     return

        current_room_id = client_session.get_current_room_id()
        match msg_type:
            case "enter_room":
                target_username = payload.get("target_username")
                packet = EnterRoomPacket(target_username)

                target_user = UserRepository.get_by_username(target_username)

                if not target_user:
                    return

                client_contact = ContactRepository.exists(client_session.get_serial_id(), target_user.get_id())

                if client_contact:
                    calculated_id = RoomRepository.calculate(client_session.get_username(), target_username)
                    room = RoomRepository.get_by_id(calculated_id)
                    if not room:
                        room = Room(calculated_id)
                        RoomRepository.create(room, [client_session.get_username(), target_username])
        
                    if not client_session.get_current_room_id() or client_session.get_current_room_id() != room.get_id():
                        client_session.set_current_room_id(room.get_id())
                        WebSocketBroadcaster.send_to_all(
                            UserEnterRoomPacket(target_username),
                            [client_session.get_username()]
                        )

                    for message in MessageRepository.get_messages_by_sender_id(str(target_user.get_id())):
                        MessageReadRepository.mark_as_read(message.get_id(), TimeUtils.get_current_time_stamp())

                    # DEBUG
                    # print(calculated_id)
                    # print(RoomRepository.get_by_id(calculated_id).get_members())
                    # print(f"CHAT: {client_session.get_username()} CURRENT ROOM IS {client_session.get_current_room_id()}")
                pass
            case "leave_room":
                current_room_id = client_session.get_current_room_id()
                if not current_room_id:
                    return

                client_session.set_current_room_id(None)

                WebSocketBroadcaster.send(client_session.get_socket(), LeaveRoomPacket(client_session.get_username()))
            case "global_join"|"ping":
                WebSocketBroadcaster.send_to_all(UpdateStatusPacket(client_session.get_username()))
                WebSocketBroadcaster.send_to_all(TotalUserPacket(
                    len(ClientSessionManager.get_all())
                ))
            case "join_message":
                if not current_room_id:
                    return

                room = RoomRepository.get_by_id(current_room_id)
                if not room:
                    return

                packet = JoinMessagePacket(client_session.get_username())

                for member in room.get_online_members():
                    if member.get_current_room_id() != room.get_id():
                        continue

                    if member.get_username() == client_session.get_username():
                        continue
                    
                    WebSocketBroadcaster.send(member.get_socket(), packet)

            case "message":
                # 2. Use safe .get() calls to prevent KeyError crashes
                content = payload.get("content")
                created_at = payload.get("timestamp")
                file = payload.get("file")

                if content is None or created_at is None:
                    return

                if not current_room_id:
                    return

                room = RoomRepository.get_by_id(current_room_id)
                if not room:
                    return

                message = Message(
                    room_id=room.get_id(),
                    content=content,
                    created_at=created_at,
                    sender_id=client_session.get_serial_id()
                )
                message = MessageRepository.add_message(message)

                packet = MessagePacket(
                    content,
                    created_at,
                    client_session.get_username(),
                    file,
                    MessageReadRepository.exists(message.get_id())
                )

                for member in room.get_online_members():
                    
                    if member.get_current_room_id() == room.get_id() and member.get_serial_id() != client_session.get_serial_id():
                        MessageReadRepository.mark_as_read(message.get_id(), TimeUtils.get_current_time_stamp())
                        packet.read()

                    if member.get_current_room_id() != RoomRepository.calculate(member.get_username(), member.get_username()):
                        WebSocketBroadcaster.send(member.get_socket(), packet)