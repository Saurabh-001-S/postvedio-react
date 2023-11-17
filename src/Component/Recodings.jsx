import React, { useEffect, useRef, useState } from "react";

const Recordings = () => {
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordingStopped, setRecordingStopped] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const handleStopRecording = async () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setRecordingStopped(true);
    }
  };

  const handleDownload = () => {
    const blob = new Blob(recordedChunks, { type: "video/mp4" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "recording.webm";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const updatePreview = async (videoBlob) => {
    console.log(videoBlob);
    const recordedVideoElement = videoRef.current;
    recordedVideoElement.src = URL.createObjectURL(videoBlob);
    await recordedVideoElement.play(); // Ensure that the video starts playing after updating the source
  };

  const handleStartRecording = async () => {
    setRecording(true);
    setRecordingStopped(false);
    setRecordedChunks([]);

    const mimeType = "video/webm";

    const constraints = {
      audio: {
        echoCancellation: true,
      },
      video: {
        width: {
          min: 640,
          max: 1024,
        },
        height: {
          min: 480,
          max: 768,
        },
      },
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      let chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Create a Blob from accumulated chunks
        const blob = new Blob(chunks, { type: mimeType });

        // Display recorded video in the preview screen
        updatePreview(blob);
      };

      mediaRecorder.start(200);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  useEffect(() => {
    videoRef.current = document.getElementById("show-video");
  }, []);

  return (
    <div>
      <video id="show-video" autoPlay width="640" height="480" controls></video>
      {recording ? (
        <button onClick={handleStopRecording}>Stop Recording</button>
      ) : (
        <button onClick={handleStartRecording}>Start Recording</button>
      )}
      {recordingStopped && <button onClick={handleDownload}>Download</button>}
    </div>
  );
};

export default Recordings;
