import api from "./api";

export const createReservation = async (reservationData) => {
    const response = await api.post("/reservation", reservationData);
    return response.data;
};

// get logged in guests reservation

export const getMyReservations = async (reservationData)=>{
    const response = await api.get('/reservation/my');
    return response.data;
}

// cancel reservation

export const cancelReservation = async (reservationId) =>{
    const response = await api.patch(`/reservation/${reservationId}/cancel`);
    return response.data;
};