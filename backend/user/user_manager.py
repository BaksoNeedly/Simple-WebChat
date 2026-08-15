from .user import User

class UserManager:

    _clients: dict[str, User] = {}

    @classmethod
    def get(cls, session_id: str) -> User | None:
        return cls._clients.get(session_id)

    @classmethod
    def get_by_name(cls, username: str) -> User | None:
        for _id, _user in cls.get_all().items():
            if _user.get_username() == username:
                return _user

        return None

    @classmethod
    def get_all(cls) -> dict[str, User]:
        return cls._clients

    @classmethod
    def set(cls, client: User) -> None:
        cls._clients[client.get_session_id()] = client

    @classmethod
    def remove(cls, client: User) -> User | None:
        return cls._clients.pop(client.get_session_id(), None)

    @classmethod
    def contains(cls, client: User) -> bool:
        return client.get_session_id() in cls._clients

    @classmethod
    def clear(cls) -> None:
        cls._clients.clear()

    @classmethod
    def size(cls) -> int:
        return len(cls._clients)

    @classmethod
    def close(cls, client: User) -> None:
        if client:
            websocket = client.get_socket()

            if websocket:
                websocket.close()

            cls.remove(client)