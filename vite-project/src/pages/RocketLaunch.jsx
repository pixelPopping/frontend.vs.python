import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router";
import './RocketLaunch.css';

// Afbeeldingen
import rocketImg from '../assets/Images/rocket.png';
import ufoImg from '../assets/Images/ufo.png';

function RocketLaunch() {
    const { id } = useParams();
    const [launchReady, setLaunchReady] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const navigate = useNavigate();

    // ⭐ Countdown (stil)
    useEffect(() => {
        let i = 5;
        const timer = setInterval(() => {
            i--;
            setCountdown(i);

            if (i === 0) {
                clearInterval(timer);
                setLaunchReady(true);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // 🚀 Redirect na launch
    useEffect(() => {
        if (launchReady) {
            setTimeout(() => {
                navigate(`/detailmission/${id}`);
            }, 2500);
        }
    }, [launchReady, navigate, id]);

    return (
        <main className="launch-container">

            {/* ⭐ Animated sterren achtergrond */}
            <div className="starry-background">
                {Array.from({ length: 80 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="star"
                        style={{
                            top: Math.random() * 100 + "%",
                            left: Math.random() * 100 + "%",
                            animationDelay: Math.random() * 2 + "s"
                        }}
                    />
                ))}
            </div>

            {/* 🪐 Planeet */}
            <div className="planet"></div>

            {/* 🌠 Meteoren */}
            {Array.from({ length: 10 }).map((_, i) => (
                <div 
                    key={i}
                    className="meteor"
                    style={{
                        top: Math.random() * 50 + "%",
                        left: Math.random() * 100 + "%",
                        animationDelay: Math.random() * 2 + "s"
                    }}
                />
            ))}

            {/* 🔮 Wormhole */}
            <div className="wormhole"></div>

          

            {/* 🛸 UFO’s */}
            <img src={ufoImg} className="ufo ufo1" alt="ufo" />
            <img src={ufoImg} className="ufo ufo2" alt="ufo" />
            <img src={ufoImg} className="ufo ufo3" alt="ufo" />

            {/* 🔫 Laser */}
            <div className="laser"></div>

            {/* Countdown tekst */}
            {countdown > 0 && (
                <p className="countdown unbounded">Launch in: {countdown}</p>
            )}

            {countdown === 0 && (
                <p className="countdown unbounded">🚀 Launch!</p>
            )}

            {/* Launch scene */}
            <div className="launch-scene">

                {/* 🗼 Launch tower */}
                <div className="launch-tower"></div>

                {/* 🚀 Raket */}
                <img 
                    src={rocketImg} 
                    alt="rocket" 
                    className={`rocket-img ${countdown === 0 ? "launch" : ""}`}
                />

                {/* Rook + platform */}
                <div className="smoke"></div>
                <div className="platform"></div>
            </div>

        </main>
    );
}

export default RocketLaunch;


