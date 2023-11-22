import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const AudioRecord = forwardRef((props, ref) => {
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordingStopped, setRecordingStopped] = useState(false);
  const audioRef = useRef(null);
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

  // Update Preview with recorded audio
  const updatePreview = async (audioBlob) => {
    const recordedAudioElement = audioRef.current;
    recordedAudioElement.src = URL.createObjectURL(audioBlob);
  };

  const handleStartRecording = async () => {
    setRecording(true);
    setRecordingStopped(false);
    setRecordedChunks([]);
    const mimeType = "audio/wav"; // Use the appropriate audio MIME type

    const constraints = {
      audio: {
        echoCancellation: true,
      },
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      audioRef.current.srcObject = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      let chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        setRecordedChunks(chunks); // Store chunks for download on stop recording
        const blob = new Blob(chunks, { type: mimeType });

        updatePreview(blob); // Display recorded audio in the preview

        audioRef.current.srcObject = null; // Reset audio preview after recording stops
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  useEffect(() => {
    audioRef.current = document.getElementById("show-audio");
  }, []);

  // Download Recorded Audio
  const handleDownload = () => {
    // Create a Promise to wait for the recorded Blob to be ready
    const blobPromise = new Promise((resolve) => {
      const mimeType = "audio/mp3"; // Use the appropriate audio MIME type
      const blob = new Blob(recordedChunks, { type: mimeType });
      resolve(blob);
    });

    // Handle the download when the Blob is ready
    blobPromise.then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "recording.mp3";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  useImperativeHandle(ref, () => ({
    Start() {
      handleStartRecording();
      console.log("Start audio");
    },
    Stop() {
      handleStopRecording();
      console.log("Stop audio");
    },
  }));
  return (
    <div className="video-section audio">
      <audio id="show-audio" autoPlay controls></audio>
      {recordingStopped && (
        <button
          onClick={handleDownload}
          style={{ background: "transparent", border: "none" }}
        >
          <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d62828ff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 17V3" />
            <path d="m6 11 6 6 6-6" />
            <path d="M19 21H5" />
          </svg>
        </button>
      )}
    </div>
  );
});

export default AudioRecord;
