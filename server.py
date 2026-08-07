from backend.http.http_server import HTTPServer
from backend.database.database_manager import DatabaseManager

DatabaseManager.connect()

db = DatabaseManager.get_connection()
cursor = db.cursor()

with cursor as cur:
    cur.execute("""
        CREATE TABLE IF NOT EXISTS chat_users(
            id SERIAL PRIMARY KEY,
            username TEXT,
            email TEXT,
            hash_password TEXT,
            is_verified BOOLEAN,
            verify_code VARCHAR(6),
            contacts TEXT
        )
    """)
    # cur.execute("ALTER TABLE chat_users ADD COLUMN contacts TEXT")

db.commit()

DatabaseManager.execute("""
    CREATE TABLE IF NOT EXISTS chat_rooms(
        serial_id SERIAL PRIMARY KEY,
        room_id TEXT,
        members TEXT
    )
""")

http_server = HTTPServer()
http_server.start()