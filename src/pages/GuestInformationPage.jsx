import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { UserRound, ArrowLeft, ArrowRight } from "lucide-react";

import {
    bookingSteps,
    identityProofOptions,
} from '../data/home/guest/guestInformation'

import { registerGuest } from "../services/authService";

const initialGuestDetails = {
    fullName: "",
    email: "",
    phone: "",
    password: "",
    identityType: "aadhaar",
    identityNumber: "",
};

export default function GuestInformationPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [guestDetails, setGuestDetails] = useState(initialGuestDetails);

    const roomId = location.state?.roomId ||
        searchParams.get('roomId') || "";

    const checkIn = location.state?.checkIn ||
        searchParams.get('checkIn') || "";

    const checkOut = location.state?.checkOut ||
        searchParams.get('checkOut') || "";

    const guests = location.state?.guests ||
        searchParams.get('guests') || "2"
    const roomName = location.state?.roomName || "Room";
    const quotedTotal = location.state?.quotedTotal ?? null;

    const handleChange = (event) => {
        const { name, value } = event.target;

        setGuestDetails((previous) => ({
            ...previous,
            [name]: value,
        }))
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!roomId || !checkIn || !checkOut) {
            setError("Booking details are missing. Please select your room and dates again.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await registerGuest({
                name: guestDetails.fullName.trim(),
                email: guestDetails.email.trim(),
                password: guestDetails.password,
            });

            // Save the JWT for authenticated reservation requests.
            localStorage.setItem("hotelToken", response.token);

            navigate("/booking/payment", {
                state: {
                    roomId,
                    checkIn,
                    checkOut,
                    guests,
                    roomName,
                    quotedTotal,
                    guestDetails: {
                        ...guestDetails,
                        fullName: response.user.name,
                        email: response.user.email,
                    },
                },
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to create your guest account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };


    const handleBack = () => {
        if (roomId) {
            const params = new URLSearchParams();

            if (checkIn) params.set('checkIn', checkIn);
            if (checkOut) params.set('checkOut', checkOut);
            if (guests) params.set('guests', guests);

            navigate(`/rooms/${encodeURIComponent(roomId)}?${params.toString()}`);
            return;

        }
        navigate('/rooms');
    };

    return (
        <main className="min-h-screen bg-[#fbfaf6] px-4 py-8 sm:px-6 lg:px-10">
            <div className='mx-auto max-w-3xl'>
                {/* page heading */}
                <div className='mb-6'>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                        Guest Information
                    </h1>
                    <p className='mt-2 text-sm text-slate-500'>
                        Enter your details to continue with your reservation.
                    </p>
                </div>


                {/* booking program*/}
                <section className="mb-6 rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <UserRound size={19} />
                        </div>

                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full w-1/2 rounded-full bg-blue-600"></div>
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-3">
                        {bookingSteps.map((step, index) => {
                            const isActive = index === 0;
                            const isCompleted = index < 0;

                            return (
                                <div
                                    key={step.id}
                                    className={`flex items-center gap-2 ${index === 1

                                        ? "justify-center" : index === 2
                                            ? "justify-end" : "justify-start"
                                        }`}>
                                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${isActive ? "bg-blue-600 text-white" : isCompleted ? "bg-blue-100 text-blue-700" : "border border-slate-300 bg-white text-slate-500"
                                        }`}>
                                        {step.number}
                                    </span>

                                    <span className={`text-xs font-medium sm:text-sm ${isActive ? 'text-blue-700' : "text-slate-500"
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* guest details form */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8">
                    <h2 className='text-lg font-semibold text-slate-900'>
                        Guest Details
                    </h2>

                    <div className="mt-6 space-y-5">
                        {/* full name */}
                        <div className="">
                            <label
                                htmlFor="fullName"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                autoComplete="name"
                                value={guestDetails.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                                minLength={2}
                                maxLength={80}
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-900  focus:ring-blue-100" />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-700">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={guestDetails.email}
                                onChange={handleChange}
                                placeholder="Enter your email address"
                                required
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-900  focus:ring-blue-100" />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Create Password <span className="text-red-500">*</span>
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                value={guestDetails.password}
                                onChange={handleChange}
                                placeholder="Create a password (minimum 8 characters)"
                                minLength={8}
                                required
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-900 focus:ring-blue-100"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label
                                htmlFor="phone"
                                className="mb-2 block text-sm font-medium text-slate-700">
                                Phone Number <span className="text-red-500">*</span>
                            </label>

                            <div className="flex overflow-hidden rounded-lg border border-slate-200 
                            focus:within:border-blue-500
                            focus:within:ring-2
                            focus-within:ring-blue-100
                            ">
                                <span className="flex items-center border-r border-slate-200 bg-slate-50 px-4 text-sm text-slate-600">
                                    +91
                                </span>

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel-national"
                                    inputMode="numeric"
                                    value={guestDetails.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit mobile number"
                                    pattern="[6-9][0-9]{9}"
                                    title="Enter a Valid 10-digit Indian mobile number"
                                    required
                                    className="min-w-0 flex-1 px-4 py-3 text-sm outline-none" />
                            </div>
                        </div>

                        {/* Identity proof */}
                        <div className="border-t border-slate-100 pt-5">
                            <h3 className="text-sm font-semibold text-slate-800">
                                Identity Proof
                            </h3>
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="identityType"
                                        className="mb-2 block text-sm font-semibold text-slate-700">
                                        Document Type
                                    </label>
                                    <select
                                        id="identityType"
                                        name="identityType"
                                        value={guestDetails.identityType}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none 
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                                    ">
                                        {identityProofOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="identityNumber"
                                        className="mb-2 block text-sm font-medium text-slate-700">
                                        Document Number{" "}
                                        <span className="text-red-500">*</span>
                                    </label>

                                    <input
                                        id="identityNumber"
                                        name="identityNumber"
                                        type="text"
                                        autoComplete="off"
                                        value={guestDetails.identityNumber}
                                        onChange={handleChange}
                                        placeholder="Enter document number"
                                        required
                                        maxLength={30}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none 
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/>

                                </div>

                            </div>

                            <p className="mt-3 text-xs leading-5 text-slate-500">
                                Your identity details are collected for guest verification. Do not enter actual
                                identity details into a development or test environment.
                            </p>

                        </div>

                    </div>

                    {
                        error && (
                            <div role='alert'
                                className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
                        )
                    }

                    {/* from actions */}
                    <div className='mt-9 flex flex-col-reverse items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row'>
                        <button
                            type='button'
                            onClick={handleBack}
                            className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
                            <ArrowLeft size={16} />
                            Back
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                            {loading ? "Creating Account..." : "Continue to Payment"}
                            {!loading && <ArrowRight size={17} />}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}
