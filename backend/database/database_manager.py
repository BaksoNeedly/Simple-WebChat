import config
import psycopg
from psycopg.rows import dict_row

class DatabaseManager:

    _connection: psycopg.Connection | None = None

    @classmethod
    def connect(cls) -> None:
        """Establishes a single connection to the PostgreSQL database."""
        try:
            cls._connection = psycopg.connect(
                host="localhost",
                port="5432",
                dbname="postgres",
                user="postgres",
                password=config.DB_PASSWORD
            )
            print("[DATABASE]", "Connected...")
        except psycopg.Error as error:
            print("[DATABASE]", f"Error connecting to PostgreSQL: {error}")
            cls._connection = None

    @classmethod
    def get_connection(cls) -> psycopg.Connection | None:
        """Returns the active connection, reconnecting automatically if it dropped."""
        if cls._connection is None or cls._connection.closed:
            cls.connect()
        return cls._connection

    @classmethod
    def execute(cls, query: str, params: tuple | list | dict = ()) -> None:
        """
        Executes an INSERT, UPDATE, or DELETE query and commits the transaction.
        
        Example:
            DatabaseManager.execute(
                f"INSERT INTO {config.TABLE_CHAT_USERS} (username, password) VALUES (%s, %s)", 
                (username, hashed_password)
            )
        """
        conn = cls.get_connection()
        if not conn:
            raise RuntimeError("[DATABASE] Execution failed: No active database connection.")

        try:
            with conn.cursor() as cur:
                cur.execute(query, params)
            conn.commit()
        except Exception:
            conn.rollback()
            raise

    @classmethod
    def fetch_one(cls, query: str, params: tuple | list | dict = (), as_dict: bool = False) -> dict | tuple | None:
        """
        Executes a SELECT query and returns the first matching record.
        Set as_dict=True to return a Python dictionary instead of a tuple.
        
        Example:
            user = DatabaseManager.fetch_one(
                f"SELECT * FROM {config.TABLE_CHAT_USERS} WHERE username = %s", 
                (username,), 
                as_dict=True
            )
        """
        conn = cls.get_connection()
        if not conn:
            raise RuntimeError("[DATABASE] Fetch failed: No active database connection.")

        row_factory = dict_row if as_dict else None
        with conn.cursor(row_factory=row_factory) as cur:
            cur.execute(query, params)
            return cur.fetchone()

    @classmethod
    def fetch_all(cls, query: str, params: tuple | list | dict = (), as_dict: bool = False) -> list:
        """
        Executes a SELECT query and returns all matching records.
        Set as_dict=True to return a list of Python dictionaries.
        
        Example:
            users = DatabaseManager.fetch_all(
                f"SELECT id, username FROM {config.TABLE_CHAT_USERS}", 
                as_dict=True
            )
        """
        conn = cls.get_connection()
        if not conn:
            raise RuntimeError("[DATABASE] Fetch failed: No active database connection.")

        row_factory = dict_row if as_dict else None
        with conn.cursor(row_factory=row_factory) as cur:
            cur.execute(query, params)
            return cur.fetchall()

    @classmethod
    def close(cls) -> None:
        """Closes the database connection cleanly on server shutdown."""
        if cls._connection and not cls._connection.closed:
            cls._connection.close()
            print("[DATABASE]", "Connection closed.")
            cls._connection = None
