import { Routes, Route } from 'react-router-dom';
import  Navigation  from './navigation/Navigation';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Formulier from './pages/Formulier';

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/Formulier" element={<Formulier />} />
      </Routes>
    </>
  );
}

export default App;
