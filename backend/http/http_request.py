from backend.http.http_parser import HTTPParser

class HTTPRequest:

    def __init__(self, raw: bytes):
        data = HTTPParser.parse_request(raw)
        self._data = data
        self._method = data["method"]
        self._path = data["path"]
        self._version = data["version"]
        self._headers = data["headers"]
        self._headers_end = data["header_end"]
        self._body = data["body"]

    def get_data(self):
        return self._data

    def get_method(self):
        return self._method

    def get_path(self):
        return self._path

    def get_version(self):
        return self._version

    def get_headers(self) -> dict:
        return self._headers

    def get_headers_end(self):
        return self._headers_end

    def get_body(self) -> bytes:
        return self._body