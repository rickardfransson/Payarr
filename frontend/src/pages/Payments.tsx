import { useState } from "react";

import StatCard from "../components/StatCard";
import { useOverview } from "../hooks/useOverview";
import { createPayment } from "../services/paymentService";

import "../styles/payments.css";


function getPaymentStatus(status: string) {
    switch (status) {
        case "paid":
            return "🟢 Betald";

        case "pending":
            return "🟡 Väntar på betalning";

        case "failed":
            return "🔴 Misslyckad";

        default:
            return status;
    }
}


function Payments() {

    const { overview, loading } = useOverview();

    const [paymentCreated, setPaymentCreated] = useState(false);


    const handlePayment = async () => {

        try {

            const payment = await createPayment();

            console.log(payment);

            if (payment.checkout_url) {
                window.location.href = payment.checkout_url;
            }

        } catch (error) {

            console.error(error);

            alert(
                "Kunde inte skapa betalningen."
            );

        }

    };


    if (loading) {
        return <p>Laddar betalningar...</p>;
    }


    const payment = overview?.last_payment;


    return (
        <div>

            <h1>
                Betalningar
            </h1>


            {paymentCreated && (

                <div className="payment-created">

                    <h3>
                        🟡 Betalning skapad
                    </h3>

                    <p>
                        Din betalning på 100 SEK är skapad.
                    </p>

                    <p>
                        Ditt Emby-konto aktiveras automatiskt inom 15 minuter efter genomförd betalning.
                    </p>

                </div>

            )}


            <p className="payments-info">
                Här kan du se din senaste betalning och hantera din prenumeration.
            </p>


            {!payment ? (

                <div>

                    <p>
                        Ingen betalning har registrerats ännu.
                    </p>

                    <button
                        className="payment-button"
                        onClick={handlePayment}
                    >
                        Betala nu
                    </button>

                </div>

            ) : (

                <>

                    <div className="payments-cards">

                        <StatCard
                            title="Belopp"
                            value={`${payment.amount} SEK`}
                        />

                        <StatCard
                            title="Status"
                            value={getPaymentStatus(payment.status)}
                        />

                        <StatCard
                            title="Betalningsmetod"
                            value="Bitcoin"
                        />

                    </div>


                    {payment.paid_at && (

                        <p className="payment-date">
                            Senast betald: {payment.paid_at}
                        </p>

                    )}


                    <button
                        className="payment-button"
                        onClick={handlePayment}
                    >
                        Betala nu
                    </button>

                </>

            )}

        </div>
    );
}


export default Payments;