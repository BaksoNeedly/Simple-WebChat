# backend/controllers/file_controller.py

import socket
from pathlib import Path

from ..http.http_request import HTTPRequest
from ..http.http_response import HTTPResponse
from ..http.multipart import Multipart
from ..services.storage_service import StorageService
from ..utils.json_parser import JSONParser
from ..session.session_manager import SessionManager
from ..user.user_manager import UserManager


class FileController:

    @staticmethod
    def download(request: HTTPRequest):
        body = JSONParser.parse(request.get_body())
        file_name = body.get("file_name")
        file_path = StorageService.STORAGE_PATH / file_name
        with open(file_path, "rb") as file:
            content = file.read()
        return HTTPResponse(body=content)

    @staticmethod
    def upload(request: HTTPRequest):
        multipart = Multipart.parse(request)
        session = SessionManager.extract_session(request)
        if not session or not session.is_authenticated():
            return HTTPResponse(
                status="302",
                headers={
                    "Location": "/page/login"
                },
            )
        user = UserManager.get(session.get_session_id())
        if not user:
            return HTTPResponse(
                status="302",
                headers={
                    "Location": "/page/login"
                },
            )
        StorageService.save_user_file(user, multipart)
        print("WORK")
        return HTTPResponse()
