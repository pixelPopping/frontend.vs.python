import { Routes, Route } from 'react-router-dom';
import  Navigation  from './navigation/Navigation';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Mission from './pages/Mission';
import DetailMission from './pages/DetailMission';

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mission" element={<Mission/>} />
        <Route path="/detailmission" element={<DetailMission/>} />
      </Routes>
    </>
  );
}

export default App;
