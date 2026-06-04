import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./RocketLaunch.css";
import { AuthContext } from "../context/AuthContext";

import rocketImg from "../assets/Images/rocket.png";
import ufoImg from "../assets/Images/ufo.png";

function RocketLaunch() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [countdown, setCountdown] = useState(5);
  const [launchReady, setLaunchReady] = useState(false);

  useEffect(() => {
    console.log("RocketLaunch mounted");
    console.log("User:", user);
  }, [user]);

  // Countdown
  useEffect(() => {
    console.log("Countdown started");

    let current = 5;

    const timer = setInterval(() => {
      current--;

      console.log("Countdown:", current);

      setCountdown(current);

      if (current <= 0) {
        console.log("Launch Ready!");
        clearInterval(timer);
        setLaunchReady(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Kijk of launchReady verandert
  useEffect(() => {
    console.log("launchReady =", launchReady);
  }, [launchReady]);

  // Fallback redirect na 8 seconden
  useEffect(() => {
    if (!launchReady) return;

    console.log("Launch sequence active");

    const timer = setTimeout(() => {
      console.log("FORCED REDIRECT TO /contact");
      navigate("/contact");
    }, 8000);

    return () => clearTimeout(timer);
  }, [launchReady, navigate]);

  const handleAnimationEnd = (e) => {
    console.log("Animation ended");
    console.log("Animation name:", e.animationName);
    console.log("Navigating to /contact");

    navigate("/contact");
  };

  return (
    <main className="launch-container">
      <div className="starry-background"></div>

      <div className="planet"></div>

      <div className="wormhole"></div>

      <img src={ufoImg} className="ufo ufo1" alt="ufo" />
      <img src={ufoImg} className="ufo ufo2" alt="ufo" />
      <img src={ufoImg} className="ufo ufo3" alt="ufo" />

      <div className="laser"></div>

      {countdown > 0 && (
        <p className="countdown unbounded">Launch in: {countdown}</p>
      )}

      {countdown === 0 && <p className="countdown unbounded">🚀 Launch!</p>}

      <div className="launch-scene">
        <div className="launch-tower"></div>

        <img
          src={rocketImg}
          alt="rocket"
          className={`rocket-img ${launchReady ? "launch" : ""}`}
          onAnimationEnd={handleAnimationEnd}
        />

        <div className="smoke"></div>
        <div className="platform"></div>
      </div>
    </main>
  );
}

export default RocketLaunch;
