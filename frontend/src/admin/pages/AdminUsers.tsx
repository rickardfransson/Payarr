import { useEffect, useState } from "react";

import api from "../../api/client";

import "../../styles/admin.css";


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
    };

}



function AdminUsers() {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [resetPassword, setResetPassword] = useState<string | null>(null);



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



    async function handleResetPassword(
        userId: number
    ) {

        const confirmReset = window.confirm(
            "Är du säker på att du vill återställa lösenordet?"
        );


        if (!confirmReset) {
            return;
        }


        try {

            const response = await api.post(
                `/admin/users/${userId}/reset-password`
            );


            setResetPassword(
                `Nytt temporärt lösenord: ${response.data.temporary_password}`
            );


        } catch (error) {

            console.error(
                "Kunde inte återställa lösenord",
                error
            );

            setResetPassword(
                "Kunde inte återställa lösenord"
            );

        }

    }





    if (loading) {

        return (
            <p>
                Laddar användare...
            </p>
        );

    }




    return (

        <div className="admin-page">


            <h1 className="admin-title">
                Admin - Users
            </h1>


            {
                resetPassword && (

                    <div className="admin-table-card">

                        <strong>
                            {resetPassword}
                        </strong>

                    </div>

                )
            }



            <div className="admin-table-card">


                <table className="admin-table">


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
                                Status
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

                            <th>
                                Åtgärd
                            </th>

                        </tr>

                    </thead>



                    <tbody>


                        {
                            users.map(user => (

                                <tr
                                    key={user.id}
                                    onClick={() =>
                                        window.location.href =
                                        `/admin/users/${user.id}`
                                    }
                                    style={{
                                        cursor: "pointer"
                                    }}
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


                                    <td className="admin-role">
                                        {user.role}
                                    </td>


                                    <td>

                                        <span
                                            className={
                                                user.active
                                                    ? "admin-status active"
                                                    : "admin-status inactive"
                                            }
                                        >
                                            {
                                                user.active
                                                    ? "Aktiv"
                                                    : "Inaktiv"
                                            }
                                        </span>

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


                                    <td>

                                        <button
                                            onClick={(event) => {

                                                event.stopPropagation();

                                                handleResetPassword(
                                                    user.id
                                                );

                                            }}
                                        >
                                            Reset password
                                        </button>

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


export default AdminUsers;