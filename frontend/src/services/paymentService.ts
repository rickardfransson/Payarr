import api from "../api/client";


export async function createPayment() {

    const response = await api.post(
        "/payments/create",
        {}
    );

    return response.data;

}