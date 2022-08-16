import create from 'zustand'

export const useRender = create((set, get) => {
  //
  //

  //
  //
  return {
    enable: true,
    setRender: (v) => {
      set({ enable: v })
    },

    enableDefaultHDR: true,
    setEnableDefaultHDR: (v) => {
      set({ enableDefaultHDR: v })
    },

    enableButtonToggle: false,
    setEnableButton: (v) => {
      set({ enableButtonToggle: v })
    },
    //
    //
  }
})

//
//
