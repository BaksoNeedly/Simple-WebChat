from ...route.route import Route
from ...route.endpoint import EndPoint

class Page(Route):

    def get_method(self) -> str:
        return "GET"

    def get_category(self) -> str:
        return "page"

    def init_endpoints(self):
        login = Login()
        return {
            login
        }


from ...controllers.page_controller import PageController
class Login(EndPoint):

    def get_path(self) -> str:
        return "login"

    def route(self):
        return PageController.login_page()