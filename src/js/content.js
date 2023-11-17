document.getElementById("upload").addEventListener("change", function (e) {
  e.preventDefault();
  var file = e.target.files[0];
  window.GLOBAL_FILE = file;
  document.getElementById("upload_vid_form").submit();
  console.log({
    title: "0%",
    text: "Video uploading please wait.",
    icon: "info",
    buttons: false,
    closeOnEsc: false,
    closeOnClickOutside: false,
  });
});

document.getElementById("submit").addEventListener("click", function (e) {
  e.preventDefault();
  var data = new FormData();
  data.append("video", window.GLOBAL_FILE, window.GLOBAL_FILE.name);
  data.append("source", window.location.host);
  alert("Submit");

  var xhr = new XMLHttpRequest();

  function updateProgress(e) {
    if (e.lengthComputable) {
      console.log(e.loaded);
      console.log(e.loaded + " / " + e.total);
    }
  }

  console.log({
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
      console.log(this);
      document.body.insertAdjacentHTML("beforeend", this.content);
      if (this.status == 200) {
        console.log({
          title: "Good job!",
          text: "Video submitted successfully!",
          icon: "success",
        });
      } else {
        console.log({
          title: "Error Try Again",
          text: "Sorry, there is an error please try again later.",
          icon: "error",
          buttons: [true, "Retry"],
        });
        // Note: You might want to handle the retry logic here
      }
    }
  });
  xhr.open("POST", "https://api.dreampotential.org/storage/video-upload/");
  // xhr.setRequestHeader("Authorization", "Token " + localStorage.getItem("session_id"));
  xhr.send(data);
});

window.addEventListener("DOMContentLoaded", init, false);
