class MessageRead:

    def __init__(self, message_id: int, read_at: int):
        self._message_id = message_id
        self._read_at = read_at

    def to_data(self) -> dict:
        return {
            "message_id": self._message_id,
            "read_at": self._read_at,
        }

    def get_message_id(self) -> int:
        return self._message_id

    def get_read_at(self) -> int:
        return self._read_at
