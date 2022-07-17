import {
  AnimationMixer,
  BoxBufferGeometry,
  DoubleSide,
  Matrix4,
  MeshBasicMaterial,
  Object3D,
} from 'three'
import { Line3, SphereBufferGeometry } from 'three'
import { Box3 } from 'three'
import { MeshStandardMaterial } from 'three'
import { Color } from 'three'
import { Mesh } from 'three'
import { Vector3, Sphere } from 'three'
import { mergeBufferGeometries } from 'three-stdlib'

import { MeshBVH, MeshBVHVisualizer } from 'three-mesh-bvh'
import { OrbitControls, RoundedBoxGeometry } from 'three-stdlib'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GameControls } from '../SharedCommons/GameControls'
import { AvatarSkin } from '../SharedCommons/AvatarSkin'
import { OnlineGame } from '../SharedCommons/OnlineGame'
import { Overlay } from '../SharedCommons/Overlay'
import { Introduction } from './Introduction'
import { getID } from '@/vfx-runtime/ENUtils'
import { Companion } from '../SharedCommons/Companion'
import { Core } from '@/vfx-core/Core'
import { OnlinePop } from '../SharedCommons/OnlinePop'

export class MapGame extends Object3D {
  constructor({ api, params, onDone, onDoneMyAvatar }) {
    super()
    Core.now.renderMode = 'loading'

    let o3d = new Object3D()

    this.add(o3d)
    //
    let DefaultAvatar = `/Metaverse/avatar/default-npc.glb`
    let DefaultMap = `/Metaverse/places/lobby/hall-v2-v1.glb`
    let DefaultResetPosition = [0, 1, 0]
    this.params = {
      resetPosition: DefaultResetPosition,
      onDoneMap: (item) => {
        console.log('done loading map', item)
      },
      defaultAvatar: DefaultAvatar,
      mapURL: DefaultMap,
      firstPerson: params.firstPerson || true,

      displayCollider: false,
      displayBVH: false,
      visualizeDepth: 10,
      gravity: -30,
      playerSpeed: 15,
      physicsSteps: 1,

      reset: () => {
        this.resetPlayer = this.resetPlayer || (() => {})
        this.resetPlayer({ position: Settings.resetPosition })
      },
      toggleCam: () => {
        this.onSwitchCam = this.onSwitchCam || (() => {})
        Settings.firstPerson = !Settings.firstPerson
        this.onSwitchCam(Settings.firstPerson)
      },

      ...params,
    }
    const Settings = this.params
    let self = this
    let collider, visualizer, player, controls
    let state = {}
    this.state = state

    state.playerIsOnGround = false
    state.fwdPressed = false
    state.bkdPressed = false
    state.lftPressed = false
    state.rgtPressed = false

    let playerVelocity = new Vector3()
    let upVector = new Vector3(0, 1, 0)
    let tempVector = new Vector3()
    let tempVector2 = new Vector3()
    let tempBox = new Box3()
    let tempMat = new Matrix4()
    let tempSegment = new Line3()
    let deltaTarget = new Vector3(0, 0, 0)

    state.playerVelocity = playerVelocity

    let setup = async () => {
      let renderer = await api.ready.gl
      let camera = await api.ready.camera
      let scene = await api.ready.scene

      scene.add(o3d)
      api.onClean(() => {
        scene.remove(o3d)
        o3d.clear()
      })

      camera.near = 0.1
      camera.far = 500
      camera.updateProjectionMatrix()

      controls = new OrbitControls(camera, renderer.domElement)

      api.now.controls = controls
      api.onClean(() => {
        controls.dispose()
      })

      player = new Mesh(
        new RoundedBoxGeometry(1.0, 2.0, 1.0, 7, 0.5),
        new MeshStandardMaterial()
      )
      state.player = player
      player.geometry.translate(0, -0.5, 0)
      player.capsuleInfo = {
        radius: 0.5,
        segment: new Line3(new Vector3(), new Vector3(0, -1.0, 0.0)),
      }
      // player.visible = true;
      o3d.add(player)
      resetPlayer({ position: Settings.resetPosition })
      onSwitchCam(Settings.firstPerson)

      new Companion({ api, parent: self, chase: player })

      window.addEventListener('keydown', function (e) {
        switch (e.code) {
          case 'KeyW':
            state.fwdPressed = true
            break
          case 'KeyS':
            state.bkdPressed = true
            break
          case 'KeyD':
            state.rgtPressed = true
            break
          case 'KeyA':
            state.lftPressed = true
            break

          case 'ArrowUp':
            state.fwdPressed = true
            break
          case 'ArrowDown':
            state.bkdPressed = true
            break
          case 'ArrowRight':
            state.rgtPressed = true
            break
          case 'ArrowLeft':
            state.lftPressed = true
            break
          case 'Space':
            e.preventDefault()

            if (state.playerIsOnGround) {
              state.spacePressed = true
              playerVelocity.y = 10.0
            }
            break
        }
      })

      window.addEventListener('keyup', function (e) {
        switch (e.code) {
          case 'KeyW':
            state.fwdPressed = false
            break
          case 'KeyS':
            state.bkdPressed = false
            break
          case 'KeyD':
            state.rgtPressed = false
            break
          case 'KeyA':
            state.lftPressed = false
            break
          case 'ArrowUp':
            state.fwdPressed = false
            break
          case 'ArrowDown':
            state.bkdPressed = false
            break
          case 'ArrowRight':
            state.rgtPressed = false
            break
          case 'ArrowLeft':
            state.lftPressed = false
            break
          case 'Space':
            state.spacePressed = false
            break
        }
      })

      window.addEventListener('blur', (e) => {
        state.fwdPressed = false
        state.bkdPressed = false
        state.rgtPressed = false
        state.lftPressed = false
      })

      window.addEventListener('focus', (e) => {
        state.fwdPressed = false
        state.bkdPressed = false
        state.rgtPressed = false
        state.lftPressed = false
      })

      // let gameControls = new GameControls({
      //   player,
      //   container,
      //   state,
      //   controls,
      // });

      function resetPlayer({ position = [0, 1, 0] }) {
        playerVelocity.set(0, 0, 0)
        player.position.fromArray(position)
        camera.position.sub(controls.target)
        controls.target.copy(player.position)
        camera.position.add(player.position)
        controls.update()
      }

      function onSwitchCam(isFirstPerson) {
        if (!isFirstPerson) {
          deltaTarget.x = 0
          deltaTarget.y = -1.6
          deltaTarget.z = -7
          deltaTarget.applyAxisAngle(upVector, controls.getAzimuthalAngle())

          controls.target.add(deltaTarget)
          controls.update()

          camera.position
            .sub(controls.target)
            .normalize()
            .multiplyScalar(2)
            .add(controls.target)

          controls.rotateSpeed = -0.75
          controls.enableDamping = true
          // player.visible = true;
        } else {
          controls.update()
          camera.position
            .sub(controls.target)
            .normalize()
            .multiplyScalar(0)
            .add(controls.target)

          controls.target.copy(player.position)

          deltaTarget.x = 0
          deltaTarget.y = 1.6
          deltaTarget.z = -7
          deltaTarget.applyAxisAngle(upVector, controls.getAzimuthalAngle())
          // controls.target.y += 2.5;
          // controls.target.z += -10;
          controls.target.add(deltaTarget)

          controls.rotateSpeed = -0.5
          controls.enableDamping = true

          // player.visible = false;
        }
      }
      //
      //
      //
      this.onSwitchCam = onSwitchCam

      function doMainLoopLogic({ dt }) {
        const delta = Math.min(dt, 1 / 60)
        if (Settings.firstPerson) {
          // controls.maxPolarAngle = Math.PI;
          controls.minDistance = 0.00004
          controls.maxDistance = 0.00004
        } else {
          // controls.minPolarAngle = (Math.PI / 2) * 0.1;
          // controls.maxPolarAngle = Math.PI;
          controls.minDistance = 0.4
          controls.maxDistance = 90
        }

        if (collider) {
          collider.visible = Settings.displayCollider
          visualizer.visible = Settings.displayBVH

          const physicsSteps = Settings.physicsSteps

          for (let i = 0; i < physicsSteps; i++) {
            updatePlayer(delta / physicsSteps)
          }
        }

        // TODO: limit the camera movement based on the collider
        // raycast in direction of camera and move it if it's further than the closest point
        controls.update()
      }

      function loadColliderMap({ url, done = () => {} }) {
        // const IS_IOS =
        //   /^(iPad|iPhone|iPod)/.test(window.navigator.platform) ||
        //   (/^Mac/.test(window.navigator.platform) &&
        //     window.navigator.maxTouchPoints > 1);
        // if (IS_IOS) {
        //   window.createImageBitmap = undefined;
        // }

        let loader = new GLTFLoader()
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco/')
        loader.setDRACOLoader(dracoLoader)

        loader.load(url, (gltf) => {
          const gltfScene = gltf.scene

          const geometriesToBeMerged = []
          gltfScene.updateMatrixWorld(true)
          gltfScene.traverse((c) => {
            if (c.geometry) {
              if (c.userData?.isBox) {
                let cloned = c.geometry

                cloned.computeBoundingBox()
                const box = new Box3()
                box.copy(cloned.boundingBox)

                let center = new Vector3()
                c.updateMatrixWorld()

                box.applyMatrix4(c.matrixWorld)
                let s = new Vector3()
                box.getSize(s)
                box.getCenter(center)

                let geo = new BoxBufferGeometry(s.x, s.y, s.z)
                geo.translate(center.x, center.y, center.z)

                // let mesh = new Mesh(
                //   geo,
                //   new MeshBasicMaterial({
                //     color: 0xff0000,
                //     opacity: 1,
                //     wireframe: true,
                //   })
                // );
                // scene.add(mesh);

                for (const key in geo.attributes) {
                  if (key !== 'position') {
                    geo.deleteAttribute(key)
                  }
                }
                geometriesToBeMerged.push(geo)
              } else if (c.userData?.isSphere) {
                let cloned = c.geometry

                cloned.computeBoundingSphere()
                const sph = new Sphere()
                sph.copy(cloned.boundingSphere)

                let center = new Vector3()
                c.updateMatrixWorld()
                sph.applyMatrix4(c.matrixWorld)

                center.copy(sph.center)

                let geo = new SphereBufferGeometry(sph.radius, 8, 8)
                geo.translate(center.x, center.y, center.z)

                // let mesh = new Mesh(
                //   geo,
                //   new MeshBasicMaterial({
                //     color: 0x00ff00,
                //     opacity: 1,
                //     wireframe: true,
                //   })
                // );
                // scene.add(mesh);

                for (const key in geo.attributes) {
                  if (key !== 'position') {
                    geo.deleteAttribute(key)
                  }
                }
                geometriesToBeMerged.push(geo)
              } else {
                const cloned = c.geometry.clone()
                cloned.applyMatrix4(c.matrixWorld)

                for (const key in cloned.attributes) {
                  if (key !== 'position') {
                    cloned.deleteAttribute(key)
                  }
                }
                geometriesToBeMerged.push(cloned)
              }
            }
          })

          // create the merged geometry
          const combined = mergeBufferGeometries(geometriesToBeMerged, false)
          combined.boundsTree = new MeshBVH(combined, {
            lazyGeneration: false,
          })

          collider = new Mesh(combined)
          collider.material.wireframe = true
          collider.material.opacity = 0.5
          collider.material.transparent = true
          collider.material.side = DoubleSide
          collider.material.color = new Color('#ff0000')
          collider.visible = false

          self.collider = collider
          api.now.collider = collider

          visualizer = new MeshBVHVisualizer(collider, Settings.visualizeDepth)
          // o3d.add(visualizer);
          // o3d.add(collider);
          o3d.add(gltfScene)

          done({ mapScene: gltfScene, gltf })
        })
      }

      function updatePlayer(delta) {
        playerVelocity.y += state.playerIsOnGround
          ? 0
          : delta * Settings.gravity
        player.position.addScaledVector(playerVelocity, delta)

        // move the player
        const angle = controls.getAzimuthalAngle()
        if (state.fwdPressed) {
          tempVector.set(0, 0, -1).applyAxisAngle(upVector, angle)
          player.position.addScaledVector(
            tempVector,
            Settings.playerSpeed * delta
          )
        }

        if (state.bkdPressed) {
          tempVector.set(0, 0, 1).applyAxisAngle(upVector, angle)
          player.position.addScaledVector(
            tempVector,
            Settings.playerSpeed * delta
          )
        }

        if (state.lftPressed) {
          tempVector.set(-1, 0, 0).applyAxisAngle(upVector, angle)
          player.position.addScaledVector(
            tempVector,
            Settings.playerSpeed * delta
          )
        }

        if (state.rgtPressed) {
          tempVector.set(1, 0, 0).applyAxisAngle(upVector, angle)
          player.position.addScaledVector(
            tempVector,
            Settings.playerSpeed * delta
          )
        }

        player.updateMatrixWorld()

        // adjust player position based on collisions
        const capsuleInfo = player.capsuleInfo
        tempBox.makeEmpty()
        tempMat.copy(collider.matrixWorld).invert()
        tempSegment.copy(capsuleInfo.segment)

        // get the position of the capsule in the local space of the collider
        tempSegment.start.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat)
        tempSegment.end.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat)

        // get the axis aligned bounding box of the capsule
        tempBox.expandByPoint(tempSegment.start)
        tempBox.expandByPoint(tempSegment.end)

        tempBox.min.addScalar(-capsuleInfo.radius)
        tempBox.max.addScalar(capsuleInfo.radius)

        collider.geometry.boundsTree.shapecast({
          intersectsBounds: (box) => box.intersectsBox(tempBox),

          intersectsTriangle: (tri) => {
            // check if the triangle is intersecting the capsule and adjust the
            // capsule position if it is.
            const triPoint = tempVector
            const capsulePoint = tempVector2

            const distance = tri.closestPointToSegment(
              tempSegment,
              triPoint,
              capsulePoint
            )
            if (distance < capsuleInfo.radius) {
              const depth = capsuleInfo.radius - distance
              const direction = capsulePoint.sub(triPoint).normalize()

              tempSegment.start.addScaledVector(direction, depth)
              tempSegment.end.addScaledVector(direction, depth)
            }
          },
        })

        // get the adjusted position of the capsule collider in world space after checking
        // triangle collisions and moving it. capsuleInfo.segment.start is assumed to be
        // the origin of the player model.
        //
        const newPosition = tempVector
        newPosition.copy(tempSegment.start).applyMatrix4(collider.matrixWorld)

        // check how much the collider was moved
        const deltaVector = tempVector2
        deltaVector.subVectors(newPosition, player.position)

        // if the player was primarily adjusted vertically we assume it's on something we should consider ground
        state.playerIsOnGround =
          deltaVector.y > Math.abs(delta * playerVelocity.y * 0.25)

        const offset = Math.max(0.0, deltaVector.length() - 1e-5)
        deltaVector.normalize().multiplyScalar(offset)

        // adjust the player model
        player.position.add(deltaVector)

        if (!state.playerIsOnGround) {
          //
          deltaVector.normalize()

          playerVelocity.addScaledVector(
            deltaVector,
            -deltaVector.dot(playerVelocity)
          )
        } else {
          playerVelocity.set(0, 0, 0)
        }

        // adjust the camera
        camera.position.sub(controls.target)
        controls.target.copy(player.position)
        camera.position.add(player.position)

        // if the player has fallen too far below the level reset their position to the start
        if (player.position.y < -25) {
          resetPlayer({ position: Settings.resetPosition })
          onSwitchCam(Settings.firstPerson)
        }
      }

      this.resetPlayer = resetPlayer

      new Introduction({
        api,
        container: renderer.domElement.parentElement,
        children: false,
      })

      loadColliderMap({
        // url: `gui/places/church/asset/heavenly-platforms1.glb`,
        url: Settings.mapURL,
        done: ({ mapScene, gltf }) => {
          api.onLoop((dt) => {
            doMainLoopLogic({ dt })
          })

          let mixer = new AnimationMixer(mapScene)
          api.onLoop((dt) => {
            mixer.update(dt)
          })
          gltf.animations.forEach((anim) => {
            //
            let action = mixer.clipAction(anim)
            action.play()
            //
          })

          resetPlayer({ position: Settings.resetPosition })
          onSwitchCam(Settings.firstPerson)

          new GameControls({
            api,
            container: renderer.domElement.parentElement,
            state: self.state,
            player,
            controls,
            toggleView: () => {
              Settings.toggleCam()
            },
          })
          player.visible = false

          new Overlay({
            api,
            self,
            container: renderer.domElement.parentElement,
          })

          let cleans = []
          let cleanAvatar = () => {
            cleans.forEach((c) => c())
          }

          let last = null
          api.onChange('myAvatarURL', (myAvatarURL) => {
            if (last !== myAvatarURL) {
              last = myAvatarURL

              cleanAvatar()

              let avaConfig = {
                api: api,
                // avatarURL: false,
                player: player,
                state: self.state,
                controls: controls,
                params: Settings,
                onDoneMyAvatar: onDoneMyAvatar || console.log,
              }

              if (myAvatarURL) {
                avaConfig.avatarURL = myAvatarURL
              } else {
                avaConfig.avatarURL = Settings.defaultAvatar
              }

              /*
            if (val.avatarURL) {
              api.now.myAvatarURL = val.avatarURL;
            } else {
              api.now.myAvatarURL = "";
            }
            */

              try {
                let avatar = new AvatarSkin(avaConfig)
                cleans.push(() => {
                  avatar.clean()
                })
              } catch (e) {
                console.log(e)
              }
            }
          })

          player.visible = true

          onDone({ mapScene: mapScene, api })

          api.now.loadingState = 'ready'

          if (Settings.firebaseConfig) {
            // new OnlineGame({
            //   config: Settings.firebaseConfig,
            //   api,
            //   player,
            //   Settings,
            //   onDoneMyAvatar: onDoneMyAvatar || (() => {}),
            //   mapURL: Settings.mapURL,
            //   self,
            // })

            new OnlinePop({
              container: renderer.domElement.parentElement,
              api,
              onDone: () => {
                new OnlineGame({
                  config: Settings.firebaseConfig,
                  api,
                  player,
                  Settings,
                  onDoneMyAvatar: onDoneMyAvatar || (() => {}),
                  mapURL: Settings.mapURL,
                  self,
                })
              },
            })
          } else {
          }
        },
      })
    }
    this.done = setup()
  }
}

MapGame.key = getID()
