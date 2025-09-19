import '../src/styles/main.css'

function Villian (){
    return (
        <>
         <div className="video-form">
            <label for="video-url" className="form-title">Send a Video</label>
            <div className="input-wrapper">
                <input 
                id="video-url" 
                type="text" 
                class="video-input" 
                placeholder="Paste YouTube link here..."
                />
                <button className="send-button">Send</button>
            </div>
        </div>
        </>
    );
}

export default Villian