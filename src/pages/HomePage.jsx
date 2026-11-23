import Hero from "../components/Hero";
import MileageCounter from "../components/MileageCounter";
import LazyMotorcycleList from "../components/LazyMotorcycleList";
import Seo from "../components/Seo";
import FaqSection from "../components/FaqSection.jsx";
import { FAQ_STRUCTURED_DATA } from "../data/faq.js";

const showMileageCounter =
  import.meta.env.DEV || import.meta.env.VITE_SHOW_MILEAGE_COUNTER === "true";

function HomePage() {
  return (
    <>
      <Seo
        title="Move Rentals | Scooter, Motorcycle & Car Rentals in Lisbon"
        description="Rent a scooter, motorcycle, or selected car from Move Rentals. Find the right ride for your time in Lisbon."
        path="/"
        structuredData={FAQ_STRUCTURED_DATA}
      />
      <Hero />
      {showMileageCounter && <MileageCounter />}
      <LazyMotorcycleList />
      <FaqSection />
    </>
  );
}

export default HomePage;
