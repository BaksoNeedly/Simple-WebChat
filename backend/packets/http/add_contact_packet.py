from ..packet import Packet

class AddContactPacket(Packet):

    def __init__(self, username):
        self._username = username

    def get_type(self):
        return "add_contact"

    def to_data(self):
        return {
            "type": self.get_type(),
            "username": self._username
        }

    @staticmethod
    def from_data(data):
        return AddContactPacket(data["username"])

    def get_username(self) -> str:
        return self._username