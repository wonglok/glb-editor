import create from 'zustand'

export const useRender = create((set, get) => {
  //
  //

  //
  //
  return {
    enable: false,
    setRender: (v) => {
      set({ enable: v })
    },

    enableDefaultHDR: true,
    setEnableDefaultHDR: (v) => {
      set({ enableDefaultHDR: v })
    },
    //
    //
  }
})

//
//
