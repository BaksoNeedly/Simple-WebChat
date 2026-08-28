class Contact:

    def __init__(
        self,
        contact_record_id: int,
        user_id: int,
        contact_id: int,
        created_at: int,
    ):
        self._id = contact_record_id
        self._user_id = user_id
        self._contact_id = contact_id
        self._created_at = created_at

    def get_id(self) -> int:
        return self._id

    def get_user_id(self) -> int:
        return self._user_id

    def get_contact_id(self) -> int:
        return self._contact_id

    def get_created_at(self) -> int:
        return self._created_at

    def to_data(self) -> dict:
        return {
            "id": self._id,
            "user_id": self._user_id,
            "contact_id": self._contact_id,
            "created_at": self._created_at,
        }
