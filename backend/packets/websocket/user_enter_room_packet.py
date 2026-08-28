from ..packet import Packet

class UserEnterRoomPacket(Packet):

    def __init__(self, username: str):
        self._username = username

    def to_data(self):
        return {
            "username": self._username,
            "type": "user_enter_room"
        }

    @staticmethod
    def from_data(data):
        return UserEnterRoomPacket(
            data["username"]
        )