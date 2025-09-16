import '../src/styles/main.css'

function Hero(){
    return (
        <>
        <main className='hero-main'>
            <div class="tv-setup">
                <div class="tv">
                <div class="tv-screen" id="tv-screen">
                <p>No video playing yet</p>
                </div>

                <div class="tv-leg left"></div>
                <div class="tv-leg right"></div>
                </div>
            </div>
            
            <div class="cabinet">
                <div class="cabinet-door left-door"></div>
                <div class="cabinet-door right-door"></div>
            </div>
        </main>
        </>
    );
}

export default Hero;