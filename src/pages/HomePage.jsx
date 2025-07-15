import { Helmet } from "react-helmet-async";
import Hero from "../components/Hero";
import MotorcycleList from "../components/MotorcycleList";

function HomePage() {
  return (
    <>
      <Helmet>
        <title>Move Rentals | Scooter & Motorcycle Rentals in Lisbon</title>
        <meta
          name="description"
          content="Rent a scooter or motorcycle with ease from Move Rentals. We have the perfect ride for your adventure in Portugal, including the Yamaha NMAX and RayZR."
        />
      </Helmet>
      <Hero />
      <MotorcycleList />
    </>
  );
}

export default HomePage;
