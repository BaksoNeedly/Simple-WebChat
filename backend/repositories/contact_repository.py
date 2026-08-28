from ..database.database_manager import DatabaseManager
from ..models.contact import Contact
import config


class ContactRepository:

    @staticmethod
    def create(user_id: int, contact_id: int, created_at: int) -> None:
        DatabaseManager.execute(
            f"""
            INSERT INTO {config.TABLE_CHAT_USER_CONTACTS}
                (user_id, contact_id, created_at)
            VALUES (%s, %s, %s)
            """,
            (user_id, contact_id, created_at),
        )

    @staticmethod
    def get_by_id(contact_record_id: int) -> Contact | None:
        row = DatabaseManager.fetch_one(
            f"""
            SELECT id, user_id, contact_id, created_at
            FROM {config.TABLE_CHAT_USER_CONTACTS}
            WHERE id = %s
            """,
            (contact_record_id,),
        )
        return ContactRepository._row_to_contact(row)

    @staticmethod
    def get_by_user_id(user_id: int) -> list[Contact]:
        rows = DatabaseManager.fetch_all(
            f"""
            SELECT id, user_id, contact_id, created_at
            FROM {config.TABLE_CHAT_USER_CONTACTS}
            WHERE user_id = %s
            ORDER BY id
            """,
            (user_id,),
        )
        return [ContactRepository._row_to_contact(row) for row in rows]

    @staticmethod
    def exists(user_id: int, contact_id: int) -> bool:
        row = DatabaseManager.fetch_one(
            f"""
            SELECT 1
            FROM {config.TABLE_CHAT_USER_CONTACTS}
            WHERE user_id = %s AND contact_id = %s
            """,
            (user_id, contact_id),
        )
        return row is not None

    @staticmethod
    def delete(user_id: int, contact_id: int) -> None:
        DatabaseManager.execute(
            f"""
            DELETE FROM {config.TABLE_CHAT_USER_CONTACTS}
            WHERE user_id = %s AND contact_id = %s
            """,
            (user_id, contact_id),
        )

    @staticmethod
    def _row_to_contact(row) -> Contact | None:
        if row is None:
            return None

        return Contact(
            contact_record_id=row[0],
            user_id=row[1],
            contact_id=row[2],
            created_at=row[3],
        )
