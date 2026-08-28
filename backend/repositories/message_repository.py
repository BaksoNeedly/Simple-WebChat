from ..database.database_manager import DatabaseManager
from ..models.message import Message
import config


class MessageRepository:

    @staticmethod
    def _rows_to_messages(rows):
        return [
            Message(
                message_id=row[0],
                room_id=row[1],
                content=row[3],
                created_at=row[4],
                sender_id=row[2],
                is_read=row[5],
            )
            for row in rows
        ]

    @staticmethod
    def get_messages():
        rows = DatabaseManager.fetch_all(f"""
            SELECT id, room_id, sender_id, message, created_at, is_read
            FROM {config.TABEL_CHAT_MESSAGES}
            ORDER BY created_at ASC
        """)

        return MessageRepository._rows_to_messages(rows)

    @staticmethod
    def get_messages_by_room_id(room_id: str):
        rows = DatabaseManager.fetch_all(f"""
            SELECT id, room_id, sender_id, message, created_at, is_read
            FROM {config.TABEL_CHAT_MESSAGES}
            WHERE room_id = %s
            ORDER BY created_at ASC
        """, (room_id,))

        return MessageRepository._rows_to_messages(rows)

    @staticmethod
    def get_messages_by_sender_id(sender_id: str):
        rows = DatabaseManager.fetch_all(f"""
            SELECT id, room_id, sender_id, message, created_at, is_read
            FROM {config.TABEL_CHAT_MESSAGES}
            WHERE sender_id = %s
            ORDER BY created_at ASC
        """, (sender_id,))

        return MessageRepository._rows_to_messages(rows)

    @staticmethod
    def get_read_messages():
        rows = DatabaseManager.fetch_all(f"""
            SELECT id, room_id, sender_id, message, created_at, is_read
            FROM {config.TABEL_CHAT_MESSAGES}
            WHERE is_read IS TRUE
            ORDER BY created_at ASC
        """)

        return MessageRepository._rows_to_messages(rows)

    @staticmethod
    def get_unread_messages():
        rows = DatabaseManager.fetch_all(f"""
            SELECT id, room_id, sender_id, message, created_at, is_read
            FROM {config.TABEL_CHAT_MESSAGES}
            WHERE is_read IS FALSE
            ORDER BY created_at ASC
        """)

        return MessageRepository._rows_to_messages(rows)

    @staticmethod
    def get_read_messages_by_room_id(room_id: str):
        rows = DatabaseManager.fetch_all(f"""
            SELECT id, room_id, sender_id, message, created_at, is_read
            FROM {config.TABEL_CHAT_MESSAGES}
            WHERE room_id = %s
            AND is_read IS TRUE
            ORDER BY created_at ASC
        """, (room_id,))

        return MessageRepository._rows_to_messages(rows)

    @staticmethod
    def get_unread_messages_by_room_id(room_id: str):
        rows = DatabaseManager.fetch_all(f"""
            SELECT id, room_id, sender_id, message, created_at, is_read
            FROM {config.TABEL_CHAT_MESSAGES}
            WHERE room_id = %s
            AND is_read IS FALSE
            ORDER BY created_at ASC
        """, (room_id,))

        return MessageRepository._rows_to_messages(rows)

    @staticmethod
    def get_read_messages_by_sender_id(sender_id: str):
        rows = DatabaseManager.fetch_all(f"""
            SELECT id, room_id, sender_id, message, created_at, is_read
            FROM {config.TABEL_CHAT_MESSAGES}
            WHERE sender_id = %s
            AND is_read IS TRUE
            ORDER BY created_at ASC
        """, (sender_id,))

        return MessageRepository._rows_to_messages(rows)

    @staticmethod
    def get_unread_messages_by_sender_id(sender_id: str):
        rows = DatabaseManager.fetch_all(f"""
            SELECT id, room_id, sender_id, message, created_at, is_read
            FROM {config.TABEL_CHAT_MESSAGES}
            WHERE sender_id = %s
            AND is_read IS FALSE
            ORDER BY created_at ASC
        """, (sender_id,))

        return MessageRepository._rows_to_messages(rows)

    @staticmethod
    def add_message(message: Message) -> Message:
        row = DatabaseManager.fetch_one(
            f"""
            INSERT INTO {config.TABEL_CHAT_MESSAGES}
                (room_id, sender_id, message, created_at, is_read)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
            """,
            (
                message.get_room_id(),
                message.get_sender_id(),
                message.get_content(),
                message.get_created_at(),
                message.is_read(),
            ),
        )
        message.set_id(row[0])
        return message

    @staticmethod
    def remove_message(message_id: str):
        DatabaseManager.execute(
            f"""
            DELETE FROM {config.TABEL_CHAT_MESSAGES}
            WHERE id = %s
            """,
            (message_id, )
        )
