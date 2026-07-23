import { useEffect, useState } from "react";

import api from "../../api/client";
import "../../styles/admin.css";


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



interface EmbyImportUser {

    emby_user_id: string;

    username: string;

    enabled: boolean;

    imported: boolean;

}



interface WaitingSubscription {

    user_id: number;

    username: string;

    emby_username: string;

    status: string;

}





function AdminEmby() {


    const [status, setStatus] =
        useState<SyncStatus | null>(null);


    const [logs, setLogs] =
        useState<EmbyLog[]>([]);


    const [users, setUsers] =
        useState<EmbyUser[]>([]);


    const [importUsers, setImportUsers] =
        useState<EmbyImportUser[]>([]);


    const [waitingSubscriptions, setWaitingSubscriptions] =
        useState<WaitingSubscription[]>([]);


    const [selectedUsers, setSelectedUsers] =
        useState<string[]>([]);




    async function loadData() {

        try {

            const [
                statusResponse,
                logsResponse,
                usersResponse,
                importResponse,
                waitingResponse

            ] = await Promise.all([

                api.get("/admin/emby/status"),

                api.get("/admin/emby/logs"),

                api.get("/admin/emby/users"),

                api.get("/admin/emby/import-preview"),

                api.get("/admin/emby/waiting-subscriptions")

            ]);


            setStatus(statusResponse.data);

            setLogs(logsResponse.data);

            setUsers(usersResponse.data);

            setImportUsers(importResponse.data);

            setWaitingSubscriptions(
                waitingResponse.data
            );


        } catch(error) {

            console.error(
                "Kunde inte hämta Emby-data",
                error
            );

        }

    }





    useEffect(() => {

        loadData();

    }, []);






    function toggleUser(id: string) {

        setSelectedUsers(current =>

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





    async function importSelected() {


        for(const id of selectedUsers) {


            await api.post(
                "/admin/emby/import",
                {
                    emby_user_id: id
                }
            );


        }


        setSelectedUsers([]);

        await loadData();

    }






    async function activateSubscription(
        userId:number
    ) {


        try {

            await api.post(
                `/admin/emby/activate/${userId}`
            );


            await loadData();


        } catch(error) {

            console.error(
                "Kunde inte aktivera subscription",
                error
            );

        }

    }







    return (

        <div className="admin-page">


            <h1 className="admin-title">
                Admin - Emby
            </h1>





            <div className="admin-grid">


                <div className="admin-card">

                    <h2>
                        Scheduler
                    </h2>


                    <div className="admin-row">

                        <span className="admin-label">
                            Status
                        </span>


                        <span
                            className={
                                status?.scheduler_running
                                    ? "admin-badge green"
                                    : "admin-badge red"
                            }
                        >
                            {
                                status?.scheduler_running
                                    ? "Running"
                                    : "Stopped"
                            }
                        </span>


                    </div>


                    <div className="admin-row">

                        <span className="admin-label">
                            Senaste sync
                        </span>


                        <span>
                            {
                                status?.last_sync ?? "-"
                            }
                        </span>


                    </div>


                </div>





                <div className="admin-card">

                    <h2>
                        Väntar abonnemang
                    </h2>


                    <div className="admin-stat-value">
                        {
                            waitingSubscriptions.length
                        }
                    </div>


                </div>





                <div className="admin-card">

                    <h2>
                        Aktiva Emby
                    </h2>


                    <div className="admin-stat-value">

                        {
                            users.filter(
                                u => u.emby_active
                            ).length
                        }

                    </div>


                </div>





                <div className="admin-card">

                    <h2>
                        Import
                    </h2>


                    <div className="admin-stat-value">

                        {
                            importUsers.filter(
                                u => !u.imported
                            ).length
                        }

                    </div>


                </div>


            </div>







            <div className="admin-table-card">

                <h2>
                    Emby Import
                </h2>


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
                        importUsers.map(user => (

                            <tr key={user.emby_user_id}>


                                <td>

                                    {
                                        !user.imported &&
                                        <input
                                            className="admin-checkbox"
                                            type="checkbox"
                                            checked={
                                                selectedUsers.includes(
                                                    user.emby_user_id
                                                )
                                            }
                                            onChange={() =>
                                                toggleUser(
                                                    user.emby_user_id
                                                )
                                            }
                                        />
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
                        disabled={
                            selectedUsers.length === 0
                        }
                        onClick={importSelected}
                    >

                        Importera valda
                        {
                            selectedUsers.length > 0 &&
                            ` (${selectedUsers.length})`
                        }

                    </button>

                </div>


            </div>







            <div className="admin-table-card">


                <h2>
                    Väntar på abonnemang
                </h2>


                <table className="admin-table">


                    <thead>

                        <tr>

                            <th>
                                User
                            </th>

                            <th>
                                Emby
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Åtgärd
                            </th>

                        </tr>

                    </thead>



                    <tbody>


                    {
                        waitingSubscriptions.map(user => (

                            <tr key={user.user_id}>


                                <td>
                                    {user.username}
                                </td>


                                <td>
                                    {user.emby_username}
                                </td>


                                <td>

                                    <span className="admin-badge yellow">
                                        {user.status}
                                    </span>

                                </td>


                                <td>

                                    <button
                                        className="admin-button"
                                        onClick={() =>
                                            activateSubscription(
                                                user.user_id
                                            )
                                        }
                                    >
                                        Aktivera 30 dagar
                                    </button>

                                </td>


                            </tr>

                        ))
                    }


                    </tbody>


                </table>


            </div>







            <div className="admin-table-card">


                <h2>
                    Sync Logs
                </h2>


                <table className="admin-table">


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

                                    <span className="admin-badge blue">
                                        {log.status}
                                    </span>

                                </td>


                                <td>
                                    {log.message ?? "-"}
                                </td>


                            </tr>

                        ))
                    }


                    </tbody>


                </table>


            </div>







            <div className="admin-table-card">


                <h2>
                    Emby Users
                </h2>


                <table className="admin-table">


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

                                    <span
                                        className={
                                            user.subscription_active
                                                ? "admin-badge green"
                                                : "admin-badge red"
                                        }
                                    >

                                        {
                                            user.subscription_active
                                                ? "Aktiv"
                                                : "Inaktiv"
                                        }

                                    </span>

                                </td>


                                <td>

                                    <span
                                        className={
                                            user.emby_active
                                                ? "admin-badge green"
                                                : "admin-badge red"
                                        }
                                    >

                                        {
                                            user.emby_active
                                                ? "Aktiv"
                                                : "Avstängd"
                                        }

                                    </span>

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


export default AdminEmby;