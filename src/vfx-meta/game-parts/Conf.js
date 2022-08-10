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

export function Conf() {
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
    <div className='w-full h-full p-5 overflow-y-auto bg-white backdrop-blur bg-opacity-30 rounded-br-2xl'>
      {!deviceReady && (
        <button
          onClick={async () => {
            await getDevices()
            setReady(true)
          }}
          className='p-2 px-4 bg-white border border-black rounded-lg'
        >
          Start Video Chat
        </button>
      )}
      {!room && deviceReady && (
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
          <div className='pl-2 mb-3 bg-white'>
            Room Name:
            <input
              className='p-2 ml-2 bg-gray-100'
              ref={refR}
              onChange={() => {}}
              value={'myfirstroom'}
            ></input>
          </div>
          <div>
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
              className='p-2 px-4 bg-white border border-black rounded-lg'
            >
              Join Room
            </button>
          </div>
        </div>
      )}

      {room && <Room></Room>}
    </div>
  )
}

function Room() {
  let ref = useRef()

  let room = useTwilio((s) => s.room)
  let myself = useTwilio((s) => s.myself)
  let participants = useTwilio((s) => s.participants)

  console.log(room)
  return (
    <>
      <div>Room Title: {room.name}</div>

      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {room && myself && (
        <OneParticipane room={room} participant={myself}></OneParticipane>
      )}

      {/*  */}
      {participants
        .filter((a) => a)
        .map((e) => {
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

function OneParticipane({ participant, isSelf = false }) {
  let reload = useTwilio((s) => s.reload)
  useEffect(() => {
    //
    let hh = () => {
      //
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

      if (ref.current.requestVideoFrameCallback) {
        ref.current.requestVideoFrameCallback(() => {
          //
        })
      }
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
      {/* Audio: {publication.trackName} */}
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
      {/* Video: {publication.trackName} */}
      <video className=' w-96' autoPlay playsInline={true} ref={ref}></video>
    </div>
  )
}

//