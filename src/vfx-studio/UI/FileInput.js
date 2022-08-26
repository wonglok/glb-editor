export function FileInput({ onFile = () => {} }) {
  return (
    <button
      onClick={() => {
        let input = document.createElement('input')
        input.type = 'file'
        input.accept =
          'application/gltf-buffer;	model/gltf-binary; model/gltf+json'
        input.onchange = async (ev) => {
          //
          //
          //
          if (ev.target && ev.target.files && ev.target.files[0]) {
            let first = ev.target.files[0]

            if (first) {
              //
              //

              let ab = await first.arrayBuffer()

              onFile({
                buffer: ab,
                file: first,
                name: first.name,
              })

              //
              //
            }
          }
        }
        input.click()
      }}
      className='p-5 px-8 text-white bg-blue-800 rounded-lg'
    >
      Select GLB File to Edit
    </button>
  )
}
