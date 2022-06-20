import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import * as webrtc from 'wrtc';

@Injectable()
export class AppService {
  senderStream: any;

  handleTrackEvent(e, peer) {
    this.senderStream = e.streams[0];
  }

  async consume({ body }: Request) {
    const peer = new webrtc.RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.stunprotocol.org',
        },
      ],
    });

    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    this.senderStream
      .getTracks()
      .forEach((track) => peer.addTrack(track, this.senderStream));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
      sdp: peer.localDescription,
    };

    return payload;
  }

  async broadcast({ body }: Request) {
    const peer = new webrtc.RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.stunprotocol.org',
        },
      ],
    });

    peer.ontrack = (e) => this.handleTrackEvent(e, peer);
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
      sdp: peer.localDescription,
    };

    return payload;
  }
}
