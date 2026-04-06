import { Helmet } from "react-helmet-async";
import Hero from "../components/Hero";
import MotorcycleList from "../components/MotorcycleList";

function HomePage() {
  return (
    <>
      <Helmet>
        <title>Move Rentals | Scooter, Motorcycle & Car Rentals in Lisbon</title>
        <meta
          name="description"
          content="Rent a scooter, motorcycle, or selected car from Move Rentals. Find the right ride for your time in Lisbon."
        />
      </Helmet>
      <Hero />
      <MotorcycleList />
    </>
  );
}

export default HomePage;
