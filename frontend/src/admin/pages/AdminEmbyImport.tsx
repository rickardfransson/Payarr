import { useEffect, useState } from "react";

import api from "../../api/client";

import "../../styles/admin.css";


interface EmbyUser {

    emby_user_id: string;

    username: string;

    enabled: boolean;

    imported: boolean;

}



function AdminEmbyImport() {


    const [users, setUsers] = useState<EmbyUser[]>([]);

    const [selected, setSelected] = useState<string[]>([]);

    const [loading, setLoading] = useState(true);




    async function loadUsers() {

        try {

            const response = await api.get(
                "/admin/emby/import-preview"
            );


            setUsers(
                response.data
            );


        } catch (error) {

            console.error(
                "Kunde inte hämta Emby users",
                error
            );


        } finally {

            setLoading(false);

        }

    }





    useEffect(() => {

        loadUsers();

    }, []);






    function toggleUser(
        id: string
    ) {

        setSelected(
            current =>

                current.includes(id)

                    ? current.filter(
                        item => item !== id
                    )

                    :

                    [
                        ...current,
                        id
                    ]

        );

    }





    async function importUsers() {


        for (
            const id of selected
        ) {


            await api.post(
                "/admin/emby/import",
                {
                    emby_user_id: id
                }
            );


        }


        setSelected([]);


        await loadUsers();

    }






    if (loading) {

        return (
            <p>
                Laddar Emby användare...
            </p>
        );

    }






    return (

        <div className="admin-page">


            <h1 className="admin-title">
                Importera Emby användare
            </h1>




            <div className="admin-table-card">


                <table className="admin-table">


                    <thead>

                        <tr>

                            <th>
                                Val
                            </th>


                            <th>
                                Username
                            </th>


                            <th>
                                Aktiv
                            </th>


                            <th>
                                Status
                            </th>


                        </tr>

                    </thead>




                    <tbody>


                    {
                        users.map(
                            user => (

                            <tr
                                key={
                                    user.emby_user_id
                                }
                            >


                                <td>


                                {
                                    !user.imported && (

                                        <input
                                            className="admin-checkbox"
                                            type="checkbox"
                                            checked={
                                                selected.includes(
                                                    user.emby_user_id
                                                )
                                            }
                                            onChange={() =>
                                                toggleUser(
                                                    user.emby_user_id
                                                )
                                            }
                                        />

                                    )

                                }


                                </td>




                                <td>
                                    {user.username}
                                </td>




                                <td>

                                    <span
                                        className={
                                            user.enabled
                                                ? "admin-badge green"
                                                : "admin-badge red"
                                        }
                                    >
                                        {
                                            user.enabled
                                                ? "Ja"
                                                : "Nej"
                                        }
                                    </span>

                                </td>




                                <td>

                                    <span
                                        className={
                                            user.imported
                                                ? "admin-badge green"
                                                : "admin-badge yellow"
                                        }
                                    >
                                        {
                                            user.imported
                                                ? "Importerad"
                                                : "Ej importerad"
                                        }
                                    </span>

                                </td>


                            </tr>

                        ))
                    }


                    </tbody>


                </table>




                <div className="admin-table-actions">


                    <button
                        className="admin-button"
                        onClick={importUsers}
                        disabled={
                            selected.length === 0
                        }
                    >

                        Importera valda

                        {
                            selected.length > 0 &&
                            ` (${selected.length})`
                        }

                    </button>


                </div>



            </div>


        </div>

    );

}


export default AdminEmbyImport;