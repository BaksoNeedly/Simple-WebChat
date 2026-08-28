from ..database.database_manager import DatabaseManager
from ..models.room_member import RoomMember
import config


class RoomMemberRepository:

    @staticmethod
    def create(room_id: int, member_id: int) -> None:
        DatabaseManager.execute(
            f"""
            INSERT INTO {config.TABLE_CHAT_ROOM_MEMBERS}
                (room_id, member_id)
            VALUES (%s, %s)
            """,
            (room_id, member_id),
        )

    @staticmethod
    def get_by_id(membership_id: int) -> RoomMember | None:
        row = DatabaseManager.fetch_one(
            f"""
            SELECT id, room_id, member_id
            FROM {config.TABLE_CHAT_ROOM_MEMBERS}
            WHERE id = %s
            """,
            (membership_id,),
        )
        return RoomMemberRepository._row_to_room_member(row)

    @staticmethod
    def get_by_room_id(room_id: int) -> list[RoomMember]:
        rows = DatabaseManager.fetch_all(
            f"""
            SELECT id, room_id, member_id
            FROM {config.TABLE_CHAT_ROOM_MEMBERS}
            WHERE room_id = %s
            ORDER BY id
            """,
            (room_id,),
        )
        return [RoomMemberRepository._row_to_room_member(row) for row in rows]

    @staticmethod
    def exists(room_id: int, member_id: int) -> bool:
        row = DatabaseManager.fetch_one(
            f"""
            SELECT 1
            FROM {config.TABLE_CHAT_ROOM_MEMBERS}
            WHERE room_id = %s AND member_id = %s
            """,
            (room_id, member_id),
        )
        return row is not None

    @staticmethod
    def delete(room_id: int, member_id: int) -> None:
        DatabaseManager.execute(
            f"""
            DELETE FROM {config.TABLE_CHAT_ROOM_MEMBERS}
            WHERE room_id = %s AND member_id = %s
            """,
            (room_id, member_id),
        )

    @staticmethod
    def _row_to_room_member(row) -> RoomMember | None:
        if row is None:
            return None

        return RoomMember(
            membership_id=row[0],
            room_serial_id=row[1],
            member_id=row[2],
        )

    # Backward-compatible method name.
    get_by_room_serial_id = get_by_room_id
