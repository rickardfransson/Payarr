import { useEffect, useState } from "react";

import api from "../../api/client";


interface User {

    id: number;
    username: string;
    email: string;
    role: string;
    active: boolean;

    subscription?: {
        active: boolean;
        end_date: string;
    };


    emby?: {
        username: string;
    };


    last_payment?: {
        amount: number;
        status: string;
        paid_at?: string;
    };

}



function AdminUsers() {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {

        async function loadUsers() {

            try {

                const response = await api.get(
                    "/admin/users"
                );


                setUsers(response.data);


            } catch (error) {

                console.error(
                    "Kunde inte hämta användare",
                    error
                );

            } finally {

                setLoading(false);

            }

        }


        loadUsers();

    }, []);




    if (loading) {

        return (
            <p>
                Laddar användare...
            </p>
        );

    }




    return (

        <div>

            <h1>
                Admin - Users
            </h1>



            <table>

                <thead>

                    <tr>

                        <th>
                            ID
                        </th>

                        <th>
                            Username
                        </th>

                        <th>
                            Email
                        </th>

                        <th>
                            Roll
                        </th>

                        <th>
                            Aktiv
                        </th>

                        <th>
                            Subscription
                        </th>

                        <th>
                            Emby
                        </th>

                        <th>
                            Betalning
                        </th>

                    </tr>

                </thead>



                <tbody>

                    {
                        users.map(user => (

                            <tr
                                key={user.id}
                            >

                                <td>
                                    {user.id}
                                </td>


                                <td>
                                    {user.username}
                                </td>


                                <td>
                                    {user.email}
                                </td>


                                <td>
                                    {user.role}
                                </td>


                                <td>
                                    {
                                        user.active
                                            ? "Ja"
                                            : "Nej"
                                    }
                                </td>


                                <td>

                                    {
                                        user.subscription
                                            ? (
                                                user.subscription.active
                                                    ? "Aktiv"
                                                    : "Inaktiv"
                                            )
                                            : "-"
                                    }

                                </td>


                                <td>

                                    {
                                        user.emby
                                            ? user.emby.username
                                            : "-"
                                    }

                                </td>


                                <td>

                                    {
                                        user.last_payment
                                            ? `${user.last_payment.amount} SEK`
                                            : "-"
                                    }

                                </td>


                            </tr>

                        ))
                    }


                </tbody>


            </table>


        </div>

    );

}


export default AdminUsers;