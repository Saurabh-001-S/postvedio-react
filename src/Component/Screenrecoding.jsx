import React, { useEffect, useRef, useState } from "react";

const Screenrecoding = () => {
  const [shouldStop, setShouldTop] = useState(false);
  const [stopped, setStopped] = useState(false);

  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const videoRef = useRef(null);

  const handleStopRecording = () => {
    setRecording(false);
    setShouldTop(true);
  };

  function updatePreview(videoBlob) {
    const recordedVideoElement = document.getElementById("show-video");
    recordedVideoElement.src = URL.createObjectURL(videoBlob);
  }

  const handleStartRecording = async () => {
    setRecording(true);
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
      console.log(stream);
      videoRef.current.srcObject = stream;
      handleRecord({ stream, mimeType });
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const handleRecord = function ({ stream, mimeType }) {
    let recordedChunks = [];
    setStopped(false);
    document.getElementById("show-video").style.visibility = "visible";
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }

      if (shouldStop === true && stopped === false) {
        mediaRecorder.stop();
        setStopped(true);
      }
    };

    mediaRecorder.onstop = function () {
      const blob = new Blob(recordedChunks, {
        type: mimeType,
      });
      recordedChunks = [];
      const filename = window.prompt("Enter file name");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `${filename || "recording"}.webm`;
      stopRecord();

      // Display recorded video in the preview screen
      updatePreview(blob);
    };

    mediaRecorder.start(200);
  };

  const handleDownload = () => {
    // Implement your download logic here
  };
  useEffect(() => {
    videoRef.current = document.getElementById("show-video");
  }, []);

  return (
    <div>
      <video
        id="show-video"
        autoPlay
        height="480"
        width="640"
        controls
        download
      ></video>
      {recording ? (
        <button onClick={handleStopRecording}>Stop Recording</button>
      ) : (
        <button onClick={handleStartRecording}>Start Recording</button>
      )}
      {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download Video</button>
      )}
    </div>
  );
};

export default Screenrecoding;

// import Webcam from "react-webcam";
// import Recorder from "media-recorder-js";

//  const webcamRef = useRef(null);
//  const [recording, setRecording] = useState(false);
//  const [recordedChunks, setRecordedChunks] = useState([]);

//  const handleStartRecording = () => {
//    setRecording(true);
//    setRecordedChunks([]);
//  };

//  const handleStopRecording = () => {
//    setRecording(false);
//  };

//  const handleDownload = () => {
//    const blob = new Blob(recordedChunks, { type: "video/webm" });
//    const url = URL.createObjectURL(blob);
//    const a = document.createElement("a");
//    document.body.appendChild(a);
//    a.style = "display: none";
//    a.href = url;
//    a.download = "recorded-video.webm";
//    a.click();
//    window.URL.revokeObjectURL(url);
//  };

//  const handleDataAvailable = (event) => {
//    if (event.data.size > 0) {
//      setRecordedChunks((prev) => [...prev, event.data]);
//    }
//  };

//  const videoConstraints = {
//    width: 1280,
//    height: 720,
//    facingMode: "user",
//  };
