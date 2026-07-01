import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Home from "../routes/Home.jsx";
import Host from "../routes/Host.jsx";
import Room from "../routes/Room.jsx";
import About from "../routes/About.jsx";

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/host/:code" element={<Host />} />
            <Route path="/room/:code" element={<Room />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
