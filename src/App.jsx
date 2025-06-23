import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./App.css";

function App() {
  return (
    // FIX 1: Using a simpler, more compatible gradient syntax.
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-700 to-slate-900">
      <Header />
      <main className="flex-grow container mx-auto px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App;
