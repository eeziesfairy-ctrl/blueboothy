const video = document.getElementById("camera");
const button = document.getElementById("snap");
const canvas = document.getElementById("canvas");
const photo = document.getElementById("photo");

// Open camera
navigator.mediaDevices.getUserMedia({
  video: { facingMode: "user" }, // front camera
  audio: false
})
.then(stream => {
  video.srcObject = stream;
})
.catch(err => {
  alert("Camera access denied 😢");
});

// Take photo
button.addEventListener("click", () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  const imageData = canvas.toDataURL("image/png");
  photo.src = imageData;
});