from backend.managers.asset_manager import AssetManager
from backend.http.http_response import HTTPResponse
import config

class PageController:

    _content_types: dict[str, str] = {
        "html": "text/html"
    }

    @staticmethod
    def serve_response(file_name: str, directory: str|None = None, content_type: str|None = None) -> HTTPResponse:
        asset = AssetManager.serve(file_name, directory)

        name, ext = file_name.split(".", 1)

        if not content_type:
            content_type = PageController._content_types.get(ext)

        return HTTPResponse(
            "HTTP/1.1",
            "200",
            "OK",
            {
                "Content-Length": len(asset.encode(config.FORMAT)),
                "Content-Type": content_type
            },
            asset
        )

    @staticmethod
    def chat_page(request=None) -> HTTPResponse:
        return PageController.serve_response(
            "chat.html",
            "frontend/html",
            "text/html"
        )

    @staticmethod
    def login_page(request=None) -> HTTPResponse:
        return PageController.serve_response(
            "login.html",
            "frontend/html",
            "text/html"
        )

    @staticmethod
    def register_page(request=None) -> HTTPResponse:
        return PageController.serve_response(
            "register.html",
            "frontend/html",
            "text/html"
        )
