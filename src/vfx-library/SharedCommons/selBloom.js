import {
  Clock,
  Color,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshMatcapMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  ShaderMaterial,
  sRGBEncoding,
  Vector2,
} from "three/build/three.module.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

let getSig = (uuid) => {
  return "done" + uuid;
};

let Settings = {
  bloomStrength: 0.5,
  bloomThreshold: 0.1,
  bloomRadius: 1.2,
  bloomCompositeMix: 1,
  bloomSatuationPower: 1,
};

export async function selBlooming({ api, fxaa = true, consoleStats = false }) {
  let proc = {
    render() {},
  };

  let GlobalUniforms = {
    globalBloom: { value: 0 },
    time: { value: 0 },
  };

  const params = {
    exposure: 1.0,
    bloomStrength: 1.7,
    bloomThreshold: 0.2,
    bloomRadius: 1.0,
  };

  let { renderer, gl, scene, camera } = api.now;
  renderer = renderer || gl;
  //https://jsfiddle.net/prisoner849/jm0vb71c/

  let clock = new Clock();
  // bloom /////////////////////////////////////////////////////////////////////////////////////////
  var renderScene = new RenderPass(scene, camera);
  var bloomPass = new UnrealBloomPass(
    new Vector2(window.innerWidth, window.innerHeight),
    Settings.bloomStrength,
    Settings.bloomRadius,
    Settings.bloomThreshold
  );
  bloomPass.threshold = params.bloomThreshold;
  bloomPass.strength = params.bloomStrength;
  bloomPass.radius = params.bloomRadius;

  var bloomComposer = new EffectComposer(renderer);
  bloomComposer.renderToScreen = false;
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);

  //

  var finalPass = new ShaderPass(
    new ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: bloomComposer.renderTarget2.texture },
      },
      vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
      `,
      fragmentShader: `
          uniform sampler2D baseTexture;
          uniform sampler2D bloomTexture;
          varying vec2 vUv;
          void main() {

            vec2 myUV = vec2(vUv.x, vUv.y);

            float bloomCompositeMix = ${Settings.bloomCompositeMix.toFixed(2)};
            float bloomSatuationPower = ${Settings.bloomSatuationPower.toFixed(
              2
            )};

            vec4 bloomColor = texture2D( bloomTexture, myUV );
            bloomColor.r = pow(bloomColor.r, bloomSatuationPower);
            bloomColor.g = pow(bloomColor.g, bloomSatuationPower);
            bloomColor.b = pow(bloomColor.b, bloomSatuationPower);

            gl_FragColor = ( texture2D( baseTexture, myUV ) * 1.0 + vec4( bloomCompositeMix, bloomCompositeMix, bloomCompositeMix, 1.0 ) * bloomColor );

            // gl_FragColor = mix( texture2D( baseTexture, vUv ), texture2D( bloomTexture, vUv ), 0.5 );
          }
        `,
      defines: {},
    }),
    "baseTexture"
  );
  finalPass.needsSwap = true;

  var finalComposer = new EffectComposer(renderer);
  finalComposer.addPass(renderScene);
  finalComposer.addPass(finalPass);
  //////////////////////////////////////////////////////////////////////////////////////////////////

  if (fxaa) {
    let fxaaPass = new ShaderPass(FXAAShader);
    finalComposer.addPass(fxaaPass);

    let size = new Vector2();
    renderer.getSize(size);
    fxaaPass.material.uniforms["resolution"].value.x = 1 / size.x;
    fxaaPass.material.uniforms["resolution"].value.y = 1 / size.y;
    api.onResize(() => {
      renderer.getSize(size);
      fxaaPass.material.uniforms["resolution"].value.x = 1 / size.x;
      fxaaPass.material.uniforms["resolution"].value.y = 1 / size.y;
    });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////

  let r = function () {
    var width = renderer.domElement.clientWidth;
    var height = renderer.domElement.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    bloomComposer.setSize(width, height);
    finalComposer.setSize(width, height);
  };

  window.addEventListener("resize", r);
  r();

  bloomComposer.renderTarget2.texture.encoding = sRGBEncoding;
  bloomComposer.renderTarget1.texture.encoding = sRGBEncoding;

  finalComposer.renderTarget1.texture.encoding = sRGBEncoding;
  finalComposer.renderTarget2.texture.encoding = sRGBEncoding;

  /////////////////////////////////////////////////////////////////////////////////////////////////

  let count = 0;
  let frame = 0;
  proc.render = () => {
    scene.traverse((it) => {
      if (
        it.material &&
        !it.userData.isSetupDone &&
        (it.material instanceof MeshStandardMaterial ||
          it.material instanceof MeshPhongMaterial ||
          it.material instanceof MeshBasicMaterial ||
          it.material instanceof MeshLambertMaterial ||
          it.material instanceof MeshMatcapMaterial ||
          it.material instanceof MeshPhysicalMaterial ||
          it.material instanceof MeshToonMaterial)
      ) {
        it.userData.isSetupDone = true;
        count++;
        makeMat({ GlobalUniforms, it });
      }
    });

    if (consoleStats) {
      if (frame % 60 === 0) {
        console.log(count);
      }
      frame++;
    }

    if (count == 0) {
      renderer.render(scene, camera);
    } else {
      let t = clock.getElapsedTime();
      GlobalUniforms.time.value = t;
      GlobalUniforms.globalBloom.value = 1;

      scene.traverse((it) => {
        if (it.isSprite) {
          it.visible = false;
        }
      });

      renderer.setClearColor(0x000000);
      bloomComposer.render();

      // global bloom = false
      GlobalUniforms.globalBloom.value = 0;
      scene.traverse((it) => {
        if (it.isSprite) {
          it.visible = true;
        }
      });
      renderer.setClearColor(0x000000);
      finalComposer.render();
    }
  };

  api.onClean(() => {
    count = 0;
  });

  api.onLoop(() => {
    proc.render();
  });
}

function makeMat({ GlobalUniforms, it }) {
  let m = it.material;

  let atBegin = `
    uniform float globalBloom;
    uniform float useBloom;
  `;

  let atEnd = `
    if (globalBloom == 1.0) {
      if (useBloom == 1.0) {
        float satPower = ${Settings.bloomSatuationPower.toFixed(2)};
        gl_FragColor = vec4(
          pow(gl_FragColor.r, satPower) * 0.45,
          pow(gl_FragColor.g, satPower) * 0.45,
          pow(gl_FragColor.b, satPower) * 0.45,
          gl_FragColor.a
        );
      } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      }
    }
  `;

  m.onBeforeCompile = (shader) => {
    shader.uniforms.globalBloom = GlobalUniforms.globalBloom;
    shader.uniforms.useBloom = {
      value: 0,
    };

    setInterval(() => {
      // if (m.emissive instanceof Color) {
      //   /** @type {Color} */
      //   let eColor = m.emissive;
      //   if (eColor) {
      //     if (eColor.r > 0 || eColor.g > 0 || eColor.b > 0) {
      //       shader.uniforms.useBloom.value = 1.0;
      //     }
      //   }
      // }

      if (it.userData.enableBloom) {
        shader.uniforms.useBloom.value = 1.0;
      }
      if (it.userData.enableDarken) {
        shader.uniforms.useBloom.value = 0.0;
      }
      if (it.userData.forceBloom) {
        shader.uniforms.useBloom.value = 1.0;
      }
    });

    shader.fragmentShader = `${atBegin.trim()}\n${shader.fragmentShader}`;
    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <dithering_fragment>`,
      `#include <dithering_fragment>\n${atEnd.trim()}`
    );
  };

  it.userData.____lastSig = getSig(it.uuid);
  m.customProgramCacheKey = () => {
    return getSig(it.uuid) + atEnd + atBegin;
  };

  m.needsUpdate = true;

  it.material = m;

  return m;
}
