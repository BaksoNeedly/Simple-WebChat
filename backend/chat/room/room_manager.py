from .room import Room
import hashlib
import config
from ...user.user import User

class RoomManager:

    _rooms: dict[str, Room] = {}

    @classmethod
    def get_rooms(self) -> dict[str, Room]:
        return self._rooms

    @classmethod
    def get_room(self, name: str) -> Room|None:
        return self._rooms.get(name)

    @classmethod
    def add_room(self, room: Room, users: list[str] = []) -> None:
        self._rooms[room.get_id()] = room
        for _username in users:
            room.add_member(_username)

    @classmethod
    def remove_room(self, name: str) -> None:
        del self._rooms[name]

    @staticmethod
    def calculate(user1: str, user2: str) -> str:
        sorted_users = sorted([user1, user2])
        combined_string = f"{sorted_users[0]}:{sorted_users[1]}"
        room_id = hashlib.md5(combined_string.encode(config.FORMAT)).hexdigest()
        return room_id

    @classmethod
    def save(self) -> None:
        for _id, _room in self.get_rooms().items():
            _room.save()