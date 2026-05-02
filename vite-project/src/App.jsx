import { Routes, Route } from 'react-router-dom';
import Navigation from './navigation/Navigation';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Mission from './pages/Mission';
import DetailMission from './pages/DetailMission';
import RocketLaunch from './pages/RocketLaunch';
import SavedMissions from './pages/SavedMissions';

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/savedmissions" element={<SavedMissions />} />
        <Route path="/detailmission/:id" element={<DetailMission />} />
        <Route path="/rocketlaunch/:id" element={<RocketLaunch/>}/>
      </Routes>
    </>
  );
}

export default App;

