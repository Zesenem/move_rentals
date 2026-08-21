import Hero from "../components/Hero";
import MotorcycleList from "../components/MotorcycleList";
import Seo from "../components/Seo";

function HomePage() {
  return (
    <>
      <Seo
        title="Move Rentals | Scooter, Motorcycle & Car Rentals in Lisbon"
        description="Rent a scooter, motorcycle, or selected car from Move Rentals. Find the right ride for your time in Lisbon."
        path="/"
      />
      <Hero />
      <MotorcycleList />
    </>
  );
}

export default HomePage;
