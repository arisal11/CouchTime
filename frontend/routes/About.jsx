function About() {
  return (
    <div className="about">
      <h1>About CouchTime</h1>
      <p>
        CouchTime turns any screen into a shared watch party. One person hosts a
        room on the TV, everyone else joins from their phone with a room code,
        and you all build a YouTube queue together. Videos play back-to-back on
        the big screen while the queue updates live for everyone.
      </p>
      <h2>How it works</h2>
      <ol className="about-steps">
        <li><strong>Host</strong> — open CouchTime on your TV and start a room.</li>
        <li><strong>Share</strong> — friends scan the QR code or type the room code.</li>
        <li><strong>Queue</strong> — everyone pastes YouTube links from their phone.</li>
        <li><strong>Watch</strong> — videos autoplay in order; anyone can skip.</li>
      </ol>
    </div>
  );
}

export default About;
