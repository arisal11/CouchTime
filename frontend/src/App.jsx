import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Host from '../routes/Host.jsx'
import Add from '../routes/Add.jsx'
import About from '../routes/About.jsx'
import Home from '../routes/Home.jsx'
import Head from '../components/Header.jsx'
import Foot from '../components/Footer.jsx'

function App() {
  return (
    <>
    <Router>
      <Head />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/host" element={<Host />}></Route>
        <Route path="/add" element={<Add />}></Route>
        <Route path="/about" element={<About />}></Route>
      </Routes>
      <Foot />
    </Router>
    </>
  );
}

export default App;
