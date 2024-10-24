import { useState, useEffect, useCallback, useRef } from "react";
import * as Tone from "tone";

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
  setVolume: (volume: number) => void;
  state: AudioPlayerState;
}

export const useVinylSim = (
  options: AudioPlayerOptions,
): AudioPlayerControls => {
  const { audioUrl, initialVolume = 0 } = options;

  const [state, setState] = useState<AudioPlayerState>({
    isLoading: true,
    isPlaying: false,
    error: null,
  });

  // Refs for Tone.js nodes
  const playerRef = useRef<Tone.Player | null>(null);
  const volumeRef = useRef<Tone.Volume | null>(null);

  // Initialize audio nodes
  const initializeNodes = useCallback(async () => {
    try {
      // Initialize main player
      playerRef.current = new Tone.Player({
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

      // Initialize volume
      volumeRef.current = new Tone.Volume(initialVolume);

      // Connect nodes
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

  // Cleanup function
  const cleanup = useCallback(() => {
    if (playerRef.current) {
      if (playerRef.current.state === "started") {
        playerRef.current.stop();
      }
      playerRef.current.dispose();
    }
    if (volumeRef.current) {
      volumeRef.current.dispose();
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeNodes().catch((error) => {
      console.error("Error initializing audio player:", error);
    });
    return cleanup;
  }, [initializeNodes, cleanup]);

  // Start playback
  const start = async () => {
    try {
      await Tone.start();

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

  // Stop playback
  const stop = () => {
    if (playerRef.current) {
      playerRef.current.stop();
      setState((prev) => ({ ...prev, isPlaying: false }));
    }
  };

  // Set volume
  const setVolume = (volume: number) => {
    if (volumeRef.current) {
      volumeRef.current.volume.value = volume;
    }
  };

  return {
    start,
    stop,
    setVolume,
    state,
  };
};
