const socket = io();

let roomId = "";

// CAMERA SETUP
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const countdownEl = document.getElementById("countdown");

// Start camera
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
  video.srcObject = stream;
})
.catch(err => {
  alert("Camera access denied or not supported.");
});

// JOIN ROOM
function joinRoom() {
  roomId = document.getElementById("roomInput").value;

  if (!roomId) {
    alert("Enter a room code");
    return;
  }

  socket.emit("join-room", roomId);

  alert("Joined room: " + roomId);
}

// START COUNTDOWN
function startCountdown() {
  if (!roomId) {
    alert("Join a room first");
    return;
  }

  socket.emit("start-countdown", roomId);
}

// RECEIVE COUNTDOWN FROM SERVER
socket.on("countdown-start", () => {
  let count = 3;
  countdownEl.innerText = count;

  const timer = setInterval(() => {
    count--;

    if (count > 0) {
      countdownEl.innerText = count;
    } else {
      clearInterval(timer);
      countdownEl.innerText = "📸";
      takePhoto();
    }
  }, 1000);
});

// TAKE PHOTO
function takePhoto() {
  const ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0);

  const img = document.createElement("img");
  img.src = canvas.toDataURL("image/png");

  document.getElementById("photos").appendChild(img);
}