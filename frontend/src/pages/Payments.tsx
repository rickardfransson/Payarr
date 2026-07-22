import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import StatCard from "../components/StatCard";


interface PaymentData {
    amount: number;
    status: string;
    provider: string;
    paid_at?: string;
}


function Payments() {

    const { user } = useAuth();

    const [payment, setPayment] = useState<PaymentData | null>(null);
    const [loading, setLoading] = useState(true);



    useEffect(() => {

        async function loadPayment() {

            if (!user) {
                return;
            }


            try {

                const response = await api.get(
                    `/users/${user.id}/overview`
                );


                setPayment(
                    response.data.last_payment ?? null
                );


            } catch (error) {

                console.error(
                    "Kunde inte hämta betalning",
                    error
                );

            } finally {

                setLoading(false);

            }

        }


        loadPayment();

    }, [user]);



    if (loading) {

        return (
            <p>
                Laddar payments...
            </p>
        );

    }



    if (!payment) {

        return (
            <div>

                <h1>
                    Payments
                </h1>

                <p>
                    Ingen betalning hittades.
                </p>

            </div>
        );

    }



    return (
        <div>

            <h1>
                Payments
            </h1>


            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                    marginTop: "30px"
                }}
            >

                <StatCard
                    title="Belopp"
                    value={`${payment.amount} SEK`}
                />


                <StatCard
                    title="Status"
                    value={payment.status}
                />


                <StatCard
                    title="Provider"
                    value={payment.provider}
                />

            </div>


            {
                payment.paid_at && (

                    <p
                        style={{
                            marginTop: "20px"
                        }}
                    >
                        Betald:
                        {" "}
                        {payment.paid_at}
                    </p>

                )
            }


        </div>
    );
}


export default Payments;