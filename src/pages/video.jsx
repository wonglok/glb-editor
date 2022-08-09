import { useTwilio } from '@/vfx-meta/store/use-twilio'
import { useEffect } from 'react'
import { useRef } from 'react'

function toArray(map) {
  let arr = []

  let ent = map.entries()
  for (let [key, val] of ent) {
    val._id = key
    arr.push(val)
  }

  return arr
}

export default function JoinRoom() {
  let getDevices = useTwilio((s) => s.getDevices)
  let devices = useTwilio((s) => s.devices)
  let getTokenByRoomName = useTwilio((s) => s.getTokenByRoomName)
  let connectRoom = useTwilio((s) => s.connectRoom)
  let room = useTwilio((s) => s.room)

  useEffect(() => {
    getDevices()
  }, [])

  let refR = useRef()
  let refA = useRef()
  let refV = useRef()
  return (
    <div>
      <div>
        <select onChange={() => {}} ref={refA}>
          {devices
            .filter((e) => {
              return e.kind === 'audioinput'
            })
            .sort((a, b) => {
              return (
                b.label.toLowerCase().indexOf('built') -
                a.label.toLowerCase().indexOf('built')
              )
            })
            .map((e) => {
              return (
                <option key={e.deviceId} value={e.deviceId}>
                  {e.label}
                </option>
              )
            })}
        </select>
        <select onChange={() => {}} ref={refV}>
          {devices
            .filter((e) => {
              return e.kind === 'videoinput'
            })
            .sort((a, b) => {
              return (
                b.label.toLowerCase().indexOf('facetime') -
                a.label.toLowerCase().indexOf('facetime')
              )
            })
            .map((e) => {
              return (
                <option key={e.deviceId} value={e.deviceId}>
                  {e.label}
                </option>
              )
            })}
        </select>
        Room Name:{' '}
        <input ref={refR} onChange={() => {}} value={'myfirstroom'}></input>
        <button
          onClick={async (ev) => {
            //
            ev.target.innerText = 'Joining room.....'
            let roomName = refR.current.value
            let audioDevice = refA.current.value
            let videoDevice = refA.current.value

            let token = await getTokenByRoomName(roomName)
            let room = await connectRoom(
              roomName,
              token,
              audioDevice,
              videoDevice
            )

            ev.target.innerText = 'Done'
            setTimeout(() => {
              ev.target.innerText = 'Join Room'
            }, 3000)
          }}
        >
          Join Room
        </button>
      </div>

      {room && <Room></Room>}
    </div>
  )
}

function Room() {
  let ref = useRef()

  let room = useTwilio((s) => s.room)

  useEffect(() => {
    return () => {
      room.disconnect()
    }
  }, [room])

  return (
    <>
      <div>Room Title: {room.name}</div>

      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      <OneParticipane
        room={room}
        participant={room.localParticipant}
      ></OneParticipane>

      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {toArray(room.participants).map((e) => {
        return (
          <OneParticipane
            key={e._id}
            room={room}
            participant={e}
          ></OneParticipane>
        )
      })}

      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      <div ref={ref}></div>
    </>
  )
}

function OneParticipane({ room, participant }) {
  console.log(participant)

  useEffect(() => {
    //
    let hh = () => {}
    participant.on('trackPublished', hh)
    return () => {
      participant.off('trackPublished', hh)
      participant.removeAllListeners()
    }
  }, [])

  //
  return (
    <div>
      <div>Person: {participant.identity}</div>
      <div>
        {/*  */}
        <div>AudioTracks:</div>

        {toArray(participant.audioTracks).map((e) => {
          return <AudioTracker key={e._id} publication={e}></AudioTracker>
        })}

        <div>Video Tracks:</div>
        {toArray(participant.videoTracks).map((e) => {
          return <VideoTracker key={e._id} publication={e}></VideoTracker>
        })}

        {/*  */}
      </div>
    </div>
  )
}

function AudioTracker({ publication }) {
  let ref = useRef()

  useEffect(() => {
    if (publication.track) {
      publication.track.attach(ref.current)
    }

    let hh = (track) => {
      track.attach(ref.current)
    }
    publication.on('subscribed', hh)
    return () => {
      publication.off('subscribed', hh)
      publication.track.detach()
    }
  }, [publication])
  return (
    <div>
      Audio: {publication.trackName}
      <audio autoPlay playsInline ref={ref}></audio>
    </div>
  )
}

function VideoTracker({ publication }) {
  let ref = useRef()

  useEffect(() => {
    if (publication.track) {
      publication.track.attach(ref.current)
    }

    let hh = () => {
      publication.track.attach(ref.current)
    }
    publication.on('subscribed', hh)
    return () => {
      publication.off('subscribed', hh)
      publication.track.detach()
    }
  }, [publication])
  return (
    <div>
      Video: {publication.trackName}
      <video autoPlay playsInline={true} ref={ref}></video>
    </div>
  )
}
