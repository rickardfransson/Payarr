import { useState } from "react";

import api from "../api/client";
import StatCard from "../components/StatCard";
import { useOverview } from "../hooks/useOverview";
import { createPayment } from "../services/paymentService";

import "../styles/payments.css";


function getPaymentStatus(status: string) {

    switch (status) {

        case "paid":
            return "🟢 Betald";

        case "reported":
            return "🟡 Betalning rapporterad";

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

    const [paymentInfo, setPaymentInfo] = useState<any>(null);

    const [reported, setReported] = useState(false);



    const handlePayment = async () => {

        try {

            const payment = await createPayment();

            console.log(payment);

            setPaymentInfo(payment);


        } catch (error) {

            console.error(error);

            alert(
                "Kunde inte skapa betalningen."
            );

        }

    };



    const handleReported = async () => {

        try {

            await api.post(
                `/payments/${paymentInfo.id}/reported`
            );


            setReported(true);


        } catch (error) {

            console.error(error);

            alert(
                "Kunde inte rapportera betalningen."
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



            {paymentInfo && (

                <div className="swish-box">


                    <h2>
                        🟡 Betala med Swish
                    </h2>


                    <p className="swish-amount">

                        {paymentInfo.amount} {paymentInfo.currency}

                    </p>



                    <div className="swish-details">


                        <p>
                            Swisha till:
                        </p>


                        <strong>
                            {paymentInfo.swish_number}
                        </strong>



                        <p>
                            Meddelande:
                        </p>


                        <strong>
                            {paymentInfo.message}
                        </strong>


                    </div>



                    {!reported ? (

                        <button
                            className="payment-button"
                            onClick={handleReported}
                        >
                            Jag har betalat
                        </button>

                    ) : (

                        <p className="payment-created">

                            🟡 Betalning rapporterad.
                            Vi kontrollerar Swish.

                        </p>

                    )}



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
                            value="Swish"
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