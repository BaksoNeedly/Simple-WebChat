from ...models.room import Room

class PrivateRoom(Room):

    def __init__(self, id: int, user1_id: int, user2_id: int):
        super().__init__(id)

        self._user1_id = user1_id
        self._user2_id = user2_id

    def get_user1_id(self) -> int:
        return self._user1_id

    def get_user2_id(self) -> int:
        return self._user2_id
