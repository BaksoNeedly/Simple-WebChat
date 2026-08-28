from ..packet import Packet

class EnterRoomPacket(Packet):

    def __init__(self, username: str):
        self._username = username

    def to_data(self):
        return {
            "target": self._username,
            "type": "enter_room"
        }

    @staticmethod
    def from_data(data):
        return EnterRoomPacket(
            data["username"]
        )