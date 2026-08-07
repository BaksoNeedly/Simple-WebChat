import socket
from ..session.session import Session
from ..database.database_manager import DatabaseManager
import config
from ..utils.json_parser import JSONParser

class User:

    def __init__(self, client_socket: socket.socket, client_session: Session):
        self._client_socket = client_socket
        self._client_session = client_session
        self._contacts: list[str] = []
        self._serial_id = None        
        self._current_room: str = None
        self.initialize()

    def initialize(self) -> None:
        db = DatabaseManager.get_connection()
        cursor = db.cursor()
        with cursor as cur:
            cur.execute(f"SELECT id, contacts FROM {config.TABLE_CHAT_USERS} WHERE username=%s", (self.get_username(),))
            data = cur.fetchone()
            # print(data)

        if data:
            self._serial_id = data[0]
            raw_contacts = data[1]
            if raw_contacts:
                parsed = JSONParser.parse(str(raw_contacts).encode(config.FORMAT))
                self._contacts.extend(parsed)
                # print(parsed)

    def to_data(self) -> list:
        return {
            "username": self.get_username(),
            "contacts": JSONParser.stringify(self.get_contacts())
        }

    def get_socket(self) -> socket.socket:
        return self._client_socket

    def get_session(self) -> Session:
        return self._client_session

    def get_username(self) -> str:
        return self.get_session().get_username()

    def get_id(self) -> str:
        return self.get_session().get_id()

    def get_contacts(self) -> list:
        return self._contacts

    def has_contact(self, username: str) -> bool:
        return username in self._contacts

    def get_contact(self, username: str) -> User|None:
        return self._contacts.get(username)

    def add_contact(self, user: User) -> None:
        self._contacts.append(user.get_username())
        print("CONTACTS: ", self._contacts)
        # print(f"USER: {user.get_username()} has been added into {self.get_username()}")
        DatabaseManager.execute(f"UPDATE {config.TABLE_CHAT_USERS} SET contacts = %s WHERE username = %s", (JSONParser.stringify(self.get_contacts()), self.get_username()))

    def remove_contact(self, username: str) -> None:
        del self._contacts[username]

    def get_serial_id(self) -> int|None:
        return self._serial_id

    def get_current_room_id(self):
        return self._current_room

    def set_current_room_id(self, room_id: str):
        self._current_room = room_id