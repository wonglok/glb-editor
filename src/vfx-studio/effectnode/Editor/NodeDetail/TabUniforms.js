import { getID } from '@/vfx-runtime/ENUtils'
import { useEffect, useRef, useState } from 'react'
import { Pane } from 'tweakpane'
import Editor from '@monaco-editor/react'
import { GLSLEditor } from '@/vfx-studio/UI/GLSLEditor'
import * as TweakpaneImagePlugin from 'tweakpane-image-plugin'

export function TabUnifroms({ node }) {
  let refName = useRef()
  let refType = useRef()
  let DataKey = 'uniforms'
  let [, reload] = useState(0)

  let onSaveLater = (mm) => () => {
    // ENMethods.saveCodeBlock({ node }).then(() => {
    //   // reload((s) => s + 1)
    // })

    window.dispatchEvent(new CustomEvent('reload-node', { detail: node }))
    reload((s) => s + 1)
  }
  let onRemove = (mm) => () => {
    let arr = node[DataKey]
    arr.splice(
      arr.findIndex((e) => {
        return e._id === mm._id
      }),
      1
    )

    window.dispatchEvent(new CustomEvent('reload-node', { detail: node }))
    reload((s) => s + 1)

    // ENMethods.saveCodeBlock({ node }).then(() => {
    //   reload((s) => s + 1)
    // })
  }

  return (
    <div className='p-2'>
      <div className='flex  mb-3'>
        <input
          type='text'
          className='p-2 bg-gray-200'
          ref={refName}
          defaultValue={'newUniformData'}
        ></input>

        <select
          ref={refType}
          defaultValue={'float'}
          className='p-2 bg-gray-100'
        >
          <option value={'texture'}>Texture</option>
          <option value={'text'}>Text</option>
          <option value={'glsl'}>GLSL</option>
          <option value={'bool'}>Boolean</option>
          <option value={'float'}>Float</option>
          <option value={'vec2'}>Vector2</option>
          <option value={'vec3'}>Vector3</option>
          <option value={'vec4'}>Vector4</option>
          <option value={'color'}>Color</option>
        </select>

        {/*  */}
        {/*  */}
        {/*  */}
        <button
          className='p-2 px-3 bg-gray-300'
          onClick={() => {
            //
            let getDefault = (type) => {
              if (type === 'glsl') {
                return `
                  void main (void) {
                    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
                  }
                `
              }

              //
              if (type === 'texture') {
                return ''
              }
              if (type === 'bool') {
                return true
              }
              if (type === 'text') {
                return ''
              }
              if (type === 'float') {
                return 1
              }
              if (type === 'vec2') {
                return { x: 0, y: 0 }
              }
              if (type === 'vec3') {
                return { x: 0, y: 0, z: 0 }
              }
              if (type === 'vec4') {
                return { x: 0, y: 0, z: 0, w: 1 }
              }
              if (type === 'color') {
                return '#ffffff'
              }
            }

            //
            node[DataKey].push({
              _id: getID(),
              name: refName.current.value,
              type: refType.current.value,
              nodeID: node._id,

              value: getDefault(refType.current.value),
            })
            reload((s) => s + 1)

            // ENMethods.saveCodeBlock({ node }).then(() => {
            //   reload((s) => s + 1)
            // })
          }}
        >
          Add
        </button>
      </div>

      <div className='flex flex-wrap'>
        {node[DataKey].map((mm) => {
          mm._id = mm._id || getID()
          return (
            <div key={mm._id + mm.nodeID + node._id} className='mb-3 mr-3'>
              <div className='inline-block'>
                {mm.type === 'texture' && (
                  <TextureInput
                    object={mm}
                    name={'value'}
                    label={mm.name}
                    value={mm.value}
                    onSaveLater={onSaveLater(mm)}
                    onRemove={onRemove(mm)}
                  ></TextureInput>
                )}

                {mm.type === 'bool' && (
                  <BoolInput
                    object={mm}
                    name={'value'}
                    label={mm.name}
                    value={mm.value}
                    onSaveLater={onSaveLater(mm)}
                    onRemove={onRemove(mm)}
                  ></BoolInput>
                )}

                {mm.type === 'text' && (
                  <TextInput
                    object={mm}
                    name={'value'}
                    label={mm.name}
                    value={mm.value}
                    onSaveLater={onSaveLater(mm)}
                    onRemove={onRemove(mm)}
                  ></TextInput>
                )}

                {mm.type === 'glsl' && (
                  <GLSLInput
                    object={mm}
                    name={'value'}
                    label={mm.name}
                    value={mm.value}
                    onSaveLater={onSaveLater(mm)}
                    onRemove={onRemove(mm)}
                  ></GLSLInput>
                )}

                {mm.type === 'float' && (
                  <FloatInput
                    object={mm}
                    name={'value'}
                    label={mm.name}
                    value={mm.value}
                    onSaveLater={onSaveLater(mm)}
                    onRemove={onRemove(mm)}
                  ></FloatInput>
                )}

                {mm.type === 'vec2' && (
                  <Vector2Input
                    object={mm}
                    name={'value'}
                    label={mm.name}
                    value={mm.value}
                    onSaveLater={onSaveLater(mm)}
                    onRemove={onRemove(mm)}
                  ></Vector2Input>
                )}

                {mm.type === 'vec3' && (
                  <Vector3Input
                    object={mm}
                    name={'value'}
                    label={mm.name}
                    value={mm.value}
                    onSaveLater={onSaveLater(mm)}
                    onRemove={onRemove(mm)}
                  ></Vector3Input>
                )}

                {mm.type === 'vec4' && (
                  <Vector4Input
                    object={mm}
                    name={'value'}
                    label={mm.name}
                    value={mm.value}
                    onSaveLater={onSaveLater(mm)}
                    onRemove={onRemove(mm)}
                  ></Vector4Input>
                )}

                {mm.type === 'color' && (
                  <ColorInput
                    object={mm}
                    name={'value'}
                    label={mm.name}
                    value={mm.value}
                    onSaveLater={onSaveLater(mm)}
                    onRemove={onRemove(mm)}
                  ></ColorInput>
                )}
              </div>

              {/*  */}
              {/*  */}
              {/*  */}
            </div>
          )
        })}
      </div>
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
    </div>
  )
}

function ColorInput({
  object = { value: { x: 0, y: 0, z: 0, w: 1 } },
  name = 'value',
  label,
  value = 0,
  min,
  max,
  step = 0.01,
  onSave = () => {},
  onSaveLater = () => {},
  onRemove = () => {},
}) {
  let ref = useRef()
  useEffect(() => {
    const pane = new Pane({
      container: ref.current,
    })
    let tt = 0
    pane
      .addInput(object, name, {
        label,
        min,
        max,
        value,
        step,
        picker: 'inline',
        expanded: true,
      })
      .on('change', () => {
        onSave()

        clearTimeout(tt)
        tt = setTimeout(() => {
          onSaveLater()
        }, 25)
      })
    if (!object.protected) {
      const btn = pane.addButton({
        title: 'Remove',
        label: 'Remove', // optional
      })

      btn.on('click', () => {
        if (window.confirm('remove?')) {
          onRemove()
        }
      })
    }
    return () => {
      //
      pane.dispose()
    }
  }, [])
  return (
    <div>
      <div ref={ref}></div>
    </div>
  )
}

function Vector4Input({
  object = { value: { x: 0, y: 0, z: 0, w: 1 } },
  name = 'value',
  label,
  value = 0,
  min,
  max,
  step = 0.01,
  onSave = () => {},
  onSaveLater = () => {},
  onRemove = () => {},
}) {
  let ref = useRef()
  useEffect(() => {
    const pane = new Pane({
      container: ref.current,
    })
    let tt = 0
    pane
      .addInput(object, name, {
        label,
        min,
        max,
        value,
        step,
        picker: 'inline',
        expanded: true,
      })
      .on('change', () => {
        onSave()

        clearTimeout(tt)
        tt = setTimeout(() => {
          onSaveLater()
        }, 25)
      })

    if (!object.protected) {
      const btn = pane.addButton({
        title: 'Remove',
        label: 'Remove', // optional
      })

      btn.on('click', () => {
        if (window.confirm('remove?')) {
          onRemove()
        }
      })
    }

    return () => {
      //
      pane.dispose()
    }
  }, [])
  return (
    <div>
      <div ref={ref}></div>
    </div>
  )
}

function Vector3Input({
  object = { value: { x: 0, y: 0, z: 0 } },
  name = 'value',
  label,
  value = 0,
  min,
  max,
  step = 0.01,
  onSave = () => {},
  onSaveLater = () => {},
  onRemove = () => {},
}) {
  let ref = useRef()
  useEffect(() => {
    const pane = new Pane({
      container: ref.current,
    })
    let tt = 0
    pane
      .addInput(object, name, {
        label,
        min,
        max,
        value,
        step,
        picker: 'inline',
        expanded: true,
      })
      .on('change', () => {
        onSave()

        clearTimeout(tt)
        tt = setTimeout(() => {
          onSaveLater()
        }, 25)
      })

    if (!object.protected) {
      const btn = pane.addButton({
        title: 'Remove',
        label: 'Remove', // optional
      })

      btn.on('click', () => {
        if (window.confirm('remove?')) {
          onRemove()
        }
      })
    }

    return () => {
      //
      pane.dispose()
    }
  }, [])
  return (
    <div>
      <div ref={ref}></div>
    </div>
  )
}

function Vector2Input({
  object = { value: { x: 0, y: 0 } },
  name = 'value',
  label,
  value = 0,
  min,
  max,
  step = 0.01,
  onSave = () => {},
  onSaveLater = () => {},
  onRemove = () => {},
}) {
  let ref = useRef()
  useEffect(() => {
    const pane = new Pane({
      container: ref.current,
    })
    let tt = 0
    pane
      .addInput(object, name, {
        label,
        min,
        max,
        value,
        step,
        picker: 'inline',
        expanded: true,
      })
      .on('change', () => {
        onSave()

        clearTimeout(tt)
        tt = setTimeout(() => {
          onSaveLater()
        }, 25)
      })

    if (!object.protected) {
      const btn = pane.addButton({
        title: 'Remove',
        label: 'Remove', // optional
      })

      btn.on('click', () => {
        if (window.confirm('remove?')) {
          onRemove()
        }
      })
    }
    return () => {
      //
      pane.dispose()
    }
  }, [])
  return (
    <div>
      <div ref={ref}></div>
    </div>
  )
}

function FloatInput({
  object = { value: 0 },
  name = 'value',
  label,
  value = 0,
  min,
  max,
  step = 0.01,
  onSave = () => {},
  onSaveLater = () => {},
  onRemove = () => {},
}) {
  let ref = useRef()
  useEffect(() => {
    const pane = new Pane({
      container: ref.current,
    })
    let tt = 0
    pane
      .addInput(object, name, {
        label,
        min,
        max,
        value,
        step,
      })
      .on('change', () => {
        onSave()

        clearTimeout(tt)
        tt = setTimeout(() => {
          onSaveLater()
        }, 25)
      })

    if (!object.protected) {
      const btn = pane.addButton({
        title: 'Remove',
        label: 'Remove', // optional
      })

      btn.on('click', () => {
        if (window.confirm('remove?')) {
          onRemove()
        }
      })
    }

    return () => {
      //
      pane.dispose()
    }
  }, [])
  return (
    <div>
      <div ref={ref}></div>
    </div>
  )
}

function GLSLInput({
  object = { value: 0 },
  name = 'value',
  label,
  value = '',
  min,
  max,
  step = 0.01,
  onSave = () => {},
  onSaveLater = () => {},
  onRemove = () => {},
}) {
  let ref = useRef()
  useEffect(() => {
    //

    const pane = new Pane({
      container: ref.current,
    })

    if (!object.protected) {
      const btn = pane.addButton({
        title: 'Remove',
        label: 'Remove', // optional
      })

      btn.on('click', () => {
        if (window.confirm('remove?')) {
          onRemove()
        }
      })
    }
    return () => {
      //
      pane.dispose()
    }
  }, [])

  let tt = 0

  let [canEdit, setEdit] = useState(false)

  //
  return (
    <div
      className=''
      style={{
        width: '400px',
        height: '400px',
      }}
    >
      <div className='w-full p-2 text-center text-white bg-gray-600'>
        {label}
      </div>
      <GLSLEditor
        onSave={(ev) => {
          object[name] = ev
          onSave()
        }}
        onChange={(ev) => {
          object[name] = ev

          clearTimeout(tt)
          tt = setTimeout(() => {
            onSaveLater()
          }, 100)
        }}
        initValue={value}
        lang={'javascript'}
      >
        {!canEdit && (
          <div
            onClick={() => {
              setEdit(true)
            }}
            className='absolute top-0 left-0 flex items-center justify-center w-full h-full text-black bg-white cursor-pointer bg-opacity-70 '
          >
            Click to Edit
          </div>
        )}
      </GLSLEditor>
      <div ref={ref}></div>
    </div>
  )
}

function TextInput({
  object = { value: 0 },
  name = 'value',
  label,
  value = 0,
  min,
  max,
  step = 0.01,
  onSave = () => {},
  onSaveLater = () => {},
  onRemove = () => {},
}) {
  let ref = useRef()
  useEffect(() => {
    const pane = new Pane({
      container: ref.current,
    })

    //
    let tt = 0
    pane
      .addInput(object, name, {
        label,
        value,
        step,
      })
      .on('change', () => {
        onSave()

        clearTimeout(tt)
        tt = setTimeout(() => {
          onSaveLater()
        }, 25)
      })

    if (!object.protected) {
      const btn = pane.addButton({
        title: 'Remove',
        label: 'Remove', // optional
      })

      btn.on('click', () => {
        if (window.confirm('remove?')) {
          onRemove()
        }
      })
    }

    return () => {
      //
      pane.dispose()
    }
  }, [])
  return (
    <div>
      <div ref={ref}></div>
    </div>
  )
}

function BoolInput({
  object = { value: 0 },
  name = 'value',
  label,
  value = 0,
  min,
  max,
  step = 0.01,
  onSave = () => {},
  onSaveLater = () => {},
  onRemove = () => {},
}) {
  let ref = useRef()
  useEffect(() => {
    const pane = new Pane({
      container: ref.current,
    })

    //
    let tt = 0
    pane
      .addInput(object, name, {
        label,
        value,
        step,
      })
      .on('change', () => {
        onSave()

        clearTimeout(tt)
        tt = setTimeout(() => {
          onSaveLater()
        }, 25)
      })

    if (!object.protected) {
      const btn = pane.addButton({
        title: 'Remove',
        label: 'Remove', // optional
      })

      btn.on('click', () => {
        if (window.confirm('remove?')) {
          onRemove()
        }
      })
    }

    return () => {
      //
      pane.dispose()
    }
  }, [])
  return (
    <div>
      <div ref={ref}></div>
    </div>
  )
}

function TextureInput({
  object = { value: null },
  name = 'value',
  label,
  value = 0,
  min,
  max,
  step = 0.01,
  onSave = () => {},
  onSaveLater = () => {},
  onRemove = () => {},
}) {
  //
  let ref = useRef()

  let [reload, setReload] = useState(0)
  //
  useEffect(() => {
    const pane = new Pane({
      container: ref.current,
    })
    pane.registerPlugin(TweakpaneImagePlugin)

    let tt = 0
    try {
      const btnSelect = pane.addButton({
        title: label,
        label: 'Select', // optional
      })

      btnSelect.on('click', () => {
        let sel = document.createElement('input')
        sel.type = 'file'
        sel.accept = 'image/*'
        sel.click()
        sel.onchange = async (ev) => {
          if (ev.target.files) {
            let file = ev.target.files[0]

            let dataUrl = await new Promise((resolve) => {
              let reader = new FileReader()
              reader.onload = () => resolve(reader.result)
              reader.readAsDataURL(file)
            })

            object[name] = dataUrl

            onSave()
            clearTimeout(tt)
            tt = setTimeout(() => {
              onSaveLater()
              setReload((s) => s + 1)
            }, 25)
          }
        }

        // object[name] = null
      })
    } catch (e) {
      console.log(e)
    }

    const btnReset = pane.addButton({
      title: 'Reset',
      label: 'reset', // optional
    })

    btnReset.on('click', () => {
      object[name] = null

      onSave()

      clearTimeout(tt)
      tt = setTimeout(() => {
        onSaveLater()
        setReload((s) => s + 1)
      }, 25)
    })

    ///
    if (!object.protected) {
      const btn = pane.addButton({
        title: 'Remove: ' + label,
        label: 'Remove', // optional
      })

      btn.on('click', () => {
        if (window.confirm('remove?' + label)) {
          onRemove()
        }
      })
    }

    return () => {
      //
      pane.dispose()
    }
  }, [reload])

  //
  return (
    <div>
      {object[name] && (
        <img
          className='w-full h-full max-w-24 max-h-24'
          src={object[name]}
        ></img>
      )}
      <div ref={ref}></div>
    </div>
  )
}
