"""Recreate the original gentle instrumental included with this invitation.
Requires Python, numpy and ffmpeg. No downloaded/commercial recording is used.
Run from the project root: python scripts/create_music.py
"""
import math
import subprocess
import tempfile
import wave
from pathlib import Path
import numpy as np

SR = 44100
BEAT = 60 / 72
BARS = 16
DURATION = BARS * 4 * BEAT + 5
music = np.zeros((int(DURATION * SR), 2), dtype=np.float64)
rng = np.random.default_rng(27)

def piano(midi, start, duration=3.2, velocity=.15, pan=0):
    t = np.arange(int(duration * SR)) / SR
    freq = 440 * 2 ** ((midi - 69) / 12)
    wave_note = np.zeros_like(t)
    # Soft felt-piano partials, with progressively shorter high harmonics.
    for harmonic, strength in [(1,1), (2,.27), (3,.13), (4,.055), (5,.025), (6,.012)]:
        decay = np.exp(-t * (1.15 + harmonic * .39))
        wave_note += strength * np.sin(2 * math.pi * freq * harmonic * t + .0003*harmonic*t) * decay
    wave_note *= (1 - np.exp(-t * 85)) * np.minimum(1, (duration-t) * 8) * velocity
    offset = int(start * SR)
    length = min(len(wave_note), len(music) - offset)
    if length <= 0: return
    music[offset:offset+length,0] += wave_note[:length] * math.sqrt((1-pan)/2)
    music[offset:offset+length,1] += wave_note[:length] * math.sqrt((1+pan)/2)

chords = [[48,55,60,64,67,71],[45,52,57,60,64,67],[41,48,53,57,60,64],[43,50,55,59,62,67]]
melody = [[76,79,81,79],[76,72,76,74],[72,76,77,76],[74,71,74,79],
          [79,76,74,72],[76,79,76,72],[77,76,72,69],[71,74,72,None]]
for bar in range(BARS):
    start = .2 + bar * 4 * BEAT
    chord = chords[bar % 4]
    piano(chord[0],start,5,.11,-.15)
    for j, index in enumerate([1,2,3,4,2,3,4,5]):
        piano(chord[index],start+j*BEAT/2+rng.uniform(-.009,.009),3.4,.07 + rng.uniform(-.006,.006),-.35+j*.08)
    for j, note in enumerate(melody[bar % 8]):
        if note is not None:
            piano(note,start+j*BEAT+.012,4,.105+(bar//8)*.008,.12)
# Light stereo room ambience, staying quiet behind conversation.
dry=music.copy()
for delay,gain in [(.113,.16),(.229,.12),(.347,.10),(.491,.08),(.673,.06)]:
    shift=int(delay*SR)
    music[shift:,0] += dry[:-shift,1]*gain
    music[shift:,1] += dry[:-shift,0]*gain
fade=int(2.4*SR)
music[:int(.08*SR)] *= np.linspace(0,1,int(.08*SR))[:,None]
music[-fade:] *= np.linspace(1,0,fade)[:,None]
music *= .78/max(.01,np.max(np.abs(music)))
audio=(np.tanh(music)*30000).astype(np.int16)
Path('public/music').mkdir(parents=True, exist_ok=True)
with tempfile.TemporaryDirectory() as tmp:
    wav=Path(tmp)/'our-moment.wav'
    with wave.open(str(wav),'wb') as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(audio.tobytes())
    subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(wav),'-codec:a','libmp3lame','-b:a','160k','-metadata','title=Our Moment','-metadata','artist=Mehr Invitation','public/music/our-moment.mp3'],check=True)
print(f'Original instrumental created: {DURATION:.1f} seconds')
