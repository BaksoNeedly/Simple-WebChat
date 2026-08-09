from ..packet import Packet

class MessageHistoryPacket(Packet):

    def __init__(
        self,
        content: str,
        timestamp: str,
        sender: str,
        receiver: str
    ):
        self._content = content
        self._timestamp = timestamp
        self._sender = sender
        self._receiver = receiver

    def to_data(self):
        return {
            "content": self._content,
            "timestamp": self._timestamp,
            "sender": self._sender,
            "receiver": self._receiver,
            "type": "message_history"
        }

    @staticmethod
    def from_data(data):
        return MessageHistoryPacket(
            data["content"],
            data["timestamp"],
            data["sender"],
            data["receiver"]
        )