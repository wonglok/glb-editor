export function FileInput({ onFile = () => {} }) {
  return (
    <button
      onClick={() => {
        let input = document.createElement('input')
        input.type = 'file'
        input.accept = 'model/gltf-binary'
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
      className='p-5 text-white bg-blue-500'
    >
      Select GLB File to Edit
    </button>
  )
}
