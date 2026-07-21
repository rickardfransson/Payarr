from abc import ABC, abstractmethod


class PaymentProvider(ABC):

    @abstractmethod
    async def create_invoice(
        self,
        amount: float,
        currency: str,
        metadata: dict,
    ):
        pass