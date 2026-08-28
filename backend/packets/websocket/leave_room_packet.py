from ..packet import Packet

class LeaveRoomPacket(Packet):

    def __init__(self, username: str):
        self._username = username

    def to_data(self):
        return {
            "username": self._username,
            "type": "leave_room"
        }

    @staticmethod
    def from_data(data):
        return LeaveRoomPacket(
            data["username"]
        )