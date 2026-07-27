import DialogueBox from "./components/DialogueBox";
import Navbar from "./components/Navbar";
import QuestLog from "./components/QuestLog";
import StatsPanel from "./components/StatsPanel";
import AdminPanel from "./components/AdminPanel";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Achievements from "./components/Achievements";

function Home() {
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
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
