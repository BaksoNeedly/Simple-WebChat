from backend.utils.json_parser import JSONParser

class LoginRequest:

    def __init__(self, username: str, password: str):
        self._username = username
        self._password = password

    @classmethod
    def from_data(cls, data: bytes) -> LoginRequest | None:
        data = JSONParser.parse(data)
        if data.get("type") != "login":
            return None
        return cls(data["username"], data["password"])

    def get_username(self) -> str:
        return self._username

    def get_password(self) -> str:
        return self._password