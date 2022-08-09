import {
  connect,
  createLocalAudioTrack,
  createLocalVideoTrack,
} from 'twilio-video'
import create from 'zustand'

export const useTwilio = create((set, get) => {
  // return

  return {
    devices: [],
    getDevices: async function getInputDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices()

      set({ devices })
      return devices
    },

    room: false,
    connectRoom: async (roomName, token, audioDeviceID, videoDeviceID) => {
      // join the video room with the Access Token and the given room name
      const room = await connect(token, {
        room: roomName,
        video: {
          deviceId: videoDeviceID,
        },
        audio: {
          deviceId: audioDeviceID,
        },
      })

      set({ room })

      room.on('participantConnected', () => {
        set({ room })
      })
      room.on('participantDisconnected', () => {
        set({ room })
      })
      return room
    },
    getTokenByRoomName: async (roomName) => {
      console.log(roomName)

      // fetch an Access Token from the join-room route
      const response = await fetch('/api/twilio/video', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName: roomName,
          actionType: 'join-room',
          password: roomName,
        }),
      })
      const { token } = await response.json()

      console.log(token)

      return token
      //
    },
    //
    //
  }
})
