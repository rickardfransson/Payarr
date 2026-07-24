import { useEffect, useState } from "react";
import api from "../../api/client";


function AdminPayments() {

    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    const loadPayments = async () => {

        try {

            const response = await api.get(
                "/admin/payments/"
            );

            setPayments(response.data);

        } catch (error) {

            console.error(
                "Kunde inte hämta betalningar",
                error
            );

        } finally {

            setLoading(false);

        }
    };



    const completePayment = async (
        id: number
    ) => {

        try {

            await api.post(
                `/admin/payments/complete/${id}`
            );


            await loadPayments();


        } catch (error) {

            console.error(
                "Kunde inte slutföra betalning",
                error
            );

        }

    };



    useEffect(() => {

        loadPayments();

    }, []);



    if (loading) {

        return (
            <p>
                Laddar betalningar...
            </p>
        );

    }



    return (

        <div>

            <h1>
                Admin Payments
            </h1>


            <table
                style={{
                    width: "100%",
                    marginTop: "30px",
                    borderCollapse: "collapse"
                }}
            >

                <thead>

                    <tr>

                        <th>
                            User
                        </th>

                        <th>
                            Belopp
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Datum
                        </th>

                        <th>
                            Åtgärd
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {payments.map(
                        (payment) => (

                        <tr key={payment.id}>

                            <td>
                                {payment.username}
                            </td>


                            <td>
                                {payment.amount} {payment.currency}
                            </td>


                            <td>
                                {payment.status}
                            </td>


                            <td>
                                {
                                    new Date(
                                        payment.created_at
                                    ).toLocaleString()
                                }
                            </td>


                            <td>

                                {payment.status !== "paid" && (

                                    <button
                                        onClick={() =>
                                            completePayment(
                                                payment.id
                                            )
                                        }
                                    >
                                        Markera betald
                                    </button>

                                )}

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}


export default AdminPayments;