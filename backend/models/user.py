from ..session.session import Session
from ..database.database_manager import DatabaseManager

class User:

    def __init__(self, session: Session):
        self._session = session        

    def to_data(self) -> dict:
        db = DatabaseManager.get_connection()
        cursor = db.cursor()

        with cursor as cur:
            cur.execute("SELECT id FROM chat_users WHERE username=%s", (self.get_session().get_username(), ))
            user_data = cur.fetchone()
        return {
            "username": self.get_session().get_username(),
            "serial_id": user_data[0]
        }

    def get_session(self) -> Session:
        return self._session