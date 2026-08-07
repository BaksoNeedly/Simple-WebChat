from backend.utils.json_parser import JSONParser

class ChatMessage:

    def __init__(self, content: str, username: str, timestamp: str, type: str = "chat_message"):
        self._content = content
        self._username = username
        self._timestamp = timestamp
        self._type = type

    @staticmethod
    def from_data(data: bytes) -> ChatMessage:
        data = JSONParser.parse(data)
        return ChatMessage(
            data["content"],
            data["username"],
            data["timestamp"],
            data["type"]
        )

    def to_data(self) -> dict:
        return {
            "content": self.get_content(),
            "username": self.get_username(),
            "timestamp": self.get_timestamp(),
            "type": self.get_type()
        }

    def get_content(self) -> str:
        return self._content

    def get_username(self) -> str:
        return self._username

    def get_timestamp(self) -> str:
        return self._timestamp

    def get_type(self) -> str:
        return self._type