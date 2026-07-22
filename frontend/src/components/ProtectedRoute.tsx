import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {

    const { token, loading } = useAuth();


    if (loading) {
        return <div>Laddar...</div>;
    }


    if (!token) {
        return <Navigate to="/login" replace />;
    }


    return children;
}


export default ProtectedRoute;