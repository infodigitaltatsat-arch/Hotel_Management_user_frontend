import { useLocation, useNavigate } from "react-router-dom";
import { Check, Home, CalendarCheck, CircleAlert } from "lucide-react";

import { confirmationDetails } from "../data/payments/bookingConfirmation";

function formatDate(value) {
  if (!value) return "—";

  const datePart = String(value).slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatCurrency(value) {
  if (value === undefined || value === null || value === "") {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export default function BookingConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // This must be passed only after the backend successfully creates
  // and returns a reservation.
  const reservation = location.state?.reservation;

  const hasConfirmation =
    reservation &&
    reservation.bookingId &&
    reservation.guestName &&
    reservation.roomName;

  const displayValues = {
    bookingId: reservation?.bookingId,
    guestName: reservation?.guestName,
    checkIn: formatDate(reservation?.checkIn),
    checkOut: formatDate(reservation?.checkOut),
    roomName: reservation?.roomName,
    totalAmount: formatCurrency(reservation?.totalAmount),
  };

  return (
    <main className="min-h-screen bg-[#fbfaf6] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl">
        {/* Page heading */}
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            7
          </span>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Booking Confirmation
          </h1>
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          {/* Hotel header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
                <Home size={17} />
              </span>

              <span className="font-semibold text-slate-900">
                The Grand Hotel
              </span>
            </div>

            <CalendarCheck className="text-slate-500" size={20} />
          </div>

          {hasConfirmation ? (
            <>
              {/* Success section */}
              <div className="relative overflow-hidden px-5 pb-7 pt-10 text-center sm:px-8">
                {/* Decorative background dots */}
                <div className="pointer-events-none absolute inset-0 opacity-50">
                  <span className="absolute left-[12%] top-10 h-2 w-2 rounded-full bg-red-400" />
                  <span className="absolute left-[22%] top-20 h-1.5 w-1.5 rounded-full bg-sky-400" />
                  <span className="absolute left-[35%] top-12 h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="absolute right-[18%] top-12 h-2 w-2 rounded-full bg-pink-400" />
                  <span className="absolute right-[28%] top-24 h-1.5 w-1.5 rounded-full bg-blue-400" />
                  <span className="absolute right-[10%] top-16 h-2 w-2 rounded-full bg-emerald-400" />
                </div>

                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-950 text-white shadow-lg">
                  <Check size={42} strokeWidth={2.5} />
                </div>

                <h2 className="relative mt-5 text-2xl font-bold text-emerald-800">
                  Booking Confirmed!
                </h2>

                <p className="relative mt-3 text-sm text-slate-600">
                  Your reservation has been successfully created.
                </p>
              </div>

              {/* Booking summary */}
              <div className="mx-5 rounded-lg border border-slate-100 bg-slate-50/70 p-5 sm:mx-8 sm:p-6">
                <div className="space-y-5">
                  {confirmationDetails.map((detail) => (
                    <div
                      key={detail.key}
                      className="flex items-start justify-between gap-4 text-sm"
                    >
                      <span className="text-slate-500">
                        {detail.label}
                      </span>

                      <span
                        className={`max-w-[60%] break-words text-right font-semibold ${
                          detail.key === "bookingId"
                            ? "text-slate-900"
                            : "text-slate-800"
                        }`}
                      >
                        {displayValues[detail.key] || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 pb-7 pt-6 sm:px-8">
                <button
                  type="button"
                  onClick={() => navigate("/my-booking")}
                  className="flex min-h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                >
                  View My Bookings
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="mt-3 flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Back to Home
                </button>

                {reservation.guestEmail && (
                  <p className="mt-7 text-center text-xs leading-6 text-slate-500">
                    A confirmation email will be sent to
                    <span className="block font-medium text-blue-700">
                      {reservation.guestEmail}
                    </span>
                  </p>
                )}
              </div>
            </>
          ) : (
            /* No real reservation was passed */
            <div className="px-5 py-16 text-center sm:px-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <CircleAlert size={32} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No Booking Confirmation Available
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                We couldn't find a confirmed reservation. Please complete
                the booking process first. No booking has been confirmed
                on this page.
              </p>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Home size={16} />
                Back to Home
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
