import { useTwilio } from '@/vfx-meta/store/use-twilio'
import { useEffect, useState } from 'react'
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
    // console.log('')
  }, [])

  //
  let [deviceReady, setReady] = useState(false)
  let refR = useRef()
  let refA = useRef()
  let refV = useRef()
  return (
    <div>
      <button
        onClick={async () => {
          await getDevices()
          setReady(true)
        }}
      >
        Create Chat
      </button>
      {deviceReady && (
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
                console.log(e)
                return (
                  <option key={e.deviceId} value={e.deviceId}>
                    {e.label || e.kind + e.deviceId}
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
                    {e.label || e.kind + e.deviceId}
                  </option>
                )
              })}
          </select>
          Room Name:
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
      )}

      {room && <Room></Room>}
    </div>
  )
}

function Room() {
  let ref = useRef()

  let room = useTwilio((s) => s.participants)
  let participants = useTwilio((s) => s.participants)

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
      {participants.map((e) => {
        return (
          <OneParticipane
            key={e.identity}
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

function OneParticipane({ participant }) {
  console.log(participant)

  let room = useTwilio((s) => s.room)
  let reload = useTwilio((s) => s.reload)
  useEffect(() => {
    //
    let hh = () => {
      reload()
    }
    participant.on('trackPublished', hh)
    return () => {
      participant.off('trackPublished', hh)
    }
  }, [])

  //
  return (
    <div>
      <div>Person: {participant.identity}</div>
      <div>
        {/*  */}

        {toArray(participant.audioTracks).map((e) => {
          return <AudioTracker key={e._id} publication={e}></AudioTracker>
        })}

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
    let hh = (track) => {
      track.attach(ref.current)
    }

    if (publication.track) {
      hh(publication.track)
    }
    publication.on('subscribed', hh)
    return () => {
      publication.off('subscribed', hh)
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
    let hh = (track) => {
      track.attach(ref.current)
    }

    if (publication.track) {
      hh(publication.track)
    }
    publication.on('subscribed', hh)
    return () => {
      publication.off('subscribed', hh)
    }
  }, [publication])
  return (
    <div>
      Video: {publication.trackName}
      <video autoPlay playsInline={true} ref={ref}></video>
    </div>
  )
}
