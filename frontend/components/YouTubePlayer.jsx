import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

// Loads the YouTube IFrame API once and resolves when it's ready.
let apiPromise = null;
function loadYouTubeAPI() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === "function") prev();
      resolve(window.YT);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

/**
 * Renders a YouTube player and keeps it pointed at `videoId`.
 * Exposes play()/pause() via ref, and fires onEnded / onStateChange.
 */
const YouTubePlayer = forwardRef(function YouTubePlayer(
  { videoId, onEnded, onStateChange },
  ref
) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const currentIdRef = useRef(null);
  // Keep the latest callbacks without re-creating the player.
  const endedRef = useRef(onEnded);
  const stateRef = useRef(onStateChange);
  endedRef.current = onEnded;
  stateRef.current = onStateChange;

  useImperativeHandle(ref, () => ({
    play: () => playerRef.current?.playVideo?.(),
    pause: () => playerRef.current?.pauseVideo?.(),
  }));

  useEffect(() => {
    let cancelled = false;

    loadYouTubeAPI().then((YT) => {
      if (cancelled || !containerRef.current || playerRef.current) return;

      playerRef.current = new YT.Player(containerRef.current, {
        width: "100%",
        height: "100%",
        videoId: videoId || undefined,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            currentIdRef.current = videoId;
            if (videoId) playerRef.current.loadVideoById(videoId);
          },
          onStateChange: (e) => {
            // 0 = ended, 1 = playing, 2 = paused
            if (e.data === window.YT.PlayerState.ENDED) endedRef.current?.();
            stateRef.current?.(e.data);
          },
        },
      });
    });

    return () => {
      cancelled = true;
    };
  }, []); // create once

  // React to the current video changing.
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !player.loadVideoById) return;
    if (videoId && videoId !== currentIdRef.current) {
      currentIdRef.current = videoId;
      player.loadVideoById(videoId);
    } else if (!videoId && currentIdRef.current) {
      currentIdRef.current = null;
      player.stopVideo?.();
    }
  }, [videoId]);

  return <div className="yt-mount" ref={containerRef} />;
});

export default YouTubePlayer;
