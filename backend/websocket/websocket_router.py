from ..utils.json_parser import JSONParser
from .websocket_frame import WebSocketFrame
from ..user.user import User
from .websocket_broadcaster import WebSocketBroadcaster
from ..packets.websocket.update_status_packet import UpdateStatusPacket
from ..packets.websocket.join_message_packet import JoinMessagePacket
from ..packets.websocket.total_user_packet import TotalUserPacket
from ..packets.websocket.message_packet import MessagePacket
from ..packets.websocket.message_history_packet import MessageHistoryPacket
from ..chat.room.room_manager import RoomManager
from ..user.user_manager import UserManager

class WebSocketRouter:

    @staticmethod
    def route(frame: bytes, user: User):
        raw_payload = WebSocketFrame.parse(frame)
        payload = JSONParser.parse(raw_payload)
        
        # 1. Avoid shadowing built-in 'type'
        msg_type = str(payload.get("type", "")).strip().lower()
        if not msg_type:
            return

        # if msg_type == "ping":
        #     print("ping")
        #     return

        match msg_type:
            case "global_join"|"ping":
                WebSocketBroadcaster.send_to_all(UpdateStatusPacket(user.get_username()))
                WebSocketBroadcaster.send_to_all(TotalUserPacket(
                    len(UserManager.get_all())
                ))
            case "join_message":
                current_room_id = user.get_current_room_id()
                if not current_room_id:
                    return

                room = RoomManager.get_room(current_room_id)
                if not room:
                    return

                packet = JoinMessagePacket(user.get_username())

                for member in room.get_online_members():
                    # Skip sending join notification back to sender
                    if member.get_username() == user.get_username():
                        continue
                    
                    WebSocketBroadcaster.send(member.get_socket(), packet)

            case "message":
                # 2. Use safe .get() calls to prevent KeyError crashes
                content = payload.get("content")
                timestamp = payload.get("timestamp")

                if content is None or timestamp is None:
                    return

                current_room_id = user.get_current_room_id()
                if not current_room_id:
                    return

                room = RoomManager.get_room(current_room_id)
                if not room:
                    return

                packet = MessagePacket(
                    content,
                    timestamp,
                    user.get_username()
                )

                print(room.get_members())

                for member in room.get_online_members():                    
                    if member.get_current_room_id() != room.get_id():
                        continue

                    WebSocketBroadcaster.send(
                        member.get_socket(), 
                        MessageHistoryPacket(
                            content,
                            timestamp,
                            user.get_username(),
                            member.get_username()
                        )
                    )

                    print(member.get_username())
                    if member.get_username() == user.get_username():
                        continue
                    WebSocketBroadcaster.send(member.get_socket(), packet)