import { useGLTF } from "@react-three/drei";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";

import { DirectionalLight, Vector2 } from "three";
import { EffectComposer, RenderPass, UnrealBloomPass } from "three-stdlib";

export function JustBloom() {
  let { get } = useThree();

  //
  let render = useRef(() => {});
  useEffect(() => {
    let camera = get().camera;
    let renderer = get().gl;
    let effectComposer = new EffectComposer(renderer);
    let renderPass = new RenderPass(get().scene, camera);
    renderPass.renderToScreen = false;
    effectComposer.renderToScreen = true;

    effectComposer.addPass(renderPass);
    let size = new Vector2(window.innerWidth, window.innerHeight);
    size.multiplyScalar(1.0);

    let bloomPass = new UnrealBloomPass(size, 3, 1, 0.5);
    effectComposer.addPass(bloomPass);

    bloomPass.renderToScreen = true;
    //
    render.current = () => {
      effectComposer.render();
    };

    // let dirLight = new DirectionalLight(0xffffff, 10);
    // dirLight.position.y = 10;

    window.addEventListener("magnet", ({ detail: { type, percentage } }) => {
      //
      bloomPass.strength = (percentage + 0.1) * 3.0;
      // dirLight.intensity = (percentage + 0.1) * 300.0;
      // dirLight.
    });
  }, []);

  useFrame(({}) => {
    render.current();
  }, 10000);

  return (
    <group>
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
    </group>
  );
}
