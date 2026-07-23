import { useEffect, useState } from "react";

import api from "../../api/client";


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


            setUsers(response.data);


        } catch (error) {

            console.error(
                "Kunde inte hämta Emby users",
                error
            );

        }
        finally {

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

        <div>


            <h1>
                Importera Emby användare
            </h1>



            <table>


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

                                {
                                    user.enabled
                                    ? "Ja"
                                    : "Nej"
                                }

                            </td>



                            <td>

                                {
                                    user.imported
                                    ?
                                    "Importerad"
                                    :
                                    "Ej importerad"
                                }

                            </td>


                        </tr>

                    ))

                }


                </tbody>


            </table>




            <button
                onClick={importUsers}
                disabled={
                    selected.length === 0
                }
            >

                Importera valda

            </button>


        </div>

    );

}


export default AdminEmbyImport;