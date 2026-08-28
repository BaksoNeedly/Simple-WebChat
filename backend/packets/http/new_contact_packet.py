from ..packet import Packet

class NewContactPacket(Packet):

    def __init__(self, username):
        self._username = username

    def get_type(self):
        return "new_contact"

    def to_data(self):
        return {
            "type": self.get_type(),
            "username": self._username
        }

    @staticmethod
    def from_data(data):
        return NewContactPacket(data["username"])

    def get_username(self) -> str:
        return self._username