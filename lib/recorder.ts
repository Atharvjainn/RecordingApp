// lib/recorder.ts

let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: BlobPart[] = [];
let activeStream: MediaStream | null = null;

/**
 * START RECORDING
 */
export async function startRecording(options: {
  mode: "camera" | "screen" | "screen+camera";
  videoDeviceId?: string;
  audioDeviceId?: string;
}) {
  recordedChunks = [];

  let stream: MediaStream;

  // 🎥 CAMERA ONLY
  if (options.mode === "camera") {
    stream = await navigator.mediaDevices.getUserMedia({
      video: options.videoDeviceId
        ? { deviceId: { exact: options.videoDeviceId } }
        : true,
      audio: options.audioDeviceId
        ? { deviceId: { exact: options.audioDeviceId } }
        : true,
    });
  }

  // 🖥 SCREEN ONLY
  else if (options.mode === "screen") {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
  }

  // 🖥 + 🎥 SCREEN + CAMERA
  else {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    const cameraStream = await navigator.mediaDevices.getUserMedia({
      video: options.videoDeviceId
        ? { deviceId: { exact: options.videoDeviceId } }
        : true,
      audio: false,
    });

    stream = combineStreams(screenStream, cameraStream);
  }

  activeStream = stream;

  mediaRecorder = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=vp9",
  });

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.start();
}

/**
 * PAUSE RECORDING
 */
export async function pauseRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.pause();
  }
}

/**
 * RESUME RECORDING
 */
export async function resumeRecording() {
  if (mediaRecorder && mediaRecorder.state === "paused") {
    mediaRecorder.resume();
  }
}

/**
 * STOP RECORDING AND RETURN FILE
 */
export async function stopRecording(): Promise<File> {
  if (!mediaRecorder) {
    throw new Error("No active recording");
  }

  await new Promise<void>((resolve) => {
    mediaRecorder!.onstop = () => resolve();
    mediaRecorder!.stop();
  });

  const blob = new Blob(recordedChunks, { type: "video/webm" });
  const file = new File([blob], "recording.webm", { type: "video/webm" });

  cleanup();
  return file;
}

/**
 * CLEANUP STREAMS
 */
function cleanup() {
  activeStream?.getTracks().forEach(track => track.stop());
  activeStream = null;
  mediaRecorder = null;
  recordedChunks = [];
}

/**
 * COMBINE SCREEN + CAMERA USING CANVAS
 */
function combineStreams(
  screenStream: MediaStream,
  cameraStream: MediaStream
): MediaStream {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;

  const ctx = canvas.getContext("2d")!;

  const screenVideo = document.createElement("video");
  screenVideo.srcObject = screenStream;
  screenVideo.play();

  const camVideo = document.createElement("video");
  camVideo.srcObject = cameraStream;
  camVideo.play();

  function draw() {
    ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(camVideo, canvas.width - 320, canvas.height - 240, 300, 220);
    requestAnimationFrame(draw);
  }

  draw();

  const canvasStream = canvas.captureStream(30);

  // Attach system audio (from screen)
  screenStream.getAudioTracks().forEach(track =>
    canvasStream.addTrack(track)
  );

  return canvasStream;
}
