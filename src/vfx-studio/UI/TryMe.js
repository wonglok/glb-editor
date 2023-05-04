export function TryMe({ onFile }) {
  return (
    <button
      onClick={async (ev) => {
        ev.target.innerText = 'Loading....'

        let file = await fetch(`/demo/shield-guy-stage1.glb`).then((e) =>
          e.blob()
        )
        file.name = 'demofile.glb'

        // let buffer =
        onFile({
          buffer: await file.arrayBuffer(),
          file,
          name: 'demo file.glb',
          done: () => {
            ev.target.innerText = 'Download and Try Out Editing Demo File'
          },
        })
      }}
      className='px-8 py-2 text-sm text-white bg-indigo-700  rounded transition duration-150 ease-in-out hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700'
    >
      Download and Try Out Editing Demo File
    </button>
  )
}
