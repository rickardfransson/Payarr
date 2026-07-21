from abc import ABC, abstractmethod


class PaymentProvider(ABC):

    @abstractmethod
    async def create_invoice(self, *args, **kwargs):
        pass

    @abstractmethod
    async def get_invoice(self, invoice_id: str):
        pass