from ...database.database_manager import DatabaseManager
from ...utils.json_parser import JSONParser
import config
from ...user.user import User
from ...user.user_manager import UserManager

class Room:

    def __init__(self, room_id: int):
        self._id: int = room_id
        self._members: set[str] = set()

    def get_id(self) -> int:
        return self._id

    def get_online_members(self) -> list[User]:
        online_members = []
        for member_name in self.get_members():
            user = UserManager.get_by_name(member_name)
            if user:
                online_members.append(user)
        return online_members

    def get_members(self) -> list[str]:
        return list(self._members)

    def has_member(self, username: str) -> bool:
        return username in self._members

    def add_member(self, username: str) -> None:
        if username:
            self._members.add(username)

    def remove_member(self, username: str) -> None:
        self._members.discard(username)

    def save(self) -> None:
        DatabaseManager.execute(
            f"UPDATE {config.TABLE_CHAT_ROOMS} SET members = %s WHERE room_id = %s",
            (JSONParser.stringify(self.get_members()), self.get_id())
        )