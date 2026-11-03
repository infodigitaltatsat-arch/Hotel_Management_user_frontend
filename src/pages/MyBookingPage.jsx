import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    CalendarDays,
    BedDouble,
    Users,
    MapPin,
    Clock,
    XCircle,
    RefreshCw,
} from "lucide-react";

import {
    getMyReservations,
    cancelReservation,
} from "../services/reservationService";

const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value || 0);
};

const statusStyles = {
    confirmed: "bg-emerald-50 text-emerald-700",
    checked_in: "bg-blue-50 text-blue-700",
    checked_out: "bg-slate-100 text-slate-600",
    cancelled: "bg-red-50 text-red-700",
};

const MyBookingPage = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getMyReservations();

            setReservations(response.data || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load your bookings. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleCancel = async (reservationId) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this reservation?"
        );

        if (!confirmed) return;

        try {
            setCancellingId(reservationId);
            setError("");

            await cancelReservation(reservationId);

            // Refresh reservations after cancellation.
            await fetchReservations();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to cancel this reservation."
            );
        } finally {
            setCancellingId(null);
        }
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#fbfaf6] px-4">
                <div className="text-center">
                    <RefreshCw
                        size={30}
                        className="mx-auto animate-spin text-blue-600"
                    />

                    <p className="mt-4 text-sm text-slate-600">
                        Loading your bookings...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#fbfaf6] px-4 py-10 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-5xl">

                {/* Heading */}
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Your Account
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        My Bookings
                    </h1>

                    <p className="mt-3 text-sm text-slate-500">
                        View and manage your hotel reservations.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        {error}
                    </div>
                )}

                {/* Empty state */}
                {reservations.length === 0 ? (
                    <section className="rounded-xl border border-slate-100 bg-white px-5 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <CalendarDays size={30} />
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-slate-900">
                            No bookings yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            You haven't made any reservations yet.
                            Explore our rooms and plan your next stay.
                        </p>

                        <Link
                            to="/rooms"
                            className="mt-7 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Explore Rooms
                        </Link>
                    </section>
                ) : (
                    <div className="space-y-5">

                        {/* Booking count */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-600">
                                {reservations.length}{" "}
                                {reservations.length === 1
                                    ? "Reservation"
                                    : "Reservations"}
                            </p>

                            <button
                                type="button"
                                onClick={fetchReservations}
                                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                                <RefreshCw size={15} />
                                Refresh
                            </button>
                        </div>

                        {/* Reservation cards */}
                        {reservations.map((reservation) => {
                            const room = reservation.room;

                            const status =
                                reservation.bookingStatus || "confirmed";

                            const canCancel = status === "confirmed";

                            return (
                                <article
                                    key={reservation._id}
                                    className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm"
                                >
                                    {/* Card header */}
                                    <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-7">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                                Booking Reference
                                            </p>

                                            <h2 className="mt-1 break-all text-base font-bold text-slate-900">
                                                {reservation.bookingReference}
                                            </h2>
                                        </div>

                                        <span
                                            className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                                                statusStyles[status] ||
                                                "bg-slate-100 text-slate-600"
                                            }`}
                                        >
                                            {status.replaceAll("_", " ")}
                                        </span>
                                    </div>

                                    {/* Card content */}
                                    <div className="p-5 sm:p-7">

                                        <div className="flex flex-col justify-between gap-5 sm:flex-row">

                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                        <BedDouble size={22} />
                                                    </div>

                                                    <div>
                                                        <h3 className="text-lg font-semibold text-slate-900">
                                                            {room?.roomType || "Hotel Room"}
                                                        </h3>

                                                        <p className="mt-1 text-sm text-slate-500">
                                                            Room Number: {room?.roomNumber || "—"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="sm:text-right">
                                                <p className="text-xs text-slate-400">
                                                    Total Amount
                                                </p>

                                                <p className="mt-1 text-xl font-bold text-slate-900">
                                                    {formatCurrency(reservation.totalPrice)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Booking details */}
                                        <div className="mt-7 grid grid-cols-1 gap-5 border-t border-slate-100 pt-6 sm:grid-cols-3">

                                            <div className="flex items-start gap-3">
                                                <CalendarDays
                                                    size={19}
                                                    className="mt-0.5 text-blue-600"
                                                />

                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Check-in
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                                        {formatDate(reservation.checkIn)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <CalendarDays
                                                    size={19}
                                                    className="mt-0.5 text-blue-600"
                                                />

                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Check-out
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                                        {formatDate(reservation.checkOut)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Users
                                                    size={19}
                                                    className="mt-0.5 text-blue-600"
                                                />

                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Guests
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                                        {reservation.numberOfGuests}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment and action */}
                                        <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">

                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <Clock size={16} />

                                                Payment:{" "}
                                                <span className="font-medium capitalize text-slate-700">
                                                    {(reservation.paymentStatus || "unpaid").replaceAll("_", " ")}
                                                </span>
                                            </div>

                                            {canCancel && (
                                                <button
                                                    type="button"
                                                    disabled={cancellingId === reservation._id}
                                                    onClick={() => handleCancel(reservation._id)}
                                                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    <XCircle size={16} />

                                                    {cancellingId === reservation._id
                                                        ? "Cancelling..."
                                                        : "Cancel Booking"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
};

export default MyBookingPage;