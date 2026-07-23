from app.core.config import settings

from app.services.payment.providers.mock import MockPaymentProvider
from app.services.payment.btcpay import BTCPayClient
from app.services.payment.swish import SwishProvider


class PaymentProviderFactory:

    @staticmethod
    def get_provider():

        if settings.PAYMENT_PROVIDER == "btcpay":
            return BTCPayClient()

        if settings.PAYMENT_PROVIDER == "swish":
            return SwishProvider()

        return MockPaymentProvider()