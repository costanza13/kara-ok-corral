
import React from 'react';
import { useEffect, useRef } from 'react';
import { init } from 'ityped'
import { Jumbotron, Container } from 'reactstrap';

function Hero() {

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
        <div className="jumbo">
        <Jumbotron>
            <Container fluid>
                <div className="jumbo-text">
                <h2 className="display-3">Home to your karaoke <span className = "jumbo-span" ref={textRef}></span> roundup</h2>
                </div>
            </Container>
        </Jumbotron>
        </div>

    );

}

export default Hero;
