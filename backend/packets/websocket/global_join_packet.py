from ..packet import Packet

class GlobalJoinPacket(Packet):

    def __init__(self, username: str):
        self._username = username

    def to_data(self):
        return {
            "username": self._username,
            "type": "global_join"
        }

    @staticmethod
    def from_data(data):
        return GlobalJoinPacket(
            data["username"]
        )