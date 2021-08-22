import React from 'react';
import { useEffect, useRef } from 'react';
import { init } from 'ityped'

const Hero = () => {
    const textRef = useRef();

    useEffect(() => {
        init(textRef.current, {
            showCursor: true,
            backDelay: 1500,
            backSpeed: 80,
            strings: ["song", "playlist", "party"],
        });

    }, []);

    return (
        <div className="hero">
            <h2 className="hero">Your karaoke <span className="hero" ref={textRef}></span> roundup</h2>
        </div>
    );
}

export default Hero;

