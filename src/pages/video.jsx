import { useState } from 'react'
import { useMemo } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import * as TwilioVideo from 'twilio-video'

export default function JoinRoom() {
  let refRoom = useRef()

  let join = async (roomName) => {
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
  }

  const joinVideoRoom = async (roomName, token) => {
    // join the video room with the Access Token and the given room name
    const room = await TwilioVideo.connect(token, {
      room: roomName,
      video: true,
    })
    return room
  }
  let [room, setRoom] = useState(false)
  let [roomParticipants, setParticiplants] = useState([])

  const handleConnectedParticipant = (participant) => {
    //

    setParticiplants((s) => {
      if (s.map((e) => e.identity).includes(participant.identity)) {
        return [...s]
      } else {
        return [...s, participant]
      }
    })
  }

  const handleDisconnectedParticipant = (participant) => {
    setParticiplants((s) => {
      if (s.map((e) => e.identity).includes(participant.identity)) {
        s.splice(
          s.findIndex((e) => e.identity === participant.identity),
          1
        )
        return [...s]
      } else {
        return [...s, participant]
      }
    })
  }

  useEffect(() => {
    if (!room) {
      return
    }
    handleConnectedParticipant(room.localParticipant)
    room.participants.forEach(handleConnectedParticipant)
    room.on('participantConnected', handleConnectedParticipant)
    room.on('participantDisconnected', handleDisconnectedParticipant)

    return () => {
      room.off('participantConnected', handleConnectedParticipant)
      room.off('participantDisconnected', handleDisconnectedParticipant)
    }
  }, [room])

  return (
    <div className='w-full h-full overflow-auto'>
      <input type='text' defaultValue={'my-1st-room'} ref={refRoom}></input>
      <button
        onClick={async () => {
          const roomName = refRoom.current.value

          let token = await join(roomName)

          let newRoom = await joinVideoRoom(roomName, token)

          console.log(newRoom)
          setRoom(newRoom)
        }}
      >
        join
      </button>

      {roomParticipants.map((p) => {
        return <Participant key={p.identity} participant={p}></Participant>
      })}
      {/* <pre>{JSON.stringify(roomParticipants, null, '  ')}</pre> */}
    </div>
  )
}

function toArray(map) {
  let arr = []

  let ent = map.entries()
  for (let [key, val] of ent) {
    val._id = key
    arr.push(val)
  }

  return arr
}

function Participant({ participant }) {
  return (
    <div>
      Person: {participant.identity}
      {toArray(participant.tracks).map((trackPublication) => {
        return (
          <TrackPublication
            key={trackPublication.trackSid}
            participant={participant}
            trackPublication={trackPublication}
          ></TrackPublication>
        )
      })}
      {/*  */} {/*  */}
      {/*  */}
      {/*  */}
    </div>
  )
}

function TrackPublication({ trackPublication, participant }) {
  let ref = useRef()
  useMemo(() => {
    if (!participant) {
      return
    }
    if (!trackPublication) {
      return
    }

    let dom = false
    let handleTrackPublication = (track) => {
      if (dom) {
        dom.remove()
      }
      dom = track.attach()
      console.log(track)

      let tt = setInterval(() => {
        if (ref.current) {
          clearInterval(tt)
          ref.current.appendChild(dom)
        }
      })
    }
    if (trackPublication.track) {
      handleTrackPublication(trackPublication.track)
    }
    participant.on('trackPublished', handleTrackPublication)

    return () => {
      if (dom) {
        dom.remove()
      }
      participant.off('trackPublished', handleTrackPublication)
    }
  }, [trackPublication, participant])

  return (
    <div>
      Track: {trackPublication.trackSid}
      <div ref={ref}></div>
    </div>
  )
}
