import Hero from "../components/Hero";
import MileageCounter from "../components/MileageCounter";
import MotorcycleList from "../components/MotorcycleList";
import Seo from "../components/Seo";

const showMileageCounter =
  import.meta.env.DEV || import.meta.env.VITE_SHOW_MILEAGE_COUNTER === "true";

function HomePage() {
  return (
    <>
      <Seo
        title="Move Rentals | Scooter, Motorcycle & Car Rentals in Lisbon"
        description="Rent a scooter, motorcycle, or selected car from Move Rentals. Find the right ride for your time in Lisbon."
        path="/"
      />
      <Hero />
      {showMileageCounter && <MileageCounter />}
      <MotorcycleList />
    </>
  );
}

export default HomePage;
