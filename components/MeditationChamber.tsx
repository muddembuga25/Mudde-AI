
import React, { useEffect, useState, useRef } from 'react';
import { BrainCircuit, Play, Pause, Volume2, Volume1, VolumeX, Activity, Zap, Loader2, Radio, Maximize2, Infinity } from 'lucide-react';
import { MEDITATION_VIDEO_ID } from '../constants';

// Add type definition for window.YT
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const MeditationChamber: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [alignment, setAlignment] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const playerRef = useRef<any>(null);
  
  // Initialize YouTube API
  useEffect(() => {
    // 1. Load the IFrame Player API code asynchronously.
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // 2. This function creates an <iframe> (and YouTube player) after the API code downloads.
    window.onYouTubeIframeAPIReady = () => {
        createPlayer();
    };

    // If API is already ready (e.g. re-mount)
    if (window.YT && window.YT.Player) {
        createPlayer();
    }

    return () => {
        // Cleanup if necessary
    };
  }, []);

  const createPlayer = () => {
      if (playerRef.current) return; // Already created

      playerRef.current = new window.YT.Player('meditation-player', {
          height: '100%',
          width: '100%',
          videoId: MEDITATION_VIDEO_ID,
          playerVars: {
              'playsinline': 1,
              'controls': 0, // We use custom controls for the aesthetic, but the underlying engine is standard
              'disablekb': 1,
              'fs': 0,
              'rel': 0,
              'modestbranding': 1,
              'iv_load_policy': 3,
              'loop': 1,
              'playlist': MEDITATION_VIDEO_ID // Required for loop to work on single video
          },
          events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange,
              'onError': (e: any) => console.error("YT Error:", e)
          }
      });
  };

  const onPlayerReady = (event: any) => {
      setIsReady(true);
      event.target.setVolume(volume);
  };

  const onPlayerStateChange = (event: any) => {
      // YT.PlayerState.PLAYING = 1
      if (event.data === 1) {
          setIsPlaying(true);
      } else if (event.data === 2 || event.data === 0) { // PAUSED or ENDED
          setIsPlaying(false);
      }
  };

  // Simulated Alignment Progress
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
        interval = setInterval(() => {
            setAlignment(prev => {
                const next = prev + 0.1;
                return next > 100 ? 100 : next;
            });
        }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!playerRef.current || !isReady) return;
    
    if (isPlaying) {
        playerRef.current.pauseVideo();
    } else {
        if (playerRef.current.isMuted()) {
            playerRef.current.unMute();
        }
        playerRef.current.setVolume(volume);
        playerRef.current.playVideo();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVol = parseInt(e.target.value);
      setVolume(newVol);
      if (playerRef.current && isReady) {
          playerRef.current.setVolume(newVol);
      }
  };

  return (
    <div 
        className="flex flex-col h-full glass-panel rounded-sm relative overflow-hidden bg-black/80 border border-mudde-purple/30 shadow-[0_0_20px_rgba(189,0,255,0.05)] group transition-all duration-500 hover:border-mudde-purple/50 hover:shadow-[0_0_30px_rgba(189,0,255,0.15)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
        
        {/* Header */}
        <div className="relative z-20 flex items-center justify-between p-3 border-b border-gray-800/50 bg-black/80 backdrop-blur-md">
            <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded border transition-colors duration-500 ${isPlaying ? 'bg-mudde-purple/20 border-mudde-purple text-mudde-purple shadow-[0_0_10px_#bd00ff]' : 'bg-gray-900 border-gray-700 text-gray-500'}`}>
                    <BrainCircuit className="w-4 h-4" />
                </div>
                <div>
                    <h2 className="text-[10px] font-bold text-white tracking-[0.2em] font-sans uppercase flex items-center gap-2">
                        Neural_Align_Engine
                        {isPlaying && <span className="text-[7px] bg-mudde-purple/20 text-mudde-purple px-1 rounded animate-pulse">ACTIVE</span>}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-mudde-purple animate-ping' : isReady ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                        <span className={`text-[7px] font-mono font-bold uppercase ${isPlaying ? 'text-mudde-purple' : 'text-gray-500'}`}>
                            {isPlaying ? 'RE-CALIBRATING_REALITY...' : isReady ? 'PROTOCOL_READY' : 'BUFFERING_FEED...'}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col items-end">
                 <div className="flex items-center gap-1 text-[8px] font-mono text-gray-400">
                    <Infinity className={`w-3 h-3 ${isPlaying ? 'text-mudde-gold animate-spin-slow' : 'text-gray-600'}`} />
                    <span>SYNC: {alignment.toFixed(1)}%</span>
                 </div>
            </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 relative bg-black group/video overflow-hidden">
            {/* YouTube Iframe Container */}
            <div className="absolute inset-0 z-0">
                 <div id="meditation-player" className="w-full h-full pointer-events-none"></div>
            </div>
            
            {/* CRT/Scanline Overlay Effect - Fades out when playing for clarity */}
            <div className={`absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] transition-opacity duration-700 ${isPlaying ? 'opacity-5' : 'opacity-20'}`}></div>
            
            {/* Vignette - Fades out significantly when playing */}
            <div className={`absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,black_100%)] transition-opacity duration-700 ${isPlaying ? 'opacity-20' : 'opacity-60'}`}></div>

            {/* Play/Pause Overlay - Visible on hover or when paused */}
            <div 
                className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-300 cursor-pointer ${isPlaying && !isHovered ? 'opacity-0' : 'opacity-100 bg-black/20 backdrop-blur-[2px]'}`}
                onClick={togglePlay}
            >
                 <div className={`
                    w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300
                    ${!isReady 
                        ? 'border-gray-700 text-gray-700' 
                        : isPlaying 
                            ? 'border-white/20 text-white bg-black/60 scale-90 hover:scale-100 hover:bg-mudde-purple/20' 
                            : 'border-mudde-purple text-mudde-purple bg-mudde-purple/10 shadow-[0_0_30px_rgba(189,0,255,0.4)] scale-110 hover:scale-125 hover:bg-mudde-purple/20'}
                 `}>
                    {!isReady ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                    ) : (
                        <Play className="w-6 h-6 fill-current ml-1" />
                    )}
                 </div>
            </div>

            {/* Top Right Info Overlay */}
            <div className="absolute top-2 right-2 z-20 flex flex-col items-end pointer-events-none">
                 <div className="bg-black/60 backdrop-blur border border-white/10 px-2 py-1 rounded text-[7px] font-mono text-white/70 flex items-center gap-1">
                    <Radio className={`w-2 h-2 ${isPlaying ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} /> LIVE_FEED
                 </div>
            </div>
        </div>

        {/* Control Footer */}
        <div className="p-3 bg-black/90 border-t border-gray-800 backdrop-blur-md relative z-20">
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => {
                        const newVol = volume === 0 ? 50 : 0;
                        setVolume(newVol);
                        if(playerRef.current) playerRef.current.setVolume(newVol);
                    }}
                    disabled={!isReady}
                    className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                    {volume === 0 ? <VolumeX className="w-4 h-4" /> : volume < 50 ? <Volume1 className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                
                <div className="flex-1 group/slider relative h-4 flex items-center cursor-pointer">
                     <div className="absolute left-0 right-0 h-1 bg-gray-800 rounded-full overflow-hidden">
                         <div className="h-full bg-mudde-purple transition-all duration-150" style={{ width: `${volume}%` }}></div>
                     </div>
                     <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={volume} 
                        onChange={handleVolumeChange}
                        disabled={!isReady}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                     <div 
                        className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white] pointer-events-none transition-all duration-150 opacity-0 group-hover/slider:opacity-100"
                        style={{ left: `${volume}%`, transform: 'translateX(-50%)' }}
                     ></div>
                </div>
                
                <span className="text-[9px] font-mono text-gray-500 w-8 text-right">{volume}%</span>
            </div>

            <div className="mt-2 flex justify-between items-center text-[7px] font-mono text-gray-600 uppercase border-t border-gray-800/50 pt-2">
                <span className="flex items-center gap-1">
                    <Zap className={`w-2 h-2 ${isPlaying ? 'text-mudde-gold animate-pulse' : 'text-gray-600'}`} /> 
                    Signal: {isPlaying ? 'OPTIMIZED' : 'STANDBY'}
                </span>
                <span className="text-mudde-purple/50">CMD_ALIGN_PROTOCOL_V2</span>
            </div>
        </div>
    </div>
  );
};

export default MeditationChamber;
