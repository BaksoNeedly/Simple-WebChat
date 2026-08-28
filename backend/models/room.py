from ..session.client_session_manager import ClientSessionManager
from ..session.client_session import ClientSession


class Room:
    """In-memory representation of a chat room."""

    def __init__(
        self,
        room_id: str,
        members: list[str] | None = None,
        serial_id: int | None = None,
    ):
        self._serial_id = serial_id
        self._id = room_id
        self._members: set[str] = set(members or [])
        self._messages = []

    @staticmethod
    def from_data(data: dict) -> "Room":
        return Room(
            data.get("room_id", data.get("identifier")),
            data.get("members", []),
            data.get("serial_id"),
        )

    def get_serial_id(self) -> int | None:
        return self._serial_id

    def set_serial_id(self, serial_id: int) -> None:
        self._serial_id = serial_id

    def get_id(self) -> str:
        return self._id

    def get_members(self) -> list[str]:
        return list(self._members)

    def get_online_members(self) -> list[ClientSession]:
        return [
            client_session
            for member_name in self._members
            if (client_session := ClientSessionManager.get_by_name(member_name))
        ]

    def has_member(self, username: str) -> bool:
        return username in self._members

    def add_member(self, username: str) -> None:
        if username:
            self._members.add(username)

    def remove_member(self, username: str) -> None:
        self._members.discard(username)

    def add_message(self, message) -> None:
        """Keep the message in runtime state; persistence is repository-owned."""
        self._messages.append(message)

    def get_messages(self) -> list:
        return list(self._messages)

    def mark_all_as_read(self) -> None:
        pass
