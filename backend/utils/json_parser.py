import config
import json

class JSONParser:

    @staticmethod
    def parse(raw_data: bytes) -> dict:
        return json.loads(raw_data.decode(config.FORMAT))

    @staticmethod
    def stringify(data) -> str:
        return json.dumps(data)