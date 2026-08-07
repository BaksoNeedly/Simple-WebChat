from ..http.http_request import HTTPRequest
from ..http.http_response import HTTPResponse
import config
import hashlib
import base64
import socket

class WebSocketHandshake:

    @staticmethod
    def perform(client_socket: socket.socket, request: HTTPRequest):
        key = str(request.get_headers().get("sec-websocket-key"))
        accept_key = base64.b64encode(
            hashlib.sha1(
                (key + config.GUID).encode(config.FORMAT)
            ).digest()
        ).decode(config.FORMAT)
        response = HTTPResponse(status="101", reason_phrase="Switching Protocols", headers={
            "Upgrade": "websocket",
            "Connection": "upgrade",
            "Sec-WebSocket-Accept": accept_key
        })
        client_socket.sendall(response.build())