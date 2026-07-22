import { useEffect, useState } from "react";

import api from "../../api/client";


interface SyncStatus {

    scheduler_running: boolean;
    last_sync?: string;
    last_status?: string;

    users_checked: number;
    users_updated: number;
    users_disabled: number;

    next_sync?: string;

}


interface EmbyLog {

    id: number;
    user_id: number;
    emby_user_id: string;

    action: string;
    status: string;

    message?: string;

    created_at: string;

}


interface EmbyUser {

    user_id: number;

    username: string;
    emby_username: string;

    subscription_active: boolean;
    emby_active: boolean;

}



function AdminEmby() {


    const [status, setStatus] =
        useState<SyncStatus | null>(null);


    const [logs, setLogs] =
        useState<EmbyLog[]>([]);


    const [users, setUsers] =
        useState<EmbyUser[]>([]);



    useEffect(() => {

        async function loadData() {

            try {

                const statusResponse =
                    await api.get(
                        "/admin/emby/status"
                    );


                const logsResponse =
                    await api.get(
                        "/admin/emby/logs"
                    );


                const usersResponse =
                    await api.get(
                        "/admin/emby/users"
                    );



                setStatus(
                    statusResponse.data
                );


                setLogs(
                    logsResponse.data
                );


                setUsers(
                    usersResponse.data
                );


            } catch (error) {

                console.error(
                    "Kunde inte hämta Emby-data",
                    error
                );

            }

        }


        loadData();


    }, []);




    return (

        <div>


            <h1>
                Admin - Emby
            </h1>



            <section>

                <h2>
                    Sync Status
                </h2>


                {
                    status && (

                        <>

                            <p>
                                Scheduler:
                                {
                                    status.scheduler_running
                                        ? " Aktiv"
                                        : " Stoppad"
                                }
                            </p>


                            <p>
                                Senaste sync:
                                {
                                    status.last_sync ?? "-"
                                }
                            </p>


                            <p>
                                Status:
                                {
                                    status.last_status ?? "-"
                                }
                            </p>


                            <p>
                                Kontrollerade:
                                {
                                    status.users_checked
                                }
                            </p>


                            <p>
                                Uppdaterade:
                                {
                                    status.users_updated
                                }
                            </p>


                            <p>
                                Avstängda:
                                {
                                    status.users_disabled
                                }
                            </p>

                        </>

                    )
                }


            </section>





            <section>

                <h2>
                    Sync Logs
                </h2>


                <table>

                    <thead>

                        <tr>

                            <th>
                                Datum
                            </th>

                            <th>
                                Action
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Meddelande
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {
                            logs.map(log => (

                                <tr key={log.id}>

                                    <td>
                                        {log.created_at}
                                    </td>


                                    <td>
                                        {log.action}
                                    </td>


                                    <td>
                                        {log.status}
                                    </td>


                                    <td>
                                        {log.message ?? "-"}
                                    </td>


                                </tr>

                            ))
                        }

                    </tbody>

                </table>


            </section>






            <section>


                <h2>
                    Emby Users
                </h2>


                <table>

                    <thead>

                        <tr>

                            <th>
                                User
                            </th>

                            <th>
                                Emby
                            </th>

                            <th>
                                Subscription
                            </th>

                            <th>
                                Emby Status
                            </th>

                        </tr>

                    </thead>


                    <tbody>


                        {
                            users.map(user => (

                                <tr key={user.user_id}>


                                    <td>
                                        {user.username}
                                    </td>


                                    <td>
                                        {user.emby_username}
                                    </td>


                                    <td>
                                        {
                                            user.subscription_active
                                                ? "Aktiv"
                                                : "Inaktiv"
                                        }
                                    </td>


                                    <td>
                                        {
                                            user.emby_active
                                                ? "Aktiv"
                                                : "Avstängd"
                                        }
                                    </td>


                                </tr>

                            ))
                        }


                    </tbody>


                </table>


            </section>



        </div>

    );

}


export default AdminEmby;