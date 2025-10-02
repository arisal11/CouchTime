import '../src/styles/main.css'

function Hero(){
    return (
        <>
        <main className='hero-main'>
            <div className="tv-setup">
                <div className="tv">
                <div className="tv-screen" id="tv-screen">
                <p>No video playing yet</p>
                </div>

                <div className="tv-leg left"></div>
                <div className="tv-leg right"></div>
                </div>
            </div>
            
            <div className="cabinet">
                <div className="cabinet-door left-door"></div>
                <div className="cabinet-door right-door"></div>
            </div>
        </main>
        </>
    );
}

export default Hero;