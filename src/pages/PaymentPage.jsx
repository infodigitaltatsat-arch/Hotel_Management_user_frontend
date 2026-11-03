import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Check,
    CircleCheck,
    CreditCard,
    Hotel,
    ArrowLeft,
    Info,
} from 'lucide-react'

import { createReservation } from "../services/reservationService";

import {
    paymentMethods,
    paymentBookingSteps,
    defaultAdvancePayment,
} from '../data/payments/payment';

export default function PaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // details passed from guestInfo page
    const bookingDetails = location.state || {};

    const {
        roomId,
        checkIn,
        checkOut,
        guests,
        roomName,
        quotedTotal,
        guestDetails,
    } = bookingDetails;

    const [paymentMethod, setPaymentMethod] = useState("pay-at-hotel");
    const [advancePayment, setAdvancePayment] = useState(String(defaultAdvancePayment));
    const [specialRequests, setSpecialRequests] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [notice, setNotice] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleBack = () => {
        navigate('/booking/guest-information', {
            state: bookingDetails,
        })
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!roomId || !checkIn || !checkOut || !guests || !guestDetails) {
            setNotice("Booking information is missing. Please return to guest information.");
            return;
        }

        if (!acceptedTerms) {
            setNotice("Please accept the cancellation policy and terms.");
            return;
        }

        if (
            advancePayment.trim() !== "" &&
            (!Number.isFinite(Number(advancePayment)) ||
                Number(advancePayment) < 0)
        ) {
            setNotice("Please enter a valid payment amount.");
            return;
        }

        try {
            setSubmitting(true);
            setNotice("");

            const response = await createReservation({
                roomId,
                checkIn,
                checkOut,
                numberOfGuests: Number(guests),
            });

            const createdReservation = response.data;

            navigate("/booking/confirmation", {
                state: {
                    reservation: {
                        bookingId: createdReservation.bookingReference,
                        guestName: guestDetails.fullName,
                        guestEmail: guestDetails.email,
                        checkIn: createdReservation.checkIn,
                        checkOut: createdReservation.checkOut,
                        roomName: roomName || `Room ${roomId.slice(-6)}`,
                        totalAmount: createdReservation.totalPrice,
                    },
                },
            });
        } catch (error) {
            setNotice(
                error.response?.data?.message ||
                "Unable to create reservation. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <main className="min-h-screen bg-[#fbfaf6] px-4 py-8 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-3xl">

                {/* page heading */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                        Payment
                    </h1>

                    <p className='mt-2 text-sm text-slate-500'>
                        Choose your payment preference and review the booking conditions.
                    </p>
                </div>

                <section className="mb-6 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                    <h2 className="font-semibold text-slate-900">Booking summary</h2>
                    <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm text-slate-600">
                        <span>{roomName || "Room"}</span>
                        <span>{checkIn} to {checkOut}</span>
                    </div>
                    {quotedTotal !== null && quotedTotal !== undefined && (
                        <p className="mt-3 text-right font-semibold text-slate-900">
                            Stay total: {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                                maximumFractionDigits: 0,
                            }).format(quotedTotal)}
                        </p>
                    )}
                </section>

                {/* Booking progress */}
                <section className="mb-6 rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <Hotel size={19} />
                        </div>
                        <div className='h-1 flex-1 overflow-hidden rounded-full bg-slate-200'>
                            <div className="h-full w-full rounded-full bg-blue-600" />
                        </div>

                    </div>

                    <div className="mt-5 grid grid-cols-3">
                        {paymentBookingSteps.map((step, index) => {
                            const isCompleted = index === 0;
                            const isActive = index === 1;

                            return (
                                <div
                                    key={step.id}
                                    className={`flex items-center gap-2 ${index === 1 ? 'justify-center' : index === 2 ? "justify-end" : "justify-start"
                                        }`}>

                                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${isCompleted ? 'bg-blue-600 text-white' : isActive ? "bg-blue-600 text-white" : "border border-slate-300 bg-white text-slate-500"
                                        }`}>
                                        {step.number}
                                    </span>
                                    <span className={`text-xs font-medium sm:text-sm ${isActive ? "text-blue-700" : isCompleted ? "text-slate-700" : "text-slate-500"
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                </section>


                {/* payment form */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Payment Details
                    </h2>

                    {/* payment method */}
                    <section className="mt-6">
                        <h3 className="mb-4 text-sm font-semibold text-slate-800">
                            Payment Method
                        </h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {paymentMethods.map((method) => (
                                <label
                                    key={method.id}
                                    className={`flex items-start gap-3 rounded-lg border p-4 ${method.available ? "cursor-pointer border-blue-200 bg-blue-50/50" : "cursor-not-allowed border-slate-200 bg-slate-50 opacity-70"}`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method.id}
                                        checked={paymentMethod === method.id}
                                        onChange={() => setPaymentMethod(method.id)}
                                        className="mt-1 h-4 w-4 accent-blue-600" />

                                    <div className="">
                                        <p className="text-sm font-semibold text-slate-800">
                                            {method.label}
                                        </p>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {method.desc}
                                        </p>
                                    </div>
                                </label>

                            ))}
                        </div>
                    </section>

                    {/* advanced payment  */}
                    <section className="mt-7">
                        <label
                            htmlFor="advancePayment"
                            className="mb-2 block text-sm font-semibold text-slate-800">
                            Advance payment{" "}
                            <span className="font-normal text-slate-500">
                                (optional)
                            </span>
                        </label>

                        <div className="flex overflow-hidden rounded-lg border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus:within:ring-blue-100">
                            <span className="flex items-center border-r border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-600">
                            ₹
                            </span>

                            <input
                                id="advancePayment"
                                type="number"
                                min='0'
                                step='1'
                                value={advancePayment}
                                onChange={(event) => {
                                    setAdvancePayment(event.target.value);
                                    setNotice("");
                                }}
                                placeholder="Enter advance amount"
                                className="min-w-0 flex-1 px-4 py-3 text-sm outline-none" />
                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                            You can leave this field empty if you don't want to enter an advance amount
                        </p>
                    </section>

                    {/* special request */}
                    <section className="mt-7">
                        <label className="mb-2 block text-sm font-semibold text-slate-800">
                            Special request
                        </label>
                        <textarea
                            id="specialRequests"
                            value={specialRequests}
                            onChange={(event) => setSpecialRequests(event.target.value)}
                            placeholder="Enter details like early check-in, extra bad, etc."
                            row={4}
                            maxlength={500}
                            className='w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm ouline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100' />
                        <p className="mt-1 text-right text-xs text-slate-400">
                            {specialRequests.length}/500
                        </p>


                    </section>

                    {/* Term and condition */}
                    <section className='mt-7 border-t border-slate-100 pt-6'>
                        <label className='flex cursor-pointer items-start gap-3'>
                            <input
                                type='checkbox'
                                checked={acceptedTerms}
                                onChange={(event) => {
                                    setAcceptedTerms(event.target.checked);
                                    setNotice("")
                                }}
                                required
                                className='mt-0.5 h-4 w-4 shrink-0 rounded accent-blue-600' />
                            <span className='text-sm leading-6 text-slate-600'>
                                I agree to the cancellation policy and terms &amp; conditions.
                            </span>
                            <span className='text-red-500'>*</span>
                        </label>
                    </section>

                    {/* integration notice */}
                    {notice && (
                        <div role='status'
                            className='mt-5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800'>
                            <Info size={16}
                                className='' />
                            {notice}
                        </div>
                    )}

                    {/* Action */}
                    <div className='mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row'>
                        <button
                            type='button'
                            onClick={handleBack}
                            className='inline-flex items-center justify-center rounded-xl gap-2 px-4 py-3 text-sm font-semibold transition duration-300  hover:bg-slate-200 mb-2 hover:text-slate-700'>
                            <ArrowLeft size={16} />
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 min-h-12 w-full justify-center px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                            <CreditCard size={16} />
                            {submitting ? "Creating Reservation..." : "Confirm Booking"}
                        </button>
                    </div>



                </form>


            </div>

        </main>
    )
}
