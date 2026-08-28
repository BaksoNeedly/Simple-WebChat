from ..packet import Packet

class MessagePacket(Packet):

    def __init__(self, content: str, timestamp: str, sender: str, file: str, is_read: bool):
        self._content = content
        self._timestamp = timestamp
        self._sender = sender
        self._file = file
        self._is_read = is_read

    def to_data(self):
        return {
            "content": self._content,
            "timestamp": self._timestamp,
            "sender": self._sender,
            "file": self._file,
            "is_read": self._is_read,
            "type": "message"
        }

    @staticmethod
    def from_data(data):
        return MessagePacket(
            data["content"],
            data["timestamp"],
            data["sender"],
            data["file"],
            data["is_read"]
        )

    def read(self):
        self._is_read = True