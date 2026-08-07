from .websocket_client import WebSocketClient

class WebSocketClientManager:

    _clients: dict[str, WebSocketClient] = {}

    @classmethod
    def get(cls, session_id: str) -> WebSocketClient | None:
        return cls._clients.get(session_id)

    @classmethod
    def get_all(cls) -> dict[str, WebSocketClient]:
        return cls._clients

    @classmethod
    def set(cls, client: WebSocketClient) -> None:
        cls._clients[client.get_id()] = client

    @classmethod
    def remove(cls, client: WebSocketClient) -> WebSocketClient | None:
        return cls._clients.pop(client.get_id(), None)

    @classmethod
    def contains(cls, client: WebSocketClient) -> bool:
        return client.get_id() in cls._clients

    @classmethod
    def clear(cls) -> None:
        cls._clients.clear()

    @classmethod
    def size(cls) -> int:
        return len(cls._clients)

    @classmethod
    def close(cls, client: WebSocketClient) -> None:
        if client:
            websocket = client.get_socket()

            if websocket:
                websocket.close()

            cls.remove(client)