from backend.http.http_request import HTTPRequest
from backend.http.http_response import HTTPResponse

class HTTPRouter:

    def __init__(self):
        self._routers = {}

    def get(self, path: str, handler: callable):
        self._routers[("GET", path)] = handler

    def post(self, path: str, handler: callable):
        self._routers[("POST", path)] = handler

    def route(self, request: HTTPRequest, client_socket) -> HTTPResponse | None:
        method = request.get_method()
        path = request.get_path()

        handler = self._routers.get((method, path))
        if not handler:
            return None

        return handler(request, client_socket)