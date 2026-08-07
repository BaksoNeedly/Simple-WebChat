from .packet import Packet

class OnlineUsers(Packet):
    def __init__(self, count):
        self.count = count

    def to_data(self):
        return {
            "type": "online_users",
            "count": self.count
        }

    @staticmethod
    def from_data(data):
        return super().from_data(data)