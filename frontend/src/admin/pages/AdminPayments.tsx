import { useEffect, useState } from "react";

import api from "../../api/client";

import "../../styles/admin.css";


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

        <div className="admin-page">


            <h1 className="admin-title">
                Betalningar
            </h1>



            <p>
                Totalt antal betalningar: {payments.length}
            </p>




            <div className="admin-table-card">


                <table className="admin-table">


                    <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Användare
                            </th>

                            <th>
                                Belopp
                            </th>

                            <th>
                                Leverantör
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Skapad
                            </th>

                            <th>
                                Åtgärd
                            </th>

                        </tr>

                    </thead>



                    <tbody>

                        {
                            payments.map(
                                (payment) => (

                                <tr key={payment.id}>


                                    <td>
                                        {payment.id}
                                    </td>



                                    <td>
                                        {payment.username}
                                    </td>



                                    <td>
                                        {payment.amount} {payment.currency}
                                    </td>



                                    <td>
                                        {payment.provider}
                                    </td>



                                    <td>

                                        <span
                                            className={
                                                payment.status === "paid"
                                                    ? "admin-status active"
                                                    : "admin-status inactive"
                                            }
                                        >
                                            {payment.status}
                                        </span>

                                    </td>



                                    <td>

                                        {
                                            new Date(
                                                payment.created_at
                                            ).toLocaleString(
                                                "sv-SE"
                                            )
                                        }

                                    </td>



                                    <td>

                                        {
                                            payment.status !== "paid" && (

                                                <button
                                                    className="admin-button"
                                                    onClick={() =>
                                                        completePayment(
                                                            payment.id
                                                        )
                                                    }
                                                >
                                                    Markera betald
                                                </button>

                                            )
                                        }

                                    </td>


                                </tr>

                            ))
                        }

                    </tbody>


                </table>


            </div>


        </div>

    );

}


export default AdminPayments;