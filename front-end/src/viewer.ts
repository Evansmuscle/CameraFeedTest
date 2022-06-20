import axios from "axios";

async function init() {
  const peer = createPeer();
  peer.addTransceiver("video", { direction: "recvonly" });
}

function createPeer() {
  const peer = new RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.stunprotocol.org",
      },
    ],
  });
  peer.ontrack = handleTrackEvent;
  peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

  return peer;
}

async function handleNegotiationNeededEvent(peer: RTCPeerConnection) {
  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  const payload = {
    sdp: peer.localDescription,
  };

  const { data } = await axios.post("http://localhost:3001/consumer", payload);
  const desc = new RTCSessionDescription(data.sdp);
  peer.setRemoteDescription(desc).catch((e) => console.log(e));
}

function handleTrackEvent(e: RTCTrackEvent) {
  const video = document.querySelector("video");

  if (video) {
    video.srcObject = e.streams[0];
  }
}

window.onload = () => {
  const btn = document.querySelector("button");

  if (btn) {
    btn.addEventListener("click", async () => {
      await init();
    });
  }
};
