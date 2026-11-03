import api from './api';

// fetch all active rooms

export const getRooms = async()=>{
    const response = await api.get('/rooms');
    return response.data.data;
};

export const getAvailableRooms = async (checkIn, checkOut, guests) => {
    const response = await api.get('/reservation/availability', {
        params: { checkIn, checkOut, guests },
    });
    return response.data.data;
};

export const getRoomQuote = async (roomId, checkIn, checkOut) => {
    const response = await api.get('/reservation/quote', {
        params: { roomId, checkIn, checkOut },
    });
    return response.data.data.totalPrice;
};
