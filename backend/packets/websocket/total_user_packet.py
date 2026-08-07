from ..packet import Packet

class TotalUserPacket(Packet):

    def __init__(self, online_users: int):
        self._online_users = online_users

    def to_data(self):
        return {
            "type": "total_user",
            "online_users": self._online_users
        }

    @staticmethod
    def from_data(data):
        return TotalUserPacket(
            data["online_users"]
        )