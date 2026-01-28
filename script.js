const video = document.getElementById("camera");
const snapBtn = document.getElementById("snap");
const downloadBtn = document.getElementById("download");
const canvas = document.getElementById("canvas");
const photo = document.getElementById("photo");
const strip = document.getElementById("strip");
const filterSelect = document.getElementById("filter");
const switchCamBtn = document.getElementById("switchCam");
const countdownBtn = document.getElementById("countdown");

let stream;
let usingFront = true;

// camera
async function startCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: usingFront ? "user" : "environment" },
    audio: false
  });

  video.srcObject = stream;
}

startCamera().catch(() => alert("Camera denied. Use HTTPS and allow camera."));

switchCamBtn.addEventListener("click", () => {
  usingFront = !usingFront;
  startCamera();
});

// filters
filterSelect.addEventListener("change", () => {
  const filter = filterSelect.value;

  if (filter === "bw") video.style.filter = "grayscale(100%)";
  if (filter === "pink") video.style.filter = "hue-rotate(300deg) saturate(200%)";
  if (filter === "vhs") video.style.filter = "contrast(150%) saturate(150%) hue-rotate(-20deg)";
  if (filter === "none") video.style.filter = "none";
});

const frameSelect = document.getElementById("frameSelect");
const frameOverlay = document.querySelector(".frameOverlay");

frameSelect.addEventListener("change", () => {
  const frame = frameSelect.value;
  frameOverlay.className = "frameOverlay " + frame;
});

// countdown
countdownBtn.addEventListener("click", () => {
  let count = 3;
  countdownBtn.innerText = count;

  const interval = setInterval(() => {
    count--;
    countdownBtn.innerText = count;

    if (count === 0) {
      clearInterval(interval);
      countdownBtn.innerText = "3s Countdown";
      takePhoto();
    }
  }, 1000);
});

// take photo
function takePhoto() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");

  // add 4:3 frame by resizing canvas
  const targetWidth = 800;
  const targetHeight = 600;
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

  const dataUrl = canvas.toDataURL("image/png");
  photo.src = dataUrl;

  downloadBtn.disabled = false;
  downloadBtn.dataset.url = dataUrl;

  addToStrip(dataUrl);
}

// download
downloadBtn.addEventListener("click", () => {
  const url = downloadBtn.dataset.url;
  const a = document.createElement("a");
  a.href = url;
  a.download = "photobooth.png";
  a.click();
});

// photo strip
function addToStrip(url) {
  const img = document.createElement("img");
  img.src = url;
  img.className = "strip-photo";
  strip.prepend(img);
}