import { Routes, Route } from 'react-router-dom';
import  Navigation  from './navigation/Navigation';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Mission from './pages/Mission';

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mission" element={<Mission/>} />
      </Routes>
    </>
  );
}

export default App;
