from backend.controllers.asset_controller import AssetController
from backend.controllers.auth_controller import AuthController
from backend.controllers.file_controller import FileController
from backend.controllers.user_controller import UserController
from backend.controllers.chat_controller import ChatController
from backend.controllers.room_controller import RoomController
from .http_router import HTTPRouter


class HttpRouterRegistrar:
    def __init__(self, router: HTTPRouter):
        self._router = router

    def register_routes(self) -> None:
        # Main
        self._router.get(
            "/", lambda request: AssetController.serve_response("login.html")
        )

        # CSS
        self._router.get("/css/style.css", lambda request: AssetController.serve_response("style.css"))
        self._router.get("/css/form.css", lambda request: AssetController.serve_response("form.css"))
        self._router.get("/css/success.css", lambda request: AssetController.serve_response("success.css"))
        self._router.get("/css/chat.css", lambda request: AssetController.serve_response("chat.css"))

        # IMG
        self._router.get(
            "/img/user_icon.jpg",
            lambda request: AssetController.serve_response("user_icon.jpg"),
        )

        # Login
        self._router.get("/page/login", lambda request: AssetController.serve_response("login.html"))
        self._router.post("/auth/login", AuthController.login)

        self._router.get(
            "/js/auth/login/Login.js",
            lambda request: AssetController.serve_response(
                "Login.js", "frontend/js/auth/login/"
            ),
        )
        self._router.get(
            "/js/auth/login/LoginUI.js",
            lambda request: AssetController.serve_response(
                "LoginUI.js", "frontend/js/auth/login/"
            ),
        )
        self._router.get(
            "/js/packets/LoginPacket.js",
            lambda request: AssetController.serve_response(
                "LoginPacket.js", "frontend/js/packets/"
            ),
        )

        # Register
        self._router.get("/page/register", lambda request: AssetController.serve_response("register.html"))
        self._router.post("/auth/register", AuthController.register)

        # Email verification
        self._router.get("/page/verification", lambda request: AssetController.serve_response("verification.html"))
        self._router.get("/js/auth/verification/Verification.js", lambda request: AssetController.serve_response("Verification.js", "frontend/js/auth/verification/"))
        self._router.get("/js/auth/verification/VerificationHeaderUI.js", lambda request: AssetController.serve_response("VerificationHeaderUI.js", "frontend/js/auth/verification/"))
        self._router.get("/js/auth/verification/VerificationBodyUI.js", lambda request: AssetController.serve_response("VerificationBodyUI.js", "frontend/js/auth/verification/"))
        self._router.get("/js/auth/verification/VerificationFooterUI.js", lambda request: AssetController.serve_response("VerificationFooterUI.js", "frontend/js/auth/verification/"))
        self._router.get("/page/verified", lambda request: AssetController.serve_response("verified.html"))
        self._router.get("/css/verified.css", lambda request: AssetController.serve_response("verified.css"))
        self._router.get("/css/verification.css", lambda request: AssetController.serve_response("verification.css"))
        self._router.get("/js/auth/verification/Verification.js", lambda request: AssetController.serve_response("Verification.js", "frontend/js/auth/verification/"))

        self._router.get("/js/auth/register/Register.js", lambda request: AssetController.serve_response("Register.js", "frontend/js/auth/register/"))
        self._router.get("/js/auth/register/RegisterUI.js", lambda request: AssetController.serve_response("RegisterUI.js", "frontend/js/auth/register/"))
        self._router.get("/js/packets/RegisterPacket.js", lambda request: AssetController.serve_response("RegisterPacket.js", "frontend/js/packets/"))
        self._router.get("/js/packets/http/UserPacket.js", lambda request: AssetController.serve_response("UserPacket.js", "frontend/js/packets/http/"))
        self._router.get("/js/packets/http/SearchUserPacket.js", lambda request: AssetController.serve_response("SearchUserPacket.js", "frontend/js/packets/http/"))
        self._router.get("/js/packets/http/NewChatPacket.js", lambda request: AssetController.serve_response("NewChatPacket.js", "frontend/js/packets/http/"))
        self._router.get("/js/packets/http/NewContactPacket.js", lambda request: AssetController.serve_response("NewContactPacket.js", "frontend/js/packets/http/"))

        # Chat
        self._router.get("/page/chat", lambda request: AssetController.serve_response("chat.html"))

        # self._router.post("/chat", UserController.chat)
        self._router.post("/chat/new", UserController.new_chat)
        self._router.post("/chat/search", ChatController.search_user)

        self._router.get("/js/core/WebSocketClient.js", lambda request: AssetController.serve_response("WebSocketClient.js", "frontend/js/core/"))
        self._router.get("/js/core/ApiResponse.js", lambda request: AssetController.serve_response("ApiResponse.js", "frontend/js/core/"))
        self._router.get("/js/chat/Chat.js", lambda request: AssetController.serve_response("Chat.js", "frontend/js/chat/"))
        self._router.get("/js/chat/ChatApp.js", lambda request: AssetController.serve_response("ChatApp.js", "frontend/js/chat/"))
        self._router.get("/js/chat/ui/chat/ChatUI.js", lambda request: AssetController.serve_response("ChatUI.js", "frontend/js/chat/ui/chat"))
        self._router.get("/js/chat/ui/chat/ChatHeaderUI.js", lambda request: AssetController.serve_response("ChatHeaderUI.js", "frontend/js/chat/ui/chat"))
        self._router.get("/js/chat/ui/chat/ChatBodyUI.js", lambda request: AssetController.serve_response("ChatBodyUI.js", "frontend/js/chat/ui/chat"))
        self._router.get("/js/chat/ui/chat/area/ChatAreaUI.js", lambda request: AssetController.serve_response("ChatAreaUI.js", "frontend/js/chat/ui/chat/area"))
        self._router.get("/js/chat/ui/chat/area/ChatAreaHeaderUI.js", lambda request: AssetController.serve_response("ChatAreaHeaderUI.js", "frontend/js/chat/ui/chat/area"))
        self._router.get("/js/chat/ui/chat/area/ChatAreaBodyUI.js", lambda request: AssetController.serve_response("ChatAreaBodyUI.js", "frontend/js/chat/ui/chat/area"))
        self._router.get("/js/chat/ui/chat/area/ChatAreaFooterUI.js", lambda request: AssetController.serve_response("ChatAreaFooterUI.js", "frontend/js/chat/ui/chat/area"))
        self._router.get("/js/chat/ui/chat/list/ChatListUI.js", lambda request: AssetController.serve_response("ChatListUI.js", "frontend/js/chat/ui/chat/list"))
        self._router.get("/js/chat/ui/chat/list/ChatListHeaderUI.js", lambda request: AssetController.serve_response("ChatListHeaderUI.js", "frontend/js/chat/ui/chat/list"))
        self._router.get("/js/chat/ui/chat/list/ChatListBodyUI.js", lambda request: AssetController.serve_response("ChatListBodyUI.js", "frontend/js/chat/ui/chat/list"))
        self._router.get("/js/chat/ui/chat/list/ChatListFooterUI.js", lambda request: AssetController.serve_response("ChatListFooterUI.js", "frontend/js/chat/ui/chat/list"))
        self._router.get(
            "/js/chat/ui/overlay/new-chat/NewChatUI.js",
            lambda request: AssetController.serve_response(
                "NewChatUI.js", "frontend/js/chat/ui/overlay/new-chat/"
            ),
        )
        self._router.get(
            "/js/chat/ui/overlay/settings/SettingsUI.js",
            lambda request: AssetController.serve_response(
                "SettingsUI.js", "frontend/js/chat/ui/overlay/settings/"
            ),
        )
        self._router.get("/js/chat/ui/overlay/settings/SettingsHeaderUI.js", lambda request: AssetController.serve_response("SettingsHeaderUI.js", "frontend/js/chat/ui/overlay/settings/"))
        self._router.get("/js/chat/ui/overlay/settings/SettingsBodyUI.js", lambda request: AssetController.serve_response("SettingsBodyUI.js", "frontend/js/chat/ui/overlay/settings/"))
        self._router.get("/js/chat/ui/overlay/settings/SettingsFooterUI.js", lambda request: AssetController.serve_response("SettingsFooterUI.js", "frontend/js/chat/ui/overlay/settings/"))
        self._router.get(
            "/js/chat/ui/overlay/new-chat/NewChatHeaderUI.js",
            lambda request: AssetController.serve_response(
                "NewChatHeaderUI.js", "frontend/js/chat/ui/overlay/new-chat/"
            ),
        )
        self._router.get(
            "/js/chat/ui/overlay/new-chat/NewChatBodyUI.js",
            lambda request: AssetController.serve_response(
                "NewChatBodyUI.js", "frontend/js/chat/ui/overlay/new-chat/"
            ),
        )
        self._router.get(
            "/js/chat/ui/overlay/new-chat/NewChatFooterUI.js",
            lambda request: AssetController.serve_response(
                "NewChatFooterUI.js", "frontend/js/chat/ui/overlay/new-chat/"
            ),
        )
        self._router.get("/js/chat/ui/sidebar/SidebarUI.js", lambda request: AssetController.serve_response("SidebarUI.js", "frontend/js/chat/ui/sidebar"))
        self._router.get("/js/chat/ui/sidebar/SidebarHeaderUI.js", lambda request: AssetController.serve_response("SidebarHeaderUI.js", "frontend/js/chat/ui/sidebar"))
        self._router.get("/js/chat/ui/sidebar/SidebarBodyUI.js", lambda request: AssetController.serve_response("SidebarBodyUI.js", "frontend/js/chat/ui/sidebar"))
        self._router.get("/js/chat/ui/sidebar/SidebarFooterUI.js", lambda request: AssetController.serve_response("SidebarFooterUI.js", "frontend/js/chat/ui/sidebar"))
        self._router.get("/js/chat/ChatService.js", lambda request: AssetController.serve_response("ChatService.js", "frontend/js/chat/"))

        self._router.get("/js/chat/models/Connect.js", lambda request: AssetController.serve_response("Connect.js", "frontend/js/chat/models/"))
        self._router.get("/js/chat/packets/CreateRoom.js", lambda request: AssetController.serve_response("CreateRoom.js", "frontend/js/chat/packets/"))
        self._router.get("/js/chat/message/Message.js", lambda request: AssetController.serve_response("Message.js", "frontend/js/chat/message/"))
        self._router.get("/js/chat/message/MessageManager.js", lambda request: AssetController.serve_response("MessageManager.js", "frontend/js/chat/message/"))

        self._router.get("/js/chat/user/User.js", lambda request: AssetController.serve_response("User.js", "frontend/js/chat/user/"))
        self._router.get("/js/chat/user/UserService.js", lambda request: AssetController.serve_response("UserService.js", "frontend/js/chat/user/"))
        self._router.get("/js/chat/user/Contact.js", lambda request: AssetController.serve_response("Contact.js", "frontend/js/chat/user/"))

        self._router.get("/js/chat/room/Room.js", lambda request: AssetController.serve_response("Room.js", "frontend/js/chat/room/"))
        self._router.get("/js/chat/room/RoomManager.js", lambda request: AssetController.serve_response("RoomManager.js", "frontend/js/chat/room/"))
        self._router.get("/js/chat/room/RoomService.js", lambda request: AssetController.serve_response("RoomService.js", "frontend/js/chat/room/"))
        self._router.get("/js/packets/NewChatPacket.js", lambda request: AssetController.serve_response("NewChatPacket.js", "frontend/js/packets/"))
        self._router.get("/js/utils/TimeUtils.js", lambda request: AssetController.serve_response("TimeUtils.js", "frontend/js/utils/"))
        self._router.get("/js/packets/websocket/MessagePacket.js", lambda request: AssetController.serve_response("MessagePacket.js", "frontend/js/packets/websocket/"))
        self._router.get("/js/packets/websocket/JoinMessagePacket.js", lambda request: AssetController.serve_response("JoinMessagePacket.js", "frontend/js/packets/websocket/"))
        self._router.get("/js/packets/websocket/MessageHistoryPacket.js", lambda request: AssetController.serve_response("MessageHistoryPacket.js", "frontend/js/packets/websocket/"))
        self._router.get("/js/packets/websocket/FilePacket.js", lambda request: AssetController.serve_response("FilePacket.js", "frontend/js/packets/websocket/"))
        self._router.get("/js/packets/websocket/EnterRoomPacket.js", lambda request: AssetController.serve_response("EnterRoomPacket.js", "frontend/js/packets/websocket/"))
        self._router.get("/js/packets/websocket/UserEnterRoomPacket.js", lambda request: AssetController.serve_response("UserEnterRoomPacket.js", "frontend/js/packets/websocket/"))
        self._router.get("/js/packets/websocket/LeaveRoomPacket.js", lambda request: AssetController.serve_response("LeaveRoomPacket.js", "frontend/js/packets/websocket/"))
        # Packets
        self._router.get("/js/packets/websocket/GlobalJoinPacket.js", lambda request: AssetController.serve_response("GlobalJoinPacket.js", "frontend/js/packets/websocket/"))
        self._router.get("/js/packets/websocket/UpdateStatusPacket.js", lambda request: AssetController.serve_response("UpdateStatusPacket.js", "frontend/js/packets/websocket/"))
        self._router.get("/js/packets/websocket/TotalUserPacket.js", lambda request: AssetController.serve_response("TotalUserPacket.js", "frontend/js/packets/websocket/"))

        # User
        self._router.get("/user/profile", UserController.load_chat)
        self._router.get("/user/contact", UserController.load_contact)
        self._router.post("/user/contact/new", UserController.new_contact)
        self._router.get("/user/message", UserController.load_contact)
        self._router.get("/user/verify", UserController.verify)

        self._router.post("/download", FileController.download)
        self._router.post("/upload", FileController.upload)


        # Room
        self._router.post("/room/message", RoomController.load_message)
