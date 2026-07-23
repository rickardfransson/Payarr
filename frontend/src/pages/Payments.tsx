import { useState } from "react";

import StatCard from "../components/StatCard";
import { useOverview } from "../hooks/useOverview";
import { createPayment } from "../services/paymentService";


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

            setPaymentCreated(true);

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

                <div
                    style={{
                        marginTop: "20px",
                        padding: "20px",
                        borderRadius: "8px",
                        background: "#fff3cd",
                    }}
                >

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


            <p
                style={{
                    color: "#666",
                    marginBottom: "30px",
                }}
            >
                Här kan du se din senaste betalning och hantera din prenumeration.
            </p>



            {!payment ? (

                <div>

                    <p>
                        Ingen betalning har registrerats ännu.
                    </p>


                    <button
                        onClick={handlePayment}
                        style={{
                            marginTop: "30px",
                            padding: "10px 20px",
                            cursor: "pointer",
                        }}
                    >
                        Betala nu
                    </button>

                </div>

            ) : (

                <>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "20px",
                            marginTop: "30px",
                        }}
                    >

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

                        <p
                            style={{
                                marginTop: "20px",
                            }}
                        >
                            Senast betald: {payment.paid_at}
                        </p>

                    )}



                    <button
                        onClick={handlePayment}
                        style={{
                            marginTop: "30px",
                            padding: "10px 20px",
                            cursor: "pointer",
                        }}
                    >
                        Betala nu
                    </button>


                </>

            )}

        </div>
    );
}


export default Payments;