from pathlib import Path
import config

class AssetManager:

    asset_path: dict[str, str] = {
        "js": "frontend/js",
        "css": "frontend/css",
        "html": "frontend/html",
        "jpg": "frontend/img"
    }

    @classmethod
    def serve(cls, file_name: str, directory: str = None):
        try:            
            parent = Path(__file__).parent.parent.parent
            name, ext = file_name.split(".", 1)

            if not directory:
                directory = cls.asset_path.get(ext)

            full_path = parent / directory / file_name

            if ext == "jpg":
                with open(full_path, "rb") as file:
                    return file.read()

            with open(full_path, "r", encoding=config.FORMAT) as file:
                return file.read()
        except FileNotFoundError:
            return "404 Not Found"