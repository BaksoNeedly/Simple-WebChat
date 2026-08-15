import socket
from ..session.session import Session

class WebSocketClient:

    def __init__(self, client_socket: socket.socket, client_session: Session):
        self._client_socket = client_socket
        self._client_session = client_session

    def get_socket(self) -> socket.socket:
        return self._client_socket

    def get_session(self) -> Session:
        return self._client_session

    def get_id(self) -> str:
        return self.get_session().get_session_id()