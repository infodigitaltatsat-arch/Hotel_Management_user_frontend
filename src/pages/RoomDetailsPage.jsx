import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
    Users,
    BedDouble,
    Maximize2,
    ArrowLeft,
    CalendarDays,
    Info,
} from 'lucide-react'

import {rooms as roomPresentationDate} from "../data/rooms";
import { getRoomQuote, getRooms } from "../services/roomService";
import {
    amenityIconMap,
    defaultAmenityIcon,
    bookingSummaryLabels
} from '../data/home/roomDetails';

const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(price);


const formatDate = (dateString) => {
    if (!dateString) return null;

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime()))
        return null;

    return date.toLocaleDateString('en-IN', {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })
};

const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);

    if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime()) ||
        end <= start
    ) {
        return 0;
    }

    return Math.round((end - start) / (1000 * 60 * 60 * 24));
}


const getAmenityIcon = (amenity) => {
    const normalizedAmenity = amenity.toLowerCase();

    const matchingAmenity = amenityIconMap.find((item) => item.keywords.some((keyword) => normalizedAmenity.includes(keyword)));

    return matchingAmenity?.icon || defaultAmenityIcon;
};

export default function RoomDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const [room,setRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");



    const checkIn = searchParams.get('checkIn') || "";
    const checkOut = searchParams.get('checkOut') || "";
    const guests = Number(searchParams.get('guests')) || 2;

    const nights = calculateNights(checkIn, checkOut);

    const roomSubtotal = useMemo(() => (room ? room.quotedTotal ?? room.price * (nights || 1) : 0),
        [room, nights]);
         // using useEffect to fetch the rooms

    useEffect(()=>{
        const fetchRoom = async()=>{
            try{
                setIsLoading(true);
                setError("");

                // fetch rooms from backend
                const roomRecords = await getRooms();

                const selectedRoom = roomRecords.find((item)=>item._id === id);

                if(!selectedRoom){
                    setRoom(null);
                    return;
                }

                const presentation = roomPresentationDate.find((item)=>item.name.toLowerCase() === selectedRoom.roomType.toLowerCase());
                const quotedTotal = checkIn && checkOut
                    ? await getRoomQuote(id, checkIn, checkOut)
                    : null;
                setRoom({
                    ...selectedRoom,
                    id:selectedRoom._id,
                    name:selectedRoom.roomType,
                    price:selectedRoom.pricePerNight,
                    image:presentation?.image ||
                    roomPresentationDate[0]?.image || "",
                    amenities: Array.isArray(selectedRoom.amenities)
                        ? selectedRoom.amenities
                        : [],
                    quotedTotal,
                })

            }catch(err){
                setError(
                    err.response?.data?.message || "Unable to load room details"
                )
            }finally{
                setIsLoading(false);
            }
        }
        fetchRoom();

    },[id, checkIn, checkOut]);

if(isLoading){
    return(
        <main className=''>
            <p className=''>
                Loading room details...
            </p>
        </main>
    )
}

if(error){
    return(
        <main className=''>
            <div className=''>
                <p className=''>
                    <button onClick={()=>navigate('/rooms')}
                    className="">
                        Back to Rooms
                    </button>
                </p>
            </div>
            </main>
    )
}


    if (!room) {
        return (
            <main className="flex min-h-[60vh] items-center bg-[#fbfaf6] px-4">
                <div className='max-w-md rounded-xl border border-slate-100 bg-white p-8 text-center shadow-sm'>
                    <h1 className="text-xl font-semibold text-slate-900">
                        Room not found
                    </h1>
                    <p className='mt-2 text-sm text-slate-500'>
                        This room may no longer be available.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate('/rooms')}
                        className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                        Back to Rooms
                    </button>
                </div>
            </main>
        )
    }

    const handleProceedToBook = () => {
        const params = new URLSearchParams({
            roomId: room._id,
            guests: String(guests),
        });

        if (checkIn) params.set('checkIn', checkIn);
        if (checkOut) params.set('checkOut', checkOut);

        navigate(`/booking/guest-information?${params.toString()}`, {
            state: { roomName: room.name, quotedTotal: roomSubtotal },
        })
    };

    const hasValidDates = nights > 0;

   

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">

                {/* back navigation */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600">
                    <ArrowLeft size={17} />
                    Back to Rooms
                </button>

                {/* Room heading */}
                <div className='mb-5 flex flex-wrap items-center justify-between gap-4'>
                    <div>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                                {room.name}
                            </h1>

                            {room.tag && (
                                <span className="">
                                    {room.tag}
                                </span>
                            )}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                            <span className="inline-flex items-center gap-2">
                                <Users size={16}
                                    className="text-blue-600"/>
                                {room.capacity} Guests
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <BedDouble size={16}
                                    className="text-blue-600" />
                                Bed details not specified
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <Maximize2 size={16}
                                    className="text-blue-600" />
                            </span>
                        </div>
                    </div>
                </div>


                {/* main room content */}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.8fr)]">

                    {/* left, image, amenities and description */}
                    <section className="min-w-0">
                        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-sm">
                            <div className="aspect-[16/9] overflow-hidden rounded-lg bg-slate-100">
                                <img
                                    src={room.image}
                                    alt={room.name}
                                    className="h-full w-full object-cover" />
                            </div>
                        </div>

                        {/* amenities */}
                        <div className="mt-7 rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Amenities
                            </h2>

                            {room.amenities?.length > 0 ? (
                                <div className='mt-5 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2'>

                                    {room.amenities.map((amenity) => {
                                        const Icon = getAmenityIcon(amenity);

                                        return (
                                            <div
                                                key={amenity}
                                                className="flex items-center gap-3 text-sm text-slate-600">

                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                    <Icon size={18} />
                                                </span>
                                                {amenity}

                                            </div>
                                        )
                                    })}

                                </div>
                            ) : (
                                <p className='mt-4 text-sm text-slate-500'>
                                    No amenities have been added for this room yet.
                                </p>
                            )}
                        </div>


                        {/* description */}
                        <div className='mt-7 rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6'>
                            <h2 className='text-lg font-semibold text-slate-900'>
                                Description
                            </h2>
                            <p className='mt-3 text-sm leading-7 text-slate-600'>
                                {room.description}
                            </p>
                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                Enjoy a comfortable stay with the facilities and amenities listed above. Room details are provided to help you choose the right accommodation.
                            </p>
                        </div>


                    </section>

                    {/* Right: booking summary */}
                    <aside className="h-fit rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Booking Summary
                        </h2>

                        {/* selected dates */}
                        <div className="mt-5 border-b border-slate-100 pb-5">
                            <h3 className='text-sm font-semibold text-slate-800'>
                                {bookingSummaryLabels.selectedDates}
                            </h3>
                            {hasValidDates ? (
                                <>
                                    <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                                        <CalendarDays size={16} className="text-blue-600" />
                                        {formatDate(checkIn)}-{formatDate(checkOut)}

                                    </p>
                                    <p className='mt-2 text-sm text-slate-500'>
                                        {nights} {nights === 1 ? 'Night' : "Nights"}
                                    </p>
                                </>

                            ) : (
                                <div className='mt-3 rounded-lg bg-amber-50 p-3'>
                                    <p className="text-sm text-amber-800">
                                        Select valid check-in and check-out dates to calculate your stay.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => navigate('/rooms')}
                                        className="mt-2 text-sm font-semibold text-blue-700 hover:underline">
                                        Select dates
                                    </button>
                                </div>
                            )}
                            <p className='mt-3 text-sm text-slate-500'>
                                {guests} {guests === 1 ? 'Guest' : 'Guests'}
                            </p>
                        </div>

                        {/* price breakdown */}
                        <div className='space-y-4 border-b border-slate-100 py-5'>
                            <div className="flex items-center justify-between gap-3 text-sm">
                                <span className='text-slate-500'>
                                    {bookingSummaryLabels.roomPrice}
                                </span>

                                <span className='font-medium text-slate-800'>
                                    {formatPrice(roomSubtotal)}
                                </span>
                            </div>

                            <div className='flex items-center justify-between gap-3 text-md'>
                                <span className='text-slate-500'>
                                    {bookingSummaryLabels.taxes}
                                </span>
                                <span className='text-right text-md text-slate-500'>
                                    Calculated at checkout
                                </span>
                            </div>
                        </div>

                        {/* total */}
                        <div className="flex items-center justify-between gap-3 py-5">
                            <span className="font-semibold text-slate-900">
                                {bookingSummaryLabels.total}

                            </span>
                            <span className="text-xl font-bold text-slate-900">
                                {formatPrice(roomSubtotal)}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={handleProceedToBook}
                            disabled={!hasValidDates || guests > room.capacity || guests < 1}
                            className="flex min-h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                            Proceed to book
                        </button>

                        <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
                            <Info size={15}
                                className="mt-0.5 shrink-0 text-blue-600" />
                            Final Taxes, fees, and availability will be confirmed during booking.
                        </div>
                    </aside>
                </div>
            </div>

        </main>
    )
}
