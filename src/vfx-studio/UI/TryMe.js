export function TryMe({ onFile }) {
  return (
    <button
      className='p-2 bg-blue-200'
      onClick={async () => {
        let file = await fetch(`/scene/loklokdemo/glassman_.glb`).then((e) =>
          e.blob()
        )
        file.name = 'demofile.glb'

        // let buffer =
        onFile({
          buffer: await file.arrayBuffer(),
          file,
          name: 'demo file.glb',
        })
      }}
    >
      Try Demo File
    </button>
  )
}
