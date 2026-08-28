class Message:

    def __init__(
        self,
        room_id,
        content: str,
        created_at: str,
        sender_id: str,
        is_read: bool = False,
        message_id: int | None = None,
    ):
        self._id = message_id
        self._room_id = room_id
        self._sender_id = sender_id
        self._content = content
        self._created_at = created_at
        self._is_read = is_read

    def to_data(self) -> dict:
        return {
            "id": self._id,
            "room_id": self._room_id,
            "content": self._content,
            "created_at": self._created_at,
            "sender_id": self._sender_id,
            "is_read": self._is_read
        }

    def get_id(self) -> int:
        return self._id

    def set_id(self, message_id: int) -> None:
        self._id = message_id

    def get_room_id(self) -> str:
        return self._room_id

    def get_content(self) -> str:
        return self._content

    def get_created_at(self) -> str:
        return self._created_at

    def get_sender_id(self) -> str:
        return self._sender_id

    def is_read(self) -> bool:
        return self._is_read

    def mark_as_read(self) -> None:
        self._is_read = True
