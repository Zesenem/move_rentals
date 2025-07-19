import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

function BookingSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
      <div className="bg-arsenic p-8 rounded-lg shadow-lg max-w-md w-full">
        <FaCheckCircle className="text-emerald-500 text-6xl mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-cloud mb-4">Booking Confirmed!</h1>
        <p className="text-steel mb-2">Thank you for your rental. Your booking is now confirmed.</p>
        <Link
          to="/"
          className="bg-cloud text-phantom font-bold py-3 px-6 rounded-md hover:bg-cloud/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default BookingSuccessPage;
