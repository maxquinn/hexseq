import { lerp } from "@/app/_utils/lerp";
import { useState, useEffect, useCallback, useRef } from "react";
import { Player, Volume, start as startAudio } from "tone";

interface AudioPlayerOptions {
  audioUrl: string;
  initialVolume?: number;
}

interface AudioPlayerState {
  isLoading: boolean;
  isPlaying: boolean;
  error: string | null;
}

interface AudioPlayerControls {
  start: () => Promise<void>;
  stop: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  state: AudioPlayerState;
}

function useAudioPlayer(options: AudioPlayerOptions): AudioPlayerControls {
  const { audioUrl, initialVolume = 0 } = options;
  const [displayVolume, setDisplayVolume] = useState<number>(initialVolume);

  const [state, setState] = useState<AudioPlayerState>({
    isLoading: true,
    isPlaying: false,
    error: null,
  });

  const playerRef = useRef<Player | null>(null);
  const volumeRef = useRef<Volume | null>(null);

  const initializeNodes = useCallback(async () => {
    try {
      playerRef.current = new Player({
        url: audioUrl,
        loop: true,
        onload: () => {
          setState((prev) => ({ ...prev, isLoading: false }));
        },
        onerror: (error) => {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: error.message,
          }));
        },
      });

      volumeRef.current = new Volume(initialVolume);

      playerRef.current.connect(volumeRef.current);
      volumeRef.current.toDestination();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to initialize audio",
      }));
    }
  }, [audioUrl, initialVolume]);

  useEffect(() => {
    initializeNodes().catch((error) => {
      console.error("Error initializing audio player:", error);
    });

    return () => {
      if (playerRef.current) {
        if (playerRef.current.state === "started") {
          playerRef.current.stop();
        }
        playerRef.current.dispose();
      }
      if (volumeRef.current) {
        volumeRef.current.dispose();
      }
    };
  }, [initializeNodes]);

  const start = async () => {
    await startAudio();

    try {
      if (!playerRef.current || state.error) return;

      playerRef.current.start();
      setState((prev) => ({ ...prev, isPlaying: true }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Failed to start playback",
      }));
    }
  };

  const stop = () => {
    if (playerRef.current) {
      playerRef.current.stop();
      setState((prev) => ({ ...prev, isPlaying: false }));
    }
  };

  useEffect(() => {
    if (volumeRef.current) {
      const newVolume = lerp(0, 25, displayVolume);
      volumeRef.current.volume.value = newVolume;
    }
  }, [displayVolume]);

  return {
    start,
    stop,
    volume: displayVolume,
    setVolume: setDisplayVolume,
    state,
  };
}

export { useAudioPlayer };
