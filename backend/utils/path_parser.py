class PathParser:

    @staticmethod
    def parse(path: str) -> list:
        return path.strip("/").split("/")