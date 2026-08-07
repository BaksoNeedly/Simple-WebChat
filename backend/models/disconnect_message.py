class DisconnectMessage:

    def __init__(self, username: str, type: str = "disconnect_message"):
        self._username = username
        self._type = type

    def to_data(self) -> dict:
        return {
            "username": self.get_username(),
            "type": self.get_type()
        }

    def get_username(self) -> str:
        return self._username

    def get_type(self) -> str:
        return self._type