import hashlib

import config

from ..database.database_manager import DatabaseManager
from ..models.room import Room
from ..repositories.room_member_repository import RoomMemberRepository
from ..repositories.user_repository import UserRepository


class RoomRepository:
    """Room persistence and the process-local room cache."""

    _rooms: dict[str, Room] = {}

    @classmethod
    def get_rooms(cls) -> dict[str, Room]:
        return cls._rooms

    @classmethod
    def get_by_id(cls, room_id: str) -> Room | None:
        room = cls._rooms.get(room_id)
        if room:
            return room

        row = DatabaseManager.fetch_one(
            f"""
            SELECT id, room_id
            FROM {config.TABLE_CHAT_ROOMS}
            WHERE room_id = %s
            """,
            (room_id,),
        )

        if not row:
            return None

        room_serial_id = row[0]
        members = cls._get_member_usernames(room_serial_id)
        room = Room(row[1], members, room_serial_id)
        cls._rooms[room_id] = room
        return room

    @classmethod
    def create(cls, room: Room, members: list[str] | None = None) -> Room:
        for username in members or []:
            room.add_member(username)

        row = DatabaseManager.fetch_one(
            f"""
            SELECT id
            FROM {config.TABLE_CHAT_ROOMS}
            WHERE room_id = %s
            """,
            (room.get_id(),),
        )

        if row:
            room.set_serial_id(row[0])
        else:
            DatabaseManager.execute(
                f"""
                INSERT INTO {config.TABLE_CHAT_ROOMS} (room_id)
                VALUES (%s)
                """,
                (room.get_id(),),
            )
            row = DatabaseManager.fetch_one(
                f"""
                SELECT id
                FROM {config.TABLE_CHAT_ROOMS}
                WHERE room_id = %s
                """,
                (room.get_id(),),
            )
            room.set_serial_id(row[0])

        cls._sync_members(room)
        cls._rooms[room.get_id()] = room
        return room

    @classmethod
    def update(cls, room: Room) -> None:
        if room.get_serial_id() is None:
            cls.create(room)
            return

        cls._sync_members(room)

    @classmethod
    def _get_member_usernames(cls, room_id: int) -> list[str]:
        usernames = []
        for room_member in RoomMemberRepository.get_by_room_id(room_id):
            user = UserRepository.get_by_id(room_member.get_member_id())
            if user:
                usernames.append(user.get_username())
        return usernames

    @classmethod
    def _sync_members(cls, room: Room) -> None:
        room_id = room.get_serial_id()
        if room_id is None:
            return

        desired_member_ids = set()
        for username in room.get_members():
            user = UserRepository.get_by_username(username)
            if not user:
                continue

            member_id = user.get_id()
            desired_member_ids.add(member_id)

            if not RoomMemberRepository.exists(room_id, member_id):
                RoomMemberRepository.create(room_id, member_id)

        for room_member in RoomMemberRepository.get_by_room_id(room_id):
            if room_member.get_member_id() not in desired_member_ids:
                RoomMemberRepository.delete(room_id, room_member.get_member_id())

    @classmethod
    def remove(cls, room_id: str) -> None:
        cls._rooms.pop(room_id, None)

    @classmethod
    def save_all(cls) -> None:
        for room in cls._rooms.values():
            cls.update(room)

    @staticmethod
    def calculate(user1: str, user2: str) -> str:
        sorted_users = sorted([user1, user2])
        combined_string = f"{sorted_users[0]}:{sorted_users[1]}"
        return hashlib.md5(combined_string.encode(config.FORMAT)).hexdigest()

    # Compatibility names for existing callers.
    get_room = get_by_id
    add_room = create
    remove_room = remove
    save = save_all
