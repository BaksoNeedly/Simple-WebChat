from .packet import Packet
from ..session.session_manager import SessionManager

class SearchUser(Packet):

    def __init__(self, username: str):
        self._username = username
        super().__init__("search_user")

    def to_data(self) -> dict:
        session = SessionManager.get_by_name(self._username)
        return {
            "type": self.get_type(),
            "username": self._username,
            "valid": True if session and session.is_authenticated() else False
        }

    @staticmethod
    def from_data(data: dict) -> SearchUser:
        return SearchUser(data["username"])