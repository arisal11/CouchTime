import { useState, useEffect } from 'react';
import '../src/styles/main.css'

function Home(){

    const images = [
        './images/people-image.jpg',
        './images/people-image2.jpg',
        './images/people-image3.jpg'
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
        setFade(false); 
    
        setTimeout(() => {
            setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
            setFade(true); 
            }, 500); 
        }, 5000); 
    
        return () => clearInterval(timer);
    }, [images.length]);
    
    return(
        <>
            <div className="Info">
                <h1> Gather Your Friends And Watch Videos!</h1>
                <p>Couch Time is a video sharing site to host and play videos to friends!</p>

                <div className="carousel">
                    <div className={`carousel-image-wrapper ${fade ? "fade-in" : "fade-out"} `}>
                        <img src={images[currentIndex]} alt={`Slide ${currentIndex}`} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home