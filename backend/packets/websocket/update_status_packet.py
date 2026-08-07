from ..packet import Packet

class UpdateStatusPacket(Packet):

    def __init__(self, username: str):
        self._username = username

    def to_data(self):
        return {
            "username": self._username,
            "type": "update_status"
        }

    @staticmethod
    def from_data(data):
        return UpdateStatusPacket(
            data["username"]
        )