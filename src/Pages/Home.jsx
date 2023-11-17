import React, { useState } from "react";
import "./home.css";
import Screenrecoding from "../Component/Screenrecoding";

const Home = () => {
  const [shouldStop, setShouldTop] = useState(false);
  const [stopped, setStopped] = useState(false);

  const videoElement = document.getElementById("show-video");
  const downloadLink = document.getElementById("download");

  // Function to update the preview video element with the recorded video
  function updatePreview(videoBlob) {
    const recordedVideoElement = document.getElementById("show-video");
    recordedVideoElement.src = URL.createObjectURL(videoBlob);
  }

  function startRecord() {
    document.querySelectorAll(".btn-info").forEach(function (btn) {
      btn.disabled = true;
    });
    document.getElementById("stop").disabled = false;
    document.getElementById("download").style.display = "none";
  }

  function stopRecord() {
    document.querySelectorAll(".btn-info").forEach(function (btn) {
      btn.disabled = false;
    });
    document.getElementById("stop").disabled = true;
    document.getElementById("download").style.display = "block";
  }

  const audioRecordConstraints = {
    echoCancellation: true,
  };

  const stopRecording = () => {
    setShouldTop(true);
  };

  const handleRecord = function ({ stream, mimeType }) {
    startRecord();
    let recordedChunks = [];
    // stopped = false;
    setStopped(false);
    document.getElementById("show-video").style.visibility = "visible";
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }

      if (shouldStop === true && stopped === false) {
        mediaRecorder.stop();
        // stopped = true;
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
      //   videoElement.srcObject = null;

      // Display recorded video in the preview screen
      updatePreview(blob);
    };

    mediaRecorder.start(200);
  };

  // Record Audio
  const recordAudio = async () => {
    const mimeType = "audio/webm";
    //   shouldStop = false;
    setShouldTop(false);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: audioRecordConstraints,
    });
    handleRecord({ stream, mimeType });
  };

  // Record Vedio
  const recordVideo = async () => {
    const mimeType = "video/webm";
    setShouldTop(false);
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
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log(stream);
    videoElement.srcObject = stream;
    handleRecord({ stream, mimeType });
  };

  // Record Screen
  const recordScreen = async () => {
    const mimeType = "video/webm";
    // shouldStop = false;
    setShouldTop(false);
    const constraints = {
      video: {
        cursor: "motion",
      },
    };

    if (!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)) {
      return window.alert("Screen Record not supported!");
    }

    let stream = null;
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: { cursor: "motion" },
      audio: { echoCancellation: true },
    });

    if (window.confirm("Record audio with screen?")) {
      const audioContext = new AudioContext();

      const voiceStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true },
        video: false,
      });
      const userAudio = audioContext.createMediaStreamSource(voiceStream);

      const audioDestination = audioContext.createMediaStreamDestination();
      userAudio.connect(audioDestination);

      if (displayStream.getAudioTracks().length > 0) {
        const displayAudio =
          audioContext.createMediaStreamSource(displayStream);
        displayAudio.connect(audioDestination);
      }

      const tracks = [
        ...displayStream.getVideoTracks(),
        ...audioDestination.stream.getTracks(),
      ];
      stream = new MediaStream(tracks);
      handleRecord({ stream, mimeType });
    } else {
      stream = displayStream;
      handleRecord({ stream, mimeType });
    }
    console.log(stream);
    videoElement.srcObject = stream;
  };

  //upload video

  function openFileUpload() {
    document.getElementById("uploadVideo").click();
  }

  function handleUploadedVideo(event) {
    const videoElement = document.getElementById("show-video");
    const fileInput = event.target;

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];

      if (file.type.startsWith("video/")) {
        const videoURL = URL.createObjectURL(file);
        videoElement.src = videoURL;
        videoElement.controls = true;
      } else {
        alert("Please select a valid video file.");
      }
    }
  }

  return (
    <div className="container mt-3">
      <span>
        <a id="download" style={{ display: "none" }}>
          <button type="button" className="btn btn-primary mb-4">
            Download
          </button>
        </a>
      </span>
      <button
        type="button"
        onClick={stopRecording}
        className="btn btn-danger"
        id="stop"
        disabled
      >
        Stop
      </button>
      <button type="button" onClick={recordAudio} className="btn btn-info">
        Record Audio
      </button>
      <button type="button" onClick={recordVideo} className="btn btn-info">
        Show Camera
      </button>
      <button type="button" onClick={recordScreen} className="btn btn-info">
        Record Screen
      </button>

      <div className="p-5">
        <video
          id="show-video"
          autoPlay
          height="480"
          width="640"
          controls
          download
        ></video>
      </div>
      <input
        type="file"
        id="uploadVideo"
        accept="video/*"
        style={{ display: "none" }}
        onChange={handleUploadedVideo}
      />
      <button
        type="button"
        onClick={openFileUpload}
        className="btn btn-upload btn-info"
      >
        Upload Video
      </button>
    </div>
  );
};

export default Home;
