from ..packet import Packet

class UserPacket(Packet):

    def __init__(self, username: str):
        self._username = username

    def get_type(self):
        return "user"

    def to_data(self):
        return {
            "type": self.get_type(),
            "username": self.get_username()
        }

    @staticmethod
    def from_data(data):
        return UserPacket(data["username"])

    def get_username(self) -> str:
        return self._username