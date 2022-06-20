import axios from "axios";

async function init() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = document.querySelector("video");
  if (video) {
    video.srcObject = stream;
    const peer = createPeer();
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
  }
}

function createPeer() {
  const peer = new RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.stunprotocol.org",
      },
    ],
  });
  peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

  return peer;
}

async function handleNegotiationNeededEvent(peer: RTCPeerConnection) {
  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  const payload = {
    sdp: peer.localDescription,
  };

  const { data } = await axios.post("http://localhost:3001/broadcast", payload);
  const desc = new RTCSessionDescription(data.sdp);
  peer.setRemoteDescription(desc).catch((e) => console.log(e));
}

window.onload = () => {
  const btn = document.querySelector("button");

  if (btn) {
    btn.addEventListener("click", async () => {
      await init();
    });
  }
};
