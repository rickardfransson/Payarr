from app.core.config import settings

from app.services.payment.providers.mock import MockPaymentProvider
from app.services.payment.btcpay import BTCPayClient


class PaymentProviderFactory:

    @staticmethod
    def get_provider():

        if settings.PAYMENT_PROVIDER == "btcpay":
            return BTCPayClient()

        return MockPaymentProvider()