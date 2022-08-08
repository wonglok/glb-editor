import create from 'zustand'
import { makeAvatarCTX } from '../ctx/make-avatar-ctx'

export const useOnline = create((set, get) => {
  // return

  let myCTX = makeAvatarCTX()
  return {
    myCTX,
    //
    //
  }
})
