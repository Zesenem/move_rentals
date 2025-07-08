import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const smokeLayers = document.querySelectorAll('.smoke-blob');
      
      smokeLayers.forEach((layer) => {
        const speed = parseFloat(layer.getAttribute('data-speed'));
        layer.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="parallax-bg bg-phantom">
        <div 
          className="smoke-blob" 
          data-speed="0.2"
          style={{ width: '800px', height: '800px', top: '10vh', left: '-20vw', backgroundColor: '#40424D' }} // Arsenic
        ></div>
        <div 
          className="smoke-blob"
          data-speed="0.35"
          style={{ width: '600px', height: '600px', top: '5vh', right: '-15vw', backgroundColor: '#6E7180' }} // Graphite
        ></div>
        <div 
          className="smoke-blob"
          data-speed="0.5"
          style={{ width: '700px', height: '700px', top: '40vh', left: '10vw', backgroundColor: '#D3D6E0', opacity: 0.2 }} // Smoke
        ></div>
      </div>

      {/* Main App Layout */}
      <div className="flex flex-col min-h-screen font-sans">
        <Header />
        <main className="flex-grow container mx-auto px-6 relative z-10">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
