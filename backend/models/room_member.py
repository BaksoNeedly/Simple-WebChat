class RoomMember:

    def __init__(
        self,
        membership_id: int,
        room_serial_id: int,
        member_id: int,
    ):
        self._id = membership_id
        self._room_serial_id = room_serial_id
        self._member_id = member_id

    def get_id(self) -> int:
        return self._id

    def get_room_serial_id(self) -> int:
        return self._room_serial_id

    def get_member_id(self) -> int:
        return self._member_id

    def to_data(self) -> dict:
        return {
            "id": self._id,
            "room_serial_id": self._room_serial_id,
            "member_id": self._member_id,
        }
