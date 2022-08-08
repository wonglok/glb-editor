import { useEffect } from 'react'
import { useMetaStore } from '../store/use-meta-store'
import { auth } from '../store/firebase'
import { LoginButton } from './LoginButtons'
import { TopRightButtons } from './TopRightButtons'
import { OtherPlayers } from './OtherPlayers'
import { getID } from '@/vfx-runtime/ENUtils'
import { LogoutButtons } from './LogoutButtons'
import { AvatarButton } from './AvatarButton'
import { useRouter } from 'next/router'
// import { SetupOnlineID } from './SetupOnlineID'

export function OnlineSystem({ children, mapID = 'yoyo' }) {
  let setMyself = useMetaStore((s) => s.setMyself)
  let myself = useMetaStore((s) => s.myself)
  let mode = useMetaStore((s) => s.mode)
  let setMode = useMetaStore((s) => s.setMode)
  let goOnline = useMetaStore((s) => s.goOnline)

  useEffect(() => {
    return auth().onAuthStateChanged((user) => {
      //
      if (user) {
        //
        setMyself(user)
        if (user.isAnonymous) {
          setMode('guest')
        } else {
          setMode('user')
        }
      } else {
        setMyself(false)
        setMode('login')
      }
    })
  }, [children, setMode, setMyself])

  useEffect(() => {
    let myself = {
      uid: getID(),
    }

    //
    return goOnline(myself, mapID)
  }, [mapID, goOnline])

  if (mode === 'login') {
    return (
      <>
        <LoginButton></LoginButton>
      </>
    )
  }

  return (
    <>
      {(mode === 'guest' || mode === 'user') && (
        <>
          <TopRightButtons>
            <LogoutButtons></LogoutButtons>
            <AvatarButton></AvatarButton>
          </TopRightButtons>
          <OtherPlayers></OtherPlayers>
          {children}
        </>
      )}
    </>
  )
}
