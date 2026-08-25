import React, { useState, useEffect, useContext, useMemo } from "react";
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

  // Sterren
  const stars = useMemo(() => {
    return Array.from({ length: 150 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      size: Math.random() * 3 + 1,
    }));
  }, []);

  // Meteoren
  const meteors = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      top: Math.random() * 50,
      left: Math.random() * 100,
      delay: Math.random() * 5,
    }));
  }, []);

  // Countdown
  useEffect(() => {
    let current = 5;

    const timer = setInterval(() => {
      current--;

      setCountdown(current);

      if (current <= 0) {
        clearInterval(timer);
        setLaunchReady(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fallback redirect
  useEffect(() => {
    if (!launchReady) return;

    const timer = setTimeout(() => {
      navigate("/contact");
    }, 8000);

    return () => clearTimeout(timer);
  }, [launchReady, navigate]);

  const handleTransitionEnd = () => {
    navigate("/contact");
  };

  return (
    <main className="launch-container">

      {/* Achtergrond */}
      <div className="starry-background">
        {stars.map((star) => (
          <span
            key={star.id}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Planeet */}
      <div className="planet"></div>

      {/* Wormhole */}
      <div className="wormhole"></div>

      {/* Meteoren */}
      {meteors.map((meteor) => (
        <div
          key={meteor.id}
          className="meteor"
          style={{
            top: `${meteor.top}%`,
            left: `${meteor.left}%`,
            animationDelay: `${meteor.delay}s`,
          }}
        />
      ))}

      {/* UFO's */}
      <img src={ufoImg} className="ufo ufo1" alt="UFO" />
      <img src={ufoImg} className="ufo ufo2" alt="UFO" />
      <img src={ufoImg} className="ufo ufo3" alt="UFO" />

      {/* Laser */}
      <div className="laser"></div>

      {/* Countdown */}
      {countdown > 0 && (
        <h1 className="countdown unbounded">
          Launch in: {countdown}
        </h1>
      )}

      {countdown === 0 && (
        <h1 className="countdown unbounded">
          🚀 Launch!
        </h1>
      )}

      {/* Launch Scene */}
      <div className="launch-scene">

        <div className="launch-tower"></div>

        <img
          src={rocketImg}
          alt="Rocket"
          className={`rocket-img ${launchReady ? "launch" : ""}`}
          onTransitionEnd={handleTransitionEnd}
        />

        <div className="smoke"></div>

        <div className="platform"></div>

      </div>

    </main>
  );
}

export default RocketLaunch;