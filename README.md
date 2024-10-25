# HexSeq

A web-based recreation of the Tombola sequencer from Teenage Engineering's OP-1 synthesizer.

## Overview

This project is heavily inspired by the OP-1's Tombola sequencer. The original sequencer, found in Teenage Engineering's OP-1 synthesizer, uses a rotating hexagon with balls bouncing inside to create unique musical sequences. This recreation brings that concept to the web, allowing for interactive experimentation with physics-based music generation.

## Usage

- Keyboard controls:
  - a-h: play high octave chords
  - z-n: play mid octave chords

Play some chords and experiment with the dials. Enjoy the unique sounds!

## Features

- **Physics-Based Sequencing**: Uses Rapier physics engine to simulate ball bounces and collisions
- **Interactive Controls**:
  - Adjust the gravity of the scene
  - Adjust rotation speed of the hexagonal drum
  - Modify the bounciness of the balls
  - Control the "openness" of the hexagon's sides
  - Volume controls for vinyl and rain sounds
- **Real-Time Sound Generation**: Triggers synthesizer sounds on collision events
- **Smooth Animations**: Fluid motion and transitions powered by React Three Fiber

## Stack

- React
- Next.js
- React Three Fibre
- Rapier
- Tone.js
- Hydra Synth (Background visuals)
