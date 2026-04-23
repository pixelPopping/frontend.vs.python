import { Routes, Route } from 'react-router-dom';
import  Navigation  from './navigation/Navigation';
import Home from './pages/Home';
import Contact from './pages/Contact';
import MissionPage from './pages/MissionPage';

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/missionPage" element={<MissionPage/>} />
      </Routes>
    </>
  );
}

export default App;
