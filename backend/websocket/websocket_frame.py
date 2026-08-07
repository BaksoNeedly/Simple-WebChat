class WebSocketFrame:

    @staticmethod
    def parse(frame: bytes):
        byte2 = frame[2]
        length = byte2 & 0b01111111
        payload = frame[6:]
        mask_key = frame[2:6]

        numbers = []
        for i, byte in enumerate(payload):
            numbers.append(byte ^ mask_key[i % 4])

        return bytes(numbers)

    @staticmethod
    def build(data: bytes):
        byte1 = 0b10000001
        byte2 = len(data)
        return bytes([byte1, byte2]) + data