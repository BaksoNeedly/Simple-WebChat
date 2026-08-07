from ..packet import Packet

class JoinMessagePacket(Packet):

    def __init__(self, sender: str):
        self._sender = sender

    def to_data(self):
        return {
            "sender": self._sender,
            "type": "join_message"
        }

    @staticmethod
    def from_data(data):
        return JoinMessagePacket(
            data["sender"]
        )