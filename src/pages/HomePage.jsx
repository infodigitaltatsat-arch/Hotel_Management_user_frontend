import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";

import { rooms } from '../data/rooms';
import {
    heroContent,
    hotelBenefits,
} from '../data/home/homePage';

import hotelBG from '../assets/HotelBG/hotelBG.jpg'

const formatPrice = (price) => {
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(price);
}

export default function Homepage() {
    const navigate = useNavigate();

    const [booking, setBooking] = useState({
        checkIn: "",
        checkOut: "",
        guests: "2",
    });

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const handleBookingChange = (event) => {
        const { name, value } = event.target;

        setBooking((previous) => {
            const next = { ...previous, [name]: value };
            if (name === "checkIn" && next.checkOut && next.checkOut <= value) {
                next.checkOut = "";
            }
            return next;
        });
    };

    const handleSearch = (event) => {
        event.preventDefault();

        if (booking.checkOut <= booking.checkIn) {
            window.alert("Check-out date must be after check-in date.");
            return;
        }

        const params = new URLSearchParams(booking);
        navigate(`/rooms?${params.toString()}`);
    }

    const minCheckout = booking.checkIn
        ? (() => {
            const nextDay = new Date(`${booking.checkIn}T00:00:00`);
            nextDay.setDate(nextDay.getDate() + 1);
            return `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, "0")}-${String(nextDay.getDate()).padStart(2, "0")}`;
        })()
        : today;


    return (
        <main className="min-h-screen bg-[#fbfaf6] text-slate-800">

            {/* hero section  */}
            <section className="px-4 pt-4 sm:px-6 lg:px-10">
                <div className="relative mx-auto flex min-h-[360px] max-w-7xl items-center overflow-hidden rounded-xl bg-slate-900 bg-cover bg-center sm:min-h-[420px] lg:min-h-[460px]"
                
                style={{ backgroundImage: `url(${hotelBG})` }}

                >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-transparent" />
                    <div className="relative z-10 max-w-2xl px-6 py-14 text-white sm:px-10 lg:px-16">
                        <p className="mb-3 text-sm font-medium tracking-[0.2em] text-blue-200">
                            {heroContent.eyebrow}
                        </p>
                        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                            {heroContent.title}
                        </h1>
                        <p className="mt-4 text-lg font-medium text-white/90 sm:text-xl">
                            {heroContent.subtitle}
                        </p>
                        <p className="mt-3 max-w-lg text-sm leading-6 text-white/75 sm:text-base">
                            {heroContent.description}
                        </p>
                    </div>
                </div>

                {/* Booking search */}
                <form
                    onSubmit={handleSearch}
                    className="relative z-10 mz-auto -mt-8 grid max-w-6xl grid-cols-1 gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-lg sm:grid-cols-2 sm:p-6 lg:-mt-10 lg:grid-cols-[1fr_1fr_0.8fr_auto] lg:items-end">
                    <div>
                        <label
                            htmlFor="checkIn"
                            className="mb-2 block text-xs font-medium text-slate-500">
                            Check-in
                        </label>

                        <input
                            id='checkIn'
                            name='checkIn'
                            type="date"
                            min={today}
                            value={booking.checkIn}
                            onChange={handleBookingChange}
                            required
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />


                    </div>

                    <div>
                        <label
                            htmlFor="checkOut"
                            className="mb-2 block text-xs font-medium text-slate-500">
                            Check-out
                        </label>

                        <input
                            id='checkOut'
                            name='checkOut'
                            type="date"
                            min={minCheckout}
                            value={booking.checkOut}
                            onChange={handleBookingChange}
                            required
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/>


                    </div>

                    <div>
                        <label
                            htmlFor="guests"
                            className="mb-2 block text-xs font-medium text-slate-500"
                        >
                            Guests
                        </label>
                        <div className="relative">
                            <Users size={16}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                            <select
                                id="guests"
                                name="guests"
                                value={booking.guests}
                                onChange={handleBookingChange}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                {[1, 2, 3, 4, 5, 6].map((guestsCount) => (
                                    <option key={guestsCount} value={guestsCount}>
                                        {guestsCount}
                                        {guestsCount === 1 ? " Guest" : " Guests"}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="flex min-h-12 items-center  justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2">
                        Search Rooms
                        <ArrowRight size={17} />
                    </button>


                </form>
            </section>

            {/* Why choose us */}
            <section className="max-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                    Why choose us
                </h2>

                <div className="mt-7 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4">
                    {hotelBenefits.map((benefit) => {
                        const Icon = benefit.icon;

                        return (
                            <div
                                key={benefit.id}
                                className="flex items-start gap-3 bg-blue-100 px-2 py-5 lg:py-3 rounded-2xl">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                    <Icon size={21} strokeWidth={1.8} />
                                </div>

                                <div className="">
                                    <h3 className="text-md font-semibold text-slate-800 ">
                                        {benefit.title}
                                    </h3>
                                    <p className="mt-1 text- leading-5 text-slate-500 lg:mt-2">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>





            {/* featured rooms */}
            <section className='mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-10'>
                <div className="flex items-center justify-between gap-4">
                    <div className="">
                        <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                            Featured Rooms
                        </h2>
                        <p className="mt-2 text-md text-slate-500">
                            Find the right space for your stay.
                        </p>
                    </div>
                    <button
                        type='button'
                        onClick={() => navigate('/rooms')}
                        className="inline-flex shrink-0 items-center gap-2 text-md font-semibold text-blue-600 transition duration-300 hover:text-blue-800">
                        View All
                        <ArrowRight size={16} />
                    </button>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rooms.slice(0, 3).map((room) => (
                        <article
                            key={room.id}
                            className="group overflow-hidden rounded-xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                            <button
                                type="button"
                                onClick={() => navigate(`/rooms/${encodeURIComponent(room.id)}`)}
                                className="block w-full text-left"
                                aria-label={`Explore $ {room.name}`}>

                                <div className="relative aspect-[5/3] overflow-hidden bg-slate-100">
                                    <img
                                        src={room.image}
                                        alt={room.name}
                                        loading='lazy'
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>
                                    {room.tag && (
                                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                                            {room.tag}
                                        </span>
                                    )}
                                </div>

                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-base font-semibold text-slate-900">
                                            {room.name}
                                        </h3>
                                        <ArrowRight size={18}
                                        className="mt-0.5 shrink-0 text-blue-600 transition group-hover:translate-x-1"/>
                                    </div>
                                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                                        {room.description}
                                    </p>

                                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                                        <span className="text-xs text-slate-500">
                                            Up to {room.capacity} guests
                                        </span>

                                        <p className="text-[13px] font-semibold text-slate-900">
                                            {formatPrice(room.price)}
                                            <span className="ml-1 text-slate-600">
                                                / night
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </article>
                    ))}
                </div>
            </section>
        </main>

    )

}
