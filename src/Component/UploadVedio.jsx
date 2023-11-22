import React, { useState } from "react";

const UploadVideo = () => {
  const [recordedStreamFile, setRecordedStreamFile] = useState(null);

  const handleUploadedVideo = async (event) => {
    const videoElement = document.getElementById("show-video");
    const fileInput = event.target;

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];

      if (file.type.startsWith("video/")) {
        const videoURL = URL.createObjectURL(file);
        console.log(videoURL);
        videoElement.src = videoURL;
        videoElement.controls = true;
        setRecordedStreamFile(file);

        try {
          const formData = new FormData();
          formData.append("video", file);
          formData.append("source", window.location.host);

          const response = await fetch(
            "https://api.dreampotential.org/storage/video-upload/",
            {
              method: "POST",
              // headers: {
              //   "Authorization": "Token " + localStorage.getItem("session_id"),
              // },
              body: formData,
            }
          )
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error("Failed to upload video");
              }
            })
            .then((data) => {
              console.log("Video uploaded successfully");
              console.log(data);
            });
        } catch (error) {
          console.error("Error uploading video:", error);
        }
      } else {
        alert("Please select a valid video file.");
      }
    }
  };

  return (
    <div>
      <video
        id="show-video"
        width="500"
        height="350"
        controls
        style={{ display: `${recordedStreamFile === null ? "none" : "flex"}` }}
      />
      <input
        type="file"
        id="uploadVideo"
        accept="video/*"
        style={{ display: "none" }}
        onChange={handleUploadedVideo}
      />
      <label htmlFor="uploadVideo" className="btn btn-upload btn-info">
        Upload Video
      </label>
    </div>
  );
};

export default UploadVideo;
