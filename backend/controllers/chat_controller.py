from ..http.http_request import HTTPRequest
from ..http.http_response import HTTPResponse
from ..session.session_manager import SessionManager
from ..session.client_session_manager import ClientSessionManager as UserManager
from ..packets.http.search_user_packet import SearchUserPacket
from ..utils.json_parser import JSONParser
import config

class ChatController:

    @staticmethod
    def search_user(request: HTTPRequest) -> HTTPResponse:
        packet = SearchUserPacket.from_data(JSONParser.parse(request.get_body()))
        target_username = packet.get_username()
        target_user = UserManager.get_by_name(target_username)
        if target_user:
            status = "200"
            reason_phrase = "OK"
        else:
            status = "404"
            reason_phrase = "Not Found"
        return HTTPResponse(status=status, reason_phrase=reason_phrase)
