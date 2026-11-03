import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  Users,
  BedDouble,
  Maximize2,
  Wifi,
  SlidersHorizontal,
} from "lucide-react";

import {rooms as roomPresentationDate} from "../data/rooms";
import {getAvailableRooms, getRooms} from "../services/roomService"
import {
  roomTypeFilters,
  amenityFilters,
  priceFilter,
  getRoomType,
  hasAmenity,
} from "../data/home/roomListing";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const getNightCount = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  return (Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / 86400000;
};

export default function RoomsPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const searchCheckIn = searchParams.get("checkIn") || "";
  const searchCheckOut = searchParams.get("checkOut") || "";
  const searchGuests = searchParams.get("guests") || "2";
  const stayNights = getNightCount(searchCheckIn, searchCheckOut);

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const [booking, setBooking] = useState({
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    guests: searchParams.get("guests") || "2",
  });

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [maxPrice, setMaxPrice] = useState(priceFilter.max);

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setMaxPrice(priceFilter.max);
  };

  const toggleFilter = (value, setter) => {
    setter((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value]
    );
  };

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

  useEffect(() => {
    setBooking({
      checkIn: searchCheckIn,
      checkOut: searchCheckOut,
      guests: searchGuests,
    });
  }, [searchCheckIn, searchCheckOut, searchGuests]);

  const minCheckout = booking.checkIn
    ? (() => {
        const nextDay = new Date(`${booking.checkIn}T00:00:00`);
        nextDay.setDate(nextDay.getDate() + 1);
        return `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, "0")}-${String(nextDay.getDate()).padStart(2, "0")}`;
      })()
    : today;

  const handleSearch = (event) => {
    event.preventDefault();

    if (
      booking.checkIn &&
      booking.checkOut &&
      booking.checkOut <= booking.checkIn
    ) {
      window.alert("Check-out date must be after check-in date.");
      return;
    }

    setSearchParams(booking);
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter((room)=>{
      const displayRoom = {
        ...room,
        name: room.roomType,
        id: room._id,
        price: stayNights > 0 && Number.isFinite(room.totalPrice)
          ? room.totalPrice / stayNights
          : room.pricePerNight,
        amenities: room.amenities || [],
      };

      const matchesType = selectedTypes.length === 0 ||
      selectedTypes.includes(getRoomType(displayRoom));

      const matchesPrice = displayRoom.price <= maxPrice;

      const matchesAmenities = selectedAmenities.length === 0 ||
      selectedAmenities.every((amenityId)=>{
        const filter = amenityFilters.find((item)=>item.id === amenityId);

        return filter ? hasAmenity(displayRoom,filter):true;
      });
      return(
        room.isActive &&
        room.status === "available" &&
        (!room.houseKeepingStatus || ["clean", "inspected"].includes(room.houseKeepingStatus)) &&
        matchesType &&
        matchesPrice &&
        matchesAmenities
      ) ;
    })
    .map((room)=>{
      const presentation = roomPresentationDate.find(
        (item)=>item.name.toLowerCase() === room.roomType.toLowerCase()
      );

      return{
        ...room,
        id:room._id,
        name:room.roomType,
        price:stayNights > 0 && Number.isFinite(room.totalPrice)
          ? room.totalPrice / stayNights
          : room.pricePerNight,
        stayTotal: Number.isFinite(room.totalPrice) ? room.totalPrice : null,
        image:presentation?.image || roomPresentationDate[0]?.image || [],
      };
    });

},[
  rooms,
  selectedTypes,
  selectedAmenities,
  maxPrice,
  stayNights,
]);

  // fetching rooms from backend

  useEffect(()=>{
    const loadRooms = async()=>{
      try{
        setIsLoading(true);
        setLoadError("");

        const roomRecords = searchCheckIn && searchCheckOut
          ? await getAvailableRooms(searchCheckIn, searchCheckOut, searchGuests)
          : await getRooms();
        setRooms(roomRecords);
      }catch(error){
        setLoadError(error.response?.data?.message || "Unable to load rooms. Please check the backend");
      }finally{
        setIsLoading(false);
      }
    }
    loadRooms();
  },[searchCheckIn, searchCheckOut, searchGuests]);





  return (
    
    <main className="min-h-screen bg-[#fbfaf6]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Rooms
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Find a comfortable room for your stay.
          </p>
        </div>

        {/* Booking search */}
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.8fr_auto] lg:items-end"
        >
          <div>
            <label
              htmlFor="rooms-check-in"
              className="mb-2 block text-xs font-medium text-slate-500"
            >
              Check-in
            </label>

            <div className="relative">
              <CalendarDays
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="rooms-check-in"
                type="date"
                name="checkIn"
                min={today}
                value={booking.checkIn}
                onChange={handleBookingChange}
                required
                className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="rooms-check-out"
              className="mb-2 block text-xs font-medium text-slate-500"
            >
              Check-out
            </label>

            <div className="relative">
              <CalendarDays
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="rooms-check-out"
                type="date"
                name="checkOut"
                min={minCheckout}
                value={booking.checkOut}
                onChange={handleBookingChange}
                required
                className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="rooms-guests"
              className="mb-2 block text-xs font-medium text-slate-500"
            >
              Guests
            </label>

            <div className="relative">
              <Users
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                id="rooms-guests"
                name="guests"
                value={booking.guests}
                onChange={handleBookingChange}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {[1, 2, 3, 4, 5, 6].map((count) => (
                  <option key={count} value={count}>
                    {count} {count === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="min-h-12 rounded-lg bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
          >
            Search
          </button>
        </form>

        {/* Listing and filters */}
        <div className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* Filter sidebar */}
          <aside className="h-fit rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={17} className="text-blue-600" />

                <h2 className="font-semibold text-slate-900">
                  Filters
                </h2>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-blue-600 hover:text-blue-800"
              >
                Clear
              </button>
            </div>

            {/* Room type */}
            <div className="border-b border-slate-100 pb-6">
              <h3 className="mb-4 text-sm font-semibold text-slate-800">
                Room Type
              </h3>

              <div className="space-y-3">
                {roomTypeFilters.map((filter) => (
                  <label
                    key={filter.id}
                    className="flex cursor-pointer items-center gap-3 text-sm text-slate-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(filter.id)}
                      onChange={() =>
                        toggleFilter(filter.id, setSelectedTypes)
                      }
                      className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                    />

                    {filter.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="border-b border-slate-100 py-6">
              <h3 className="mb-4 text-sm font-semibold text-slate-800">
                Price Range
              </h3>

              <input
                type="range"
                min={priceFilter.min}
                max={priceFilter.max}
                step={priceFilter.step}
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(Number(event.target.value))
                }
                className="w-full cursor-pointer accent-blue-600"
                aria-label="Maximum price per night"
              />

              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>{formatPrice(priceFilter.min)}</span>
                <span>{formatPrice(maxPrice)}</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="pt-6">
              <h3 className="mb-4 text-sm font-semibold text-slate-800">
                Amenities
              </h3>

              <div className="space-y-3">
                {amenityFilters.map((filter) => (
                  <label
                    key={filter.id}
                    className="flex cursor-pointer items-center gap-3 text-sm text-slate-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(filter.id)}
                      onChange={() =>
                        toggleFilter(
                          filter.id,
                          setSelectedAmenities
                        )
                      }
                      className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                    />

                    {filter.label}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Room results */}
         
          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Available Rooms
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredRooms.length} rooms found
                </p>
              </div>

              <span className="text-xs text-slate-500">
                Prices are per night
              </span>
            </div>

            {loading && (
              <p className="py-10 text-center text-slate-500">
                Loading rooms from the database...
              </p>
            )}

            {loadError && (
              <p className="rounded-lg bg-red-50 p-4 text-red-600">
                {loadError}
              </p>
            )}

            {!loading && !loadError && (
              <div className="space-y-5">
              {filteredRooms.map((room) => (
                <article
                  key={room.id}
                  className="grid grid-cols-1 gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:grid-cols-[185px_minmax(0,1fr)]"
                >
                  {/* Room image */}
                  <div className="aspect-[5/4] overflow-hidden rounded-lg bg-slate-100 sm:aspect-square">
                    <img
                      src={room.image}
                      alt={room.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Room details */}
                  <div className="flex min-w-0 flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                            {room.name}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {room.description}
                          </p>
                        </div>

                        {room.tag && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                            {room.tag}
                          </span>
                        )}
                      </div>

                      {/* Room features */}
                      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-2">
                          <Users size={15} className="text-blue-600" />
                          {room.capacity} Guests
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <BedDouble size={15} className="text-blue-600" />
                          {room.size} sq. ft.
                        </span>

                        {(room.amenities || []).slice(0, 2).map((amenity) => (
                          <span
                            key={amenity}
                            className="inline-flex items-center gap-2"
                          >
                            <Wifi size={14} className="text-blue-600" />
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price and booking action */}
                    <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs text-slate-500">
                          {room.stayTotal !== null ? "Average per night for these dates" : "Starting from"}
                        </p>

                        <p className="mt-1 text-base font-bold text-slate-900">
                          {formatPrice(room.price)}
                          <span className="ml-1 text-xs font-normal text-slate-500">
                            / night
                          </span>
                        </p>
                        {room.stayTotal !== null && (
                          <p className="mt-1 text-xs font-medium text-slate-600">
                            Stay total ({stayNights} {stayNights === 1 ? "night" : "nights"}): {formatPrice(room.stayTotal)}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/rooms/${encodeURIComponent(room.id)}?${searchParams.toString()}`
                          )
                        }
                        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {/* Empty state */}
              {filteredRooms.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                  <h3 className="font-semibold text-slate-900">
                    {searchCheckIn && searchCheckOut
                      ? "No rooms are available for these dates"
                      : "No rooms match your filters"}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {searchCheckIn && searchCheckOut
                      ? "Try different check-in and check-out dates. You can change them in the search form above."
                      : "Try changing the room type, price range, or amenities."}
                  </p>

                  {(!searchCheckIn || !searchCheckOut) && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
