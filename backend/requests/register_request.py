from backend.utils.json_parser import JSONParser

class RegisterRequest:

    def __init__(self, username: str, email: str, password: str, confirm_password: str):
        self._username = username
        self._email = email
        self._password = password
        self._confirm_password = confirm_password

    @classmethod
    def from_data(cls, data: bytes) -> RegisterRequest | None:
        data = JSONParser.parse(data)
        if data.get("type") != "register":
            return None
        return cls(data["username"], data["email"], data["password"], data["confirm_password"])

    def get_username(self) -> str:
        return self._username

    def get_email(self) -> str:
        return self._email

    def get_password(self) -> str:
        return self._password

    def get_confirm_password(self) -> str:
        return self._confirm_password