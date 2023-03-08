import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Events from "./pages/Events";
import Preloader from "./components/Preloader";
import Scan2 from "./components/Scan2";
import CheckpointOverview from "./components/CheckpointOverview";
import EventOverview from "./components/EventOverview";

function App() {
    return (
        <BrowserRouter basename={"/walk"}>
            <Preloader />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/events" element={<Events />} />
                <Route path="/services" element={<Services />} />
                <Route path="/scan/:ckpid?" element={<Scan2 />} />
                <Route path="/overview/checkpoint/:linkCode?" element={<CheckpointOverview />} />
                <Route path="/overview/event/:overviewCode?" element={<EventOverview />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
