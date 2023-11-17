let shouldStop = false;
let stopped = false;
const recordAudioElement = document.getElementById("record-audio");
const recordVideoElement = document.getElementById("record-video");
const recordScreenElement = document.getElementById("record-screen");
const videoElement = document.getElementById("show-video");
const videoElement2 = document.getElementById("show-video2");
const downloadLink = document.getElementById("download");
const stopButton = document.getElementById("stop");
var recordedStreamFile = null;
let screenrecord = false;
let vedioRecoding = false;
let screenRecoding = false;

recordAudioElement.addEventListener("click", recordAudio);
recordVideoElement.addEventListener("click", recordVideo);
recordScreenElement.addEventListener("click", recordScreen);
stopButton.addEventListener("click", function () {
  shouldStop = true;
});

function handleFileUpload(data) {
  var xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;
  function updateProgress(e) {
    if (e.lengthComputable) {
      console.log(e.loaded);
      console.log(e.loaded + " / " + e.total);
    }
  }

  swal({
    title: "0%",
    text: "Video uploading please wait.",
    icon: "info",
    buttons: false,
    closeOnEsc: false,
    closeOnClickOutside: false,
  });

  xhr.upload.addEventListener("progress", updateProgress, false);
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      $("body").append(this.content);
      if (this.status == 200) {
        swal({
          title: "Good job!",
          text: "Video submitted successfully!",
          icon: "success",
        });
      } else {
        swal({
          title: "Error Try Again",
          text: "Sorry, there is an error please try again later.",
          icon: "error",
          buttons: [true, "Retry"],
        }).then((retry) => {
          if (retry) {
            if ($("#upload")) {
              $("#upload").submit();
            }
          }
        });
      }
    }
  });
  xhr.open("POST", "https://api.dreampotential.org/storage/video-upload/");
  //xhr.setRequestHeader(
  //  "Authorization",
  //  "Token " + localStorage.getItem("session_id")
  //);
  xhr.send(data);
}

// Function to update the preview video element with the recorded video
function updatePreview(videoBlob, fileName) {
  if (screenrecord) {
    const recordedVideoElement = document.getElementById("show-video");
    recordedVideoElement.style.visibility = "visible";
    recordedVideoElement.src = URL.createObjectURL(videoBlob);
    const newFile = new File([videoBlob], fileName, { type: "video/webm" });
    recordedStreamFile = newFile;
    console.log(screenrecord);
  }
}

// =========================

function init() {
  $("#upload").on("change", function (e) {
    e.preventDefault();

    var file = e.target.files[0];
    GLOBAL_FILE = file;
    $("#upload_vid_form").submit();
    console.log(swal);
  });

  $("#submit").click(function (e) {
    e.preventDefault();
    var data = new FormData();
    data.append("video", GLOBAL_FILE);
    data.append("source", window.location.host);
    alert("Submit");
    handleFileUpload(data);
  });
}
window.addEventListener("DOMContentLoaded", init, false);

// =========================

function startRecord() {
  // $(".btn-info").prop("disabled", true);
  $("#stop").prop("disabled", false);
  $("#download").css("display", "none");
}

function stopRecord() {
  $(".btn-info").prop("disabled", false);
  $("#stop").prop("disabled", true);
  $("#download").css("display", "block");
}

const audioRecordConstraints = {
  echoCancellation: true,
};

const changeButton = (iconButton) => {
  console.log(iconButton);
  iconButton.textContent = "Stop";
};

const handleRecordVedio = function ({ stream, mimeType }) {
  startRecord();
  let recordedChunks = [];
  stopped = false;
  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = function (e) {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
    if (shouldStop === true && stopped === false) {
      mediaRecorder.stop();
      stopped = true;
    }
  };

  mediaRecorder.onstop = function () {
    const blob = new Blob(recordedChunks, {
      type: mimeType,
    });
    recordedChunks = [];
    const currentDate = new Date();
    const filename = currentDate.toString();
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${filename || "recording"}.webm`;
    stopRecord();
    videoElement2.srcObject = null;

    // Display recorded video in the preview screen
    updatePreview(blob, `${filename || "recording"}.webm`);
  };

  mediaRecorder.start(200);
};
const handleRecordScreen = function ({ stream, mimeType }) {
  startRecord();
  let recordedChunks = [];
  // const recordedWebcamChunks = [];
  // const recordedScreenChunks = [];
  stopped = false;
  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = function (e) {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
    if (shouldStop === true && stopped === false) {
      mediaRecorder.stop();
      stopped = true;
    }
  };

  mediaRecorder.onstop = function () {
    const blob = new Blob(recordedChunks, {
      type: mimeType,
    });
    recordedChunks = [];
    const currentDate = new Date();
    const filename = currentDate.toString();
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${filename || "recording"}.webm`;
    stopRecord();
    videoElement2.srcObject = null;

    // Display recorded video in the preview screen
    updatePreview(blob, `${filename || "recording"}.webm`);
  };

  mediaRecorder.start(200);
};

async function recordAudio() {
  const mimeType = "audio/webm";
  shouldStop = false;
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: audioRecordConstraints,
  });
  handleRecordVedio({ stream, mimeType });
}

async function recordVideo() {
  if (screenrecord === false) {
    screenrecord = true;
    console.log("recondVedio if", screenrecord);
    videoElement.style.visibility = "visible";
    const mimeType = "video/webm";
    shouldStop = false;
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
    videoElement.srcObject = stream;
    changeButton(recordVideoElement);
    handleRecordVedio({ stream, mimeType });
    vedioRecoding = true;
  }
}

async function recordScreen() {
  const mimeType = "video/webm";
  shouldStop = false;
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
  if (true) {
    const audioContext = new AudioContext();

    const voiceStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true },
      video: false,
    });
    const userAudio = audioContext.createMediaStreamSource(voiceStream);

    const audioDestination = audioContext.createMediaStreamDestination();
    userAudio.connect(audioDestination);

    if (displayStream.getAudioTracks().length > 0) {
      const displayAudio = audioContext.createMediaStreamSource(displayStream);
      displayAudio.connect(audioDestination);
    }

    const tracks = [
      ...displayStream.getVideoTracks(),
      ...audioDestination.stream.getTracks(),
    ];
    stream = new MediaStream(tracks);
    screenRecoding = true;
    changeButton(recordScreenElement);
    handleRecordScreen({ stream, mimeType });
  } else {
    stream = displayStream;
    handleRecordScreen({ stream, mimeType });
  }
  if (screenrecord === false) {
    videoElement.srcObject = stream;
  } else {
    videoElement2.style.visibility = "visible";
    videoElement2.srcObject = stream;
  }
}

//upload video

function openFileUpload() {
  console.log(recordedStreamFile);
  if (recordedStreamFile === null) return;
  const data = new FormData();
  data.append("video", recordedStreamFile);
  data.append("source", window.location.host);
  handleFileUpload(data);
  //   document.getElementById('uploadVideo').click();
}

function handleUploadedVideo(event) {
  const videoElement = document.getElementById("show-video");
  const fileInput = event.target;

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];

    if (file.type.startsWith("video/")) {
      const videoURL = URL.createObjectURL(file);
      console.log(videoURL);
      videoElement.src = videoURL;
      videoElement.controls = true;
    } else {
      alert("Please select a valid video file.");
    }
  }
}
