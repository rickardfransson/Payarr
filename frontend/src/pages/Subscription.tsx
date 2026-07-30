import { useState } from "react";

import StatCard from "../components/StatCard";
import { useOverview } from "../hooks/useOverview";
import api from "../api/client";

import "../styles/subscription.css";
import { openSwish } from "../utils/swish";


function Subscription() {

    const { overview, loading } = useOverview();

    const [paymentLoading, setPaymentLoading] = useState(false);


    if (loading) {

        return (
            <p>
                Laddar subscription...
            </p>
        );

    }



    const subscription = overview?.subscription;

    const isUnlimitedEmby =
        overview?.emby_access?.unlimited === true;



    async function handleSwishPayment() {

        try {

            setPaymentLoading(true);


            const response = await api.post(
                "/payments/create",
                {
                    amount: 100
                }
            );


            const checkoutUrl =
                response.data.checkout_url;


            if (checkoutUrl) {

                openSwish(checkoutUrl);

            }


        } catch (error) {

            console.error(
                "Kunde inte skapa Swish-betalning",
                error
            );

            alert(
                "Kunde inte starta Swish-betalning"
            );

        } finally {

            setPaymentLoading(false);

        }

    }



    if (isUnlimitedEmby) {

        return (
            <div>

                <h1>
                    Subscription
                </h1>


                <div className="subscription-cards">

                    <StatCard
                        title="Status"
                        value="Admin"
                        description="♾️ Obegränsad Emby-access"
                    />


                    <StatCard
                        title="Subscription"
                        value="Ingen begränsning"
                        description="Administratör har alltid tillgång"
                    />

                </div>


            </div>
        );

    }



    if (!subscription) {

        return (
            <div>

                <h1>
                    Subscription
                </h1>


                <p>
                    Ingen aktiv prenumeration hittades.
                </p>


                <button
                    className="subscription-button"
                    onClick={handleSwishPayment}
                    disabled={paymentLoading}
                >
                    {
                        paymentLoading
                            ? "Startar Swish..."
                            : "Betala med Swish"
                    }
                </button>

            </div>
        );

    }



    return (
        <div>

            <h1>
                Subscription
            </h1>


            <div className="subscription-cards">

                <StatCard
                    title="Status"
                    value={
                        subscription.active
                            ? "Aktiv"
                            : "Inaktiv"
                    }
                    description="Prenumerationsstatus"
                />


                <StatCard
                    title="Slutdatum"
                    value={
                        subscription.end_date ?? "-"
                    }
                />

            </div>



            <div className="subscription-payment">

                <button
                    className="subscription-button"
                    onClick={handleSwishPayment}
                    disabled={paymentLoading}
                >
                    {
                        paymentLoading
                            ? "Startar Swish..."
                            : "Betala med Swish"
                    }
                </button>


            </div>


        </div>
    );
}


export default Subscription;