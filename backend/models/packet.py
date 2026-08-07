from abc import ABC, abstractmethod

class Packet:

    @abstractmethod
    def to_data(self) -> dict: pass

    @staticmethod
    @abstractmethod
    def from_data(data) -> Packet: pass