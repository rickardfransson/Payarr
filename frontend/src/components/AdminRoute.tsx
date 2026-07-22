import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


interface Props {

    children: React.ReactNode;

}



function AdminRoute({
    children
}: Props) {


    const { user } = useAuth();



    if (!user) {

        return (
            <Navigate
                to="/login"
            />
        );

    }



    if (user.role !== "admin") {

        return (
            <Navigate
                to="/"
            />
        );

    }



    return children;

}


export default AdminRoute;