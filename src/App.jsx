import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import RoomsPage from './pages/RoomsPage';
import RoomDetailsPage from "./pages/RoomDetailsPage";
import GuestInformationPage from "./pages/GuestInformationPage";
import PaymentPage from './pages/PaymentPage'
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import MyBookingPage from './pages/MyBookingPage';
// import RoomCard from "./components/rooms/RoomCard";


const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="*" element={<NotFoundPage/>} />
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/rooms" element={<RoomsPage/>}/>
                    <Route path="/rooms/:id" element={<RoomDetailsPage/>}/>
                    <Route path="/booking/guest-information" element={<GuestInformationPage/>}/>
                    <Route path="/booking/payment" element={<PaymentPage/>}/>
                     <Route path="/booking/confirmation" element={<BookingConfirmationPage/>}/>
                      <Route path="/my-booking" element={<MyBookingPage/>}/>
                </Route>
            </Routes>

        </BrowserRouter>
    )
}

export default App
