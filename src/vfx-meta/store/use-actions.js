import { useEffect, useRef } from 'react'

export const useActions = ({
  acts,
  avatarActionName,
  activeMixer,
  setAction,
  avatarActionResumeOnKeyUp,
  avatarActionRepeat,
}) => {
  let tt = useRef(0)
  useEffect(() => {
    //
    if (acts && avatarActionName && activeMixer) {
      //

      let act = acts.find((a) => a.name === avatarActionName)

      if (act) {
        act.action.reset()
        act.action.repeats = act.repeats
        act.action.fadeIn(260 / 1000)
        act.action.play()
        activeMixer.update(1 / 60)

        if (avatarActionRepeat === 1) {
          clearInterval(tt.current)
          tt.current = setTimeout(() => {
            setAction(avatarActionResumeOnKeyUp, Infinity)
          }, act.duration * 1000 - 260)
        }

        //
        return () => {
          act.action.fadeOut(260 / 1000)
        }
      } else {
        if (avatarActionName !== avatarActionResumeOnKeyUp) {
          setAction(avatarActionResumeOnKeyUp, Infinity)
        }
      }
    }
  }, [
    acts,
    avatarActionName,
    activeMixer,
    setAction,
    avatarActionRepeat,
    avatarActionResumeOnKeyUp,
  ])
}
