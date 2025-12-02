import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Home from "./commonend/home.jsx";
// import About from "./commonend/about.jsx";
// import Book from "./commonend/book.jsx";
// import Contact from "./commonend/contact.jsx";
// import Login from "./commonend/login.jsx";
// import Register from "./commonend/register.jsx";
// import Projects from "./commonend/projects.jsx";
// import Pricing from "./commonend/pricing.jsx";

export default function AppRoutes() {

  return (
    <Router>
       <Routes>
        <Route path="/" element={<Home />} /> {/* Default route */}
        {/* <Route path="/about" element={<About />} />
        <Route path="/book" element={<Book />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/register" element={<Register />} /> */}
        <Route path="*" element={<Home />} />
        </Routes>
    </Router>
  );

 
}