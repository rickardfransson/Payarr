import api from "../api/client";

export async function createPayment() {
    const response = await api.post(
        "/payments/create",
        {
            amount: 100,
        }
    );

    return response.data;
}