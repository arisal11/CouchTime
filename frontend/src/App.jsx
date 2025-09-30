import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import Host from '../routes/Host.jsx'
import Add from '../routes/Add.jsx'
import About from '../routes/About.jsx'
import Home from '../routes/Home.jsx'
import Head from '../components/Header.jsx'
import Foot from '../components/Footer.jsx'
import Hero from "../components/Hero.jsx";

function App() {

   const [sessionId, setSessionId] = useState(null);

    useEffect(() =>{
           fetch("http://localhost:5001/session", {
               credentials: "include"
           })
           .then(res =>res.json)
           .then(data =>setSessionId(data.sessionId))
       }, [])
  return (
    <>
    <Router>
      <Head />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/host" element={<Host />}></Route>
        <Route path="/add" element={<Add />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/host/:roomId" element={<Hero />}></Route>
      </Routes>
      <Foot />
    </Router>
    </>
  );
}

export default App;
