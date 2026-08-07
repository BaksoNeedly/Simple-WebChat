import config

class CookieParser:

    @staticmethod
    def parse(data: bytes, delimiter: str="=") -> dict:
        str_data = data.decode(config.FORMAT)
