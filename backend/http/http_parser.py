import config

class HTTPParser:

    @staticmethod
    def parse_request(request: bytes) -> dict:
        header_end = request.find(b"\r\n\r\n")
        header = request[:header_end]
        header_text = header.decode(config.FORMAT)
        lines = header_text.split("\r\n")
        method, path, version = lines[0].split(" ", 2)

        body = request[header_end + 4:]

        headers = {}
        for line in lines[1:]:
            key, value = line.split(":", 1)
            headers[key.strip().lower()] = value.strip()

        return {
            "method": method,
            "path": path,
            "version": version,
            "headers": headers,
            "header_end": header_end,
            "body": body
        }

    # @staticmethod
    # def parse_body(cls, client_socket: socket.socket, request: bytes) -> dict:
    #     request_data = cls.parse_request(request)
    #     header_end = request_data["header_end"]
    #     body = request[header_end + 4:]
    #     content_length = int(request_data["headers"].get("content-length", 0))

    #     while len(body) < content_length:
    #         chunk = client_socket.recv(config.BUFSIZE)
    #         if not chunk:
    #             break
    #         body += chunk

    #     request_data["body"] = body
    #     return request_data