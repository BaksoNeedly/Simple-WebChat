from ..packet import Packet

class VerificationCodePacket(Packet):

    def __init__(self, code):
        self._code = code

    def get_type(self):
        return "verification_code"

    def to_data(self):
        return {
            "type": self.get_type(),
            "code": self._code
        }

    @staticmethod
    def from_data(data):
        return VerificationCodePacket(data["code"])

    def get_code(self) -> str:
        return self._code