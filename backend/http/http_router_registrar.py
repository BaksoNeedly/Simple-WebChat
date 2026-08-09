from backend.controllers.auth_controller import AuthController
from backend.controllers.user_controller import UserController
from backend.controllers.page_controller import PageController
from backend.controllers.asset_controller import AssetController
from .http_router import HTTPRouter
from ..controllers.page_controller import PageController

class HttpRouterRegistrar:
    def __init__(self, router: HTTPRouter):
        self._router = router

    def register_routes(self) -> None:
        # Main
        self._router.get("/", lambda request, client_socket: AssetController.serve_response("login.html"))

        # CSS
        self._router.get("/css/style.css", lambda request, client_socket: AssetController.serve_response("style.css"))
        self._router.get("/css/form.css", lambda request, client_socket: AssetController.serve_response("form.css"))
        self._router.get("/css/success.css", lambda request, client_socket: AssetController.serve_response("success.css"))
        self._router.get("/css/chat.css", lambda request, client_socket: AssetController.serve_response("chat.css"))

        # IMG
        self._router.get("/img/user_icon.jpg", lambda request, client_socket: AssetController.serve_response("user_icon.jpg"))

        # Login
        self._router.get("/page/login", lambda request, client_socket: AssetController.serve_response("login.html"))
        self._router.post("/auth/login", AuthController.login)

        self._router.get("/js/auth/login/Login.js", lambda request, client_socket: AssetController.serve_response("Login.js", "frontend/js/auth/login/"))
        self._router.get("/js/auth/login/LoginUI.js", lambda request, client_socket: AssetController.serve_response("LoginUI.js", "frontend/js/auth/login/"))
        self._router.get("/js/packets/LoginPacket.js", lambda request, client_socket: AssetController.serve_response("LoginPacket.js", "frontend/js/packets/"))

        # Register
        self._router.get("/page/register", lambda request, client_socket: AssetController.serve_response("register.html"))
        self._router.post("/auth/register", AuthController.register)

        self._router.get("/js/auth/register/Register.js", lambda request, client_socket: AssetController.serve_response("Register.js", "frontend/js/auth/register/"))
        self._router.get("/js/auth/register/RegisterUI.js", lambda request, client_socket: AssetController.serve_response("RegisterUI.js", "frontend/js/auth/register/"))
        self._router.get("/js/packets/RegisterPacket.js", lambda request, client_socket: AssetController.serve_response("RegisterPacket.js", "frontend/js/packets/"))
        self._router.get("/js/packets/http/UserPacket.js", lambda request, client_socket: AssetController.serve_response("UserPacket.js", "frontend/js/packets/http/"))

        # Chat
        self._router.get("/page/chat", lambda request, client_socket: AssetController.serve_response("chat.html"))

        self._router.post("/chat", UserController.chat)
        self._router.post("/chat/new", UserController.new_chat)

        self._router.get("/js/core/WebSocketClient.js", lambda request, client_socket: AssetController.serve_response("WebSocketClient.js", "frontend/js/core/"))
        self._router.get("/js/chat/Chat.js", lambda request, client_socket: AssetController.serve_response("Chat.js", "frontend/js/chat/"))
        self._router.get("/js/chat/ChatApp.js", lambda request, client_socket: AssetController.serve_response("ChatApp.js", "frontend/js/chat/"))
        self._router.get("/js/chat/ChatUI.js", lambda request, client_socket: AssetController.serve_response("ChatUI.js", "frontend/js/chat/"))
        self._router.get("/js/chat/NewChatUI.js", lambda request, client_socket: AssetController.serve_response("NewChatUI.js", "frontend/js/chat/"))
        self._router.get("/js/chat/SidebarUI.js", lambda request, client_socket: AssetController.serve_response("SidebarUI.js", "frontend/js/chat/"))
        self._router.get("/js/chat/ChatService.js", lambda request, client_socket: AssetController.serve_response("ChatService.js", "frontend/js/chat/"))

        self._router.get("/js/chat/models/Connect.js", lambda request, client_socket: AssetController.serve_response("Connect.js", "frontend/js/chat/models/"))
        self._router.get("/js/chat/packets/CreateRoom.js", lambda request, client_socket: AssetController.serve_response("CreateRoom.js", "frontend/js/chat/packets/"))
        self._router.get("/js/chat/message/Message.js", lambda request, client_socket: AssetController.serve_response("Message.js", "frontend/js/chat/message/"))
        self._router.get("/js/chat/message/MessageManager.js", lambda request, client_socket: AssetController.serve_response("MessageManager.js", "frontend/js/chat/message/"))

        self._router.get("/js/chat/user/User.js", lambda request, client_socket: AssetController.serve_response("User.js", "frontend/js/chat/user/"))
        self._router.get("/js/chat/user/UserService.js", lambda request, client_socket: AssetController.serve_response("UserService.js", "frontend/js/chat/user/"))
        self._router.get("/js/chat/user/Contact.js", lambda request, client_socket: AssetController.serve_response("Contact.js", "frontend/js/chat/user/"))

        self._router.get("/js/chat/room/Room.js", lambda request, client_socket: AssetController.serve_response("Room.js", "frontend/js/chat/room/"))
        self._router.get("/js/chat/room/RoomManager.js", lambda request, client_socket: AssetController.serve_response("RoomManager.js", "frontend/js/chat/room/"))
        
        self._router.get("/js/packets/NewChatPacket.js", lambda request, client_socket: AssetController.serve_response("NewChatPacket.js", "frontend/js/packets/"))
        self._router.get("/js/utils/TimeUtils.js", lambda request, client_socket: AssetController.serve_response("TimeUtils.js", "frontend/js/utils/"))
        self._router.get("/js/packets/websocket/MessagePacket.js", lambda request, client_socket: AssetController.serve_response("MessagePacket.js", "frontend/js/packets/websocket/"))
        self._router.get("/js/packets/websocket/JoinMessagePacket.js", lambda request, client_socket: AssetController.serve_response("JoinMessagePacket.js", "frontend/js/packets/websocket/"))
        self._router.get("/js/packets/websocket/MessageHistoryPacket.js", lambda request, client_socket: AssetController.serve_response("MessageHistoryPacket.js", "frontend/js/packets/websocket/"))


        # Packets
        self._router.get("/js/packets/websocket/GlobalJoinPacket.js", lambda request, client_socket: AssetController.serve_response("GlobalJoinPacket.js", "frontend/js/packets/websocket/"))
        self._router.get("/js/packets/websocket/UpdateStatusPacket.js", lambda request, client_socket: AssetController.serve_response("UpdateStatusPacket.js", "frontend/js/packets/websocket/"))
        self._router.get("/js/packets/websocket/TotalUserPacket.js", lambda request, client_socket: AssetController.serve_response("TotalUserPacket.js", "frontend/js/packets/websocket/"))


        # User
        self._router.get("/user/profile", UserController.load_chat)