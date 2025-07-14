import { useEffect } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const smokeLayers = document.querySelectorAll(".smoke-blob-effect");

      smokeLayers.forEach((layer) => {
        const speed = parseFloat(layer.getAttribute("data-speed"));
        const element = layer;
        element.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smokeBlobBase = "absolute rounded-full filter blur-3xl opacity-30 smoke-blob-effect";

  return (
    <>
      <ScrollRestoration />
      <div className="fixed inset-0 bg-phantom -z-10">
        <div
          className={`${smokeBlobBase} w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-arsenic top-[10vh] left-[-30vw] md:left-[-20vw]`}
          data-speed="0.2"
        ></div>
        <div
          className={`${smokeBlobBase} w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-graphite top-[5vh] right-[-35vw] md:right-[-15vw]`}
          data-speed="0.35"
        ></div>
        <div
          className={`${smokeBlobBase} w-[350px] h-[350px] md:w-[700px] md:h-[700px] bg-cloud/40 top-[40vh] left-[10vw]`}
          data-speed="0.5"
        ></div>
      </div>

      <div className="flex flex-col min-h-screen font-sans isolate">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
