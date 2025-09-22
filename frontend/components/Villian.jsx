function Villian() {
    return (
      <div className="video-form">
        <label htmlFor="video-url" className="form-title">
          Send a Video
        </label>
        <div className="input-wrapper">
          <input
            id="video-url"
            type="text"
            className="video-input" 
            placeholder="Paste YouTube link here..."
          />
          <button className="send-button">Send</button>
        </div>
      </div>
    );
  }
  
  export default Villian;
  