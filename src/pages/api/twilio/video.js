// create the twilioClient
const { v4: uuidv4 } = require('uuid')

const twilioClient = require('twilio')(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET,
  { accountSid: process.env.TWILIO_ACCOUNT_SID }
)

const AccessToken = require('twilio').jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant

const findOrCreateRoom = async (roomName, password) => {
  try {
    // see if the room exists already. If it doesn't, this will throw
    // error 20404.
    await twilioClient.video.rooms(roomName).fetch()
  } catch (error) {
    // the room was not found, so create it
    if (error.code == 20404) {
      await twilioClient.video.rooms.create({
        uniqueName: roomName,
        type: 'peer-to-peer',
        password: password,
        audioOnly: false,
      })
    } else {
      // let other errors bubble up
      throw error
    }
  }
}

const getAccessToken = (roomName) => {
  // create an access token
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET,
    // generate a random unique identity for this participant
    { identity: uuidv4() }
  )
  // create a video grant for this specific room
  const videoGrant = new VideoGrant({
    room: roomName,
  })

  // add the video grant
  token.addGrant(videoGrant)
  // serialize the token and return it
  return token.toJwt()
}

export default async function create(req, res) {
  if (req.body.actionType === 'join-room') {
    // return 400 if the request has an empty body or no roomName
    if (!req.body || !req.body.roomName) {
      return res.status(400).json({ msg: 'Must include roomName argument.' })
    }
    if (!req.body || !req.body.password) {
      return res.status(400).json({ msg: 'Must include password argument.' })
    }
    const password = req.body.password
    const roomName = req.body.roomName
    // find or create a room with the given roomName
    await findOrCreateRoom(roomName, password)
    // generate an Access Token for a participant in this room
    const token = getAccessToken(roomName)
    res.status(200).json({
      token: token,
    })
  } else {
    res.status(404).json({ bad: true, msg: 'not found' })
  }
}
