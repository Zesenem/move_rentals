import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
    return (
        <>
            <ScrollRestoration />
            <div className="bg-phantom">
                <div className="flex flex-col min-h-screen font-sans">
                    <Header />
                    <main className="flex-grow">
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>
        </>
    );
}

export default App;
