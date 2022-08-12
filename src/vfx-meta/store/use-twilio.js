import { getID } from '@/vfx-runtime/ENUtils'
import { AudioListener, PositionalAudio } from 'three'
import {
  connect,
  LocalVideoTrack,
  // createLocalAudioTrack,
  // createLocalVideoTrack,
} from 'twilio-video'
import create from 'zustand'

export const useTwilio = create((set, get) => {
  // return

  return {
    listener: false,
    setListener: () => {
      let listener = new AudioListener()
      set({ listener })
    },
    // makePositionalAudio: (listener, mesh, buffer) => {
    //   const sound = new PositionalAudio(listener)

    //   sound.setBuffer(buffer)
    //   sound.setRefDistance(20)
    //   sound.play()

    //   mesh.add(sound)
    //   return sound
    // },

    devices: [],
    getDevices: async function getInputDevices() {
      set({ room: false })
      set({ devices: [] })

      const devices = await navigator.mediaDevices.enumerateDevices()

      set({ devices })
      return devices
    },

    room: false,
    reload: () => {
      let { room } = get()
      set({ room })
    },
    myself: false,
    participants: [],
    token: false,
    setToken: (v) => {
      set({ token: v })
    },
    checkSupportScreenShare: () => {
      return 'getDisplayMedia' in window?.navigator?.mediaDevices
    },
    screenShare: () => {
      let { room, checkSupportScreenShare } = get()

      if (checkSupportScreenShare()) {
        navigator.mediaDevices
          .getDisplayMedia()
          .then((stream) => {
            let screenTrack = new LocalVideoTrack(stream.getTracks()[0])
            room.localParticipant.publishTrack(screenTrack)
          })
          .catch((v) => {
            console.log('Could not share the screen.', v)
          })
      } else {
        console.log('No support for screenshare api')
      }
    },
    connectRoom: async (roomName, token, audioDeviceID, videoDeviceID) => {
      // join the video room with the Access Token and the given room name
      const room = await connect(token, {
        room: roomName,
        video: {
          width: 320,
          deviceId: videoDeviceID,
        },
        audio: {
          deviceId: audioDeviceID,
        },
      })

      console.log(room)

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

        set({ room })
      }

      let dis = (v) => {
        let { participants } = get()
        participants = [...participants]

        participants.splice(
          participants.findIndex((s) => s.identity === v.identity),
          1
        )
        set({ participants })
        set({ room })
      }

      room.participants.forEach((participant) => {
        if (participant) {
          add(participant)
        }
      })
      room.on('participantConnected', add)
      room.on('participantDisconnected', dis)

      set({ room, myself: room.localParticipant })

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
