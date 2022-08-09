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
    reload: () => {
      let { room } = get()
      set({ room })
    },

    participants: [],
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

      window.addEventListener('beforeunload', () => room.disconnect())

      let add = (v) => {
        if (!v) {
          return
        }
        let { participants } = get()
        participants = [...participants]

        if (!participants.some((s) => s.identity === v.identity)) {
          participants.push(v)
        }
        set({ participants })
      }

      let dis = (v) => {
        let { participants } = get()
        participants = [...participants]

        participants.splice(
          participants.findIndex((s) => s.identity === v.identity),
          1
        )
        set({ participants })
      }

      room.participants.forEach((participant) => {
        if (participant) {
          add(participant)
        }
      })
      room.on('participantConnected', add)
      room.on('participantDisconnected', dis)

      set({ room })

      return () => {
        room.off('participantConnected', add)
        room.off('participantDisconnected', dis)
      }
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
