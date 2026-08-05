import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import DialogueBox from "./components/DialogueBox";
import Navbar from "./components/Navbar";
import QuestLog from "./components/QuestLog";
import StatsPanel from "./components/StatsPanel";
import Achievements from "./components/Achievements";
import AdminPanel from "./components/AdminPanel";
import Starfield from "./components/Starfield";

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <div>
      <section id="home">
        <DialogueBox />
      </section>
      <section id="quests">
        <QuestLog />
      </section>
      <section id="stats">
        <StatsPanel />
      </section>
      <section id="achievements">
        <Achievements />
      </section>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Starfield />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
