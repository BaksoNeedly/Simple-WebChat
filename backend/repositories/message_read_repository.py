from ..database.database_manager import DatabaseManager
from ..models.message_read import MessageRead
import config


class MessageReadRepository:

    @staticmethod
    def mark_as_read(message_id: int, read_at: int) -> MessageRead:
        DatabaseManager.execute(
            f"""
            INSERT INTO {config.TABLE_CHAT_MESSAGE_READS}
                (message_id, read_at)
            VALUES (%s, %s)
            ON CONFLICT (message_id)
            DO UPDATE SET read_at = EXCLUDED.read_at
            """,
            (message_id, read_at),
        )
        return MessageRead(message_id=message_id, read_at=read_at)

    @staticmethod
    def get_by_message_id(message_id: int) -> MessageRead | None:
        row = DatabaseManager.fetch_one(
            f"""
            SELECT message_id, read_at
            FROM {config.TABLE_CHAT_MESSAGE_READS}
            WHERE message_id = %s
            """,
            (message_id,),
        )
        return MessageReadRepository._row_to_model(row)

    @staticmethod
    def exists(message_id: int) -> bool:
        row = DatabaseManager.fetch_one(
            f"""
            SELECT 1
            FROM {config.TABLE_CHAT_MESSAGE_READS}
            WHERE message_id = %s
            """,
            (message_id,),
        )
        return row is not None

    @staticmethod
    def delete_by_message_id(message_id: int) -> None:
        DatabaseManager.execute(
            f"""
            DELETE FROM {config.TABLE_CHAT_MESSAGE_READS}
            WHERE message_id = %s
            """,
            (message_id,),
        )

    @staticmethod
    def _row_to_model(row) -> MessageRead | None:
        if row is None:
            return None

        return MessageRead(
            message_id=row[0],
            read_at=row[1],
        )
