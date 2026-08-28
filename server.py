from backend.http.http_server import HTTPServer
from backend.database.database_manager import DatabaseManager
import config

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
        id SERIAL PRIMARY KEY,
        room_id TEXT
    )
""")

DatabaseManager.execute(f"""
    CREATE TABLE IF NOT EXISTS {config.TABLE_CHAT_ROOM_MEMBERS} (
        id SERIAL PRIMARY KEY,
        room_id INTEGER NOT NULL
            REFERENCES {config.TABLE_CHAT_ROOMS}(id),
        member_id INTEGER NOT NULL
            REFERENCES {config.TABLE_CHAT_USERS}(id)
    )
""")

DatabaseManager.execute(f"""
    CREATE TABLE IF NOT EXISTS {config.TABEL_CHAT_MESSAGES} (
        id SERIAL PRIMARY KEY,
        room_id TEXT,
        sender_id TEXT,
        message TEXT,
        created_at TEXT,
        is_read BOOLEAN DEFAULT FALSE
    )
""")

DatabaseManager.execute(f"""
    CREATE TABLE IF NOT EXISTS {config.TABLE_CHAT_MESSAGE_READS} (
        message_id INTEGER PRIMARY KEY REFERENCES {config.TABEL_CHAT_MESSAGES}(id) ON DELETE CASCADE,
        read_at BIGINT
    )
""")

DatabaseManager.execute(f"""
    CREATE TABLE IF NOT EXISTS {config.TABLE_CHAT_USER_CONTACTS} (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES {config.TABLE_CHAT_USERS}(id),
        contact_id INTEGER REFERENCES {config.TABLE_CHAT_USERS}(id),
        created_at BIGINT
    )
""")

# DatabaseManager.execute(f"""
#     ALTER TABLE chat_user_contacts
#     ALTER COLUMN created_at TYPE BIGINT;
# """)

# DatabaseManager.execute(f"""
#     CREATE TABLE IF NOT EXISTS {config.TABLE_CHAT_MESSAGES_META} (
#         id SERIAL PRIMARY KEY,    
#         message_id INTEGER,
#         is_read
#     )
# """)

http_server = HTTPServer()
http_server.start()