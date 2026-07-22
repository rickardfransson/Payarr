import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import StatCard from "../components/StatCard";


interface SubscriptionData {
    active: boolean;
    end_date: string;
}


function Subscription() {

    const { user } = useAuth();

    const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        async function loadSubscription() {

            if (!user) {
                return;
            }


            try {

                const response = await api.get(
                    `/users/${user.id}/overview`
                );


                setSubscription(
                    response.data.subscription ?? null
                );


            } catch (error) {

                console.error(
                    "Kunde inte hämta subscription",
                    error
                );

            } finally {

                setLoading(false);

            }

        }


        loadSubscription();

    }, [user]);



    if (loading) {
        return (
            <p>
                Laddar subscription...
            </p>
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

            </div>
        );

    }



    return (
        <div>

            <h1>
                Subscription
            </h1>


            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "20px",
                    marginTop: "30px"
                }}
            >

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
                        subscription.end_date
                    }
                />

            </div>


        </div>
    );
}


export default Subscription;