import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./NoiseDetector.css"

function NoiseLevel() {
  const [noiseLevel, setNoiseLevel] = useState(0);

  useEffect(() => {
    let mediaStream = null;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        mediaStream = stream;
        const audioContext = new AudioContext();
        const sourceNode = audioContext.createMediaStreamSource(stream);
        const analyserNode = audioContext.createAnalyser();
        sourceNode.connect(analyserNode);
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const measureNoiseLevel = () => {
          analyserNode.getByteTimeDomainData(dataArray);
          const rms = calculateRMS(dataArray);
          const db = 20 * Math.log10(rms);
          setNoiseLevel(db.toFixed(2));
        };

        setInterval(measureNoiseLevel, 1000);
      })
      .catch((error) => console.error(error));

    return () => {
      mediaStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const calculateRMS = (data) => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i] ** 2;
    }
    const mean = sum / data.length;
    return Math.sqrt(mean);
  };

  return (
    <div>
      <h1>Noise Level: {noiseLevel} dB</h1>
    </div>
  );
}

export default NoiseLevel;
