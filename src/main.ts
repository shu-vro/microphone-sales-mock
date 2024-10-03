import "./style.css";
import * as THREE from "three";
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// @ts-ignore
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
// @ts-ignore
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
// @ts-ignore
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { gsap } from "gsap";

const camera = new THREE.PerspectiveCamera(
    10,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 13;

const scene = new THREE.Scene();
let headphone: THREE.Object3D | null = null;
let pivot: THREE.Object3D = new THREE.Object3D();
let pos = {
    hero: {
        translate: {
            x: 1.2,
            y: -0.3,
            z: 0,
        },
        scale: {
            x: 0.4,
            y: 0.4,
            z: 0.4,
        },
        rotate: {
            x: -0.1,
            y: -1.2372974307213884,
            z: -0.2,
        },
    },
    "hero-text": {
        // translate: [0, 0, 0],
        // rotate: [0, 0, 0],
        // scale: [0.3, 0.3, 0.3],
        translate: {
            x: 1.2,
            y: -0.5,
            z: 0,
        },
        scale: {
            x: 0.32,
            y: 0.32,
            z: 0.32,
        },
        rotate: {
            x: 0,
            y: 0,
            z: 0,
        },
    },
    spec: {
        translate: {
            x: 0.9,
            y: -0.5,
            z: 0,
        },
        scale: {
            x: 0.2,
            y: 0.2,
            z: 0.2,
        },
        rotate: {
            x: 0,
            y: 0,
            z: 0,
        },
    },
    "superior-sound-quality": {
        translate: {
            x: 1.2,
            y: -0.3,
            z: 0,
        },
        scale: {
            x: 0.18,
            y: 0.18,
            z: 0.18,
        },
        rotate: {
            x: 0,
            y: 1.1,
            z: 0.2,
        },
    },
    "comfortable-for-long-sessions": {
        translate: {
            x: -0.8,
            y: -0.4,
            z: 0,
        },
        scale: {
            x: 0.15,
            y: 0.15,
            z: 0.15,
        },
        rotate: {
            x: Math.PI / -2,
            y: Math.PI / 4,
            z: 0.2,
        },
    },
    "ambient-noise-isolation": {
        translate: {
            x: 2.6,
            y: 1.9,
            z: 0,
        },
        scale: {
            x: 0.4,
            y: 0.4,
            z: 0.4,
        },
        rotate: {
            x: Math.PI / -2,
            y: -Math.PI / 4,
            z: 0.4,
        },
    },
    "led-lighting-for-gaming-atmosphere": {
        translate: {
            x: -0.9,
            y: -2,
            z: 0,
        },
        scale: {
            x: 0.36,
            y: 0.36,
            z: 0.36,
        },
        rotate: {
            x: Math.PI / -4,
            y: Math.PI / 2,
            z: 0,
        },
    },
    durability: {
        translate: {
            x: -0.3,
            y: -1.6,
            z: 0,
        },
        scale: {
            x: 0.26,
            y: 0.26,
            z: 0.26,
        },
        rotate: {
            x: 0,
            y: Math.PI / -4,
            z: -Math.PI / 2,
        },
    },
    "easy-controls": {
        translate: {
            x: -0.4,
            y: -0.5,
            z: 0,
        },
        scale: {
            x: 0.16,
            y: 0.16,
            z: 0.16,
        },
        rotate: {
            x: 0,
            y: Math.PI / 8,
            z: 0,
        },
    },
};

const loader = new GLTFLoader();

const baseUrl = import.meta.env.BASE_URL;
loader.load(
    // "../assets/headphones_hp.glb",
    `${baseUrl}assets/headphones_hp.glb`,
    (gltf: any) => {
        headphone = gltf.scene as THREE.Object3D;
        // pos.hero.scale get the values of the object
        headphone.scale.set(
            pos.hero.scale.x,
            pos.hero.scale.y,
            pos.hero.scale.z
        );
        gsap.to(headphone.rotation, {
            ...pos.hero.rotate,

            duration: 1,
            ease: "power1.inOut",
        });

        // Reposition the model so that its center is at the origin
        // headphone.position.x -= center.x - 1;
        // headphone.position.y -= center.y;
        // headphone.position.z -= center.z;
        gsap.to(headphone.position, {
            // reposition smoothly
            ...pos.hero.translate,

            duration: 1,
            ease: "power1.inOut",
        });

        const cubeTextureLoader = new THREE.CubeTextureLoader();
        const environmentMap = cubeTextureLoader.load([
            `${baseUrl}assets/Bridge2/posx.jpg`,
            `${baseUrl}assets/Bridge2/negx.jpg`,
            `${baseUrl}assets/Bridge2/posy.jpg`,
            `${baseUrl}assets/Bridge2/negy.jpg`,
            `${baseUrl}assets/Bridge2/posz.jpg`,
            `${baseUrl}assets/Bridge2/negz.jpg`,
        ]);

        // Apply the environment map to the material
        headphone.traverse((child: any) => {
            if (child.isMesh) {
                renderer.setClearColor(0x000000);
                child.material.envMap = environmentMap;
                child.material.needsUpdate = true;
                renderer.setClearColor(0x020202);
            }
        });
        // Add the model to the pivot
        pivot.add(headphone);

        // Add the pivot to the scene
        scene.add(pivot);
    },
    undefined,
    (error: any) => {
        console.log(error);
    }
);
// Controls

const renderer = new THREE.WebGLRenderer({ alpha: true });
// var renderTarget = new THREE.WebGLRenderTarget(
//     window.innerWidth,
//     window.innerHeight,
//     {
//         minFilter: THREE.LinearFilter,
//         magFilter: THREE.LinearFilter,
//         format: THREE.RGBAFormat,
//         stencilBuffer: false,
//     }
// );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.getElementById("canvas")!.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// // light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const topLight = new THREE.DirectionalLight(0xffffff, 0.1);
topLight.position.set(5, 5, 5);
scene.add(topLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(-2, 2, -2);
scene.add(pointLight);

// add light and axes helpers
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
// const lightHelper = new THREE.DirectionalLightHelper(topLight);
// scene.add(lightHelper);
// const pointLightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(pointLightHelper);

// Set up post-processing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.5, // strength
    0.2, // radius
    0.0 // threshold
);
composer.addPass(bloomPass);

const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    // renderer.render(scene, camera);
    composer.render();
    // log orbit control's rotation of the object
    // console.log(camera.rotation);
    // Rotate the pivot object
    // pivot.rotation.y += 0.005;
};

animate();

window.onresize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

window.onscroll = () => {
    let selected: keyof typeof pos | undefined;
    document.querySelectorAll("section").forEach((el) => {
        const box = el.getBoundingClientRect();

        // if (box.top < window.innerHeight / 3 && box.top > 0) {
        //     selected = el.id as keyof typeof pos;
        // }
        if (box.top - box.height + window.innerHeight / 3 < 0) {
            selected = el.id as keyof typeof pos;
        }
    });

    if (!selected) return;

    let selectedPos = pos[selected];
    // console.log(selectedPos);

    if (!selectedPos || !headphone) return;

    gsap.to(headphone!.rotation, {
        duration: 1,
        ease: "power1.inOut",
        ...selectedPos["rotate"],
        // position: selectedPos["translate"],
        // scale: selectedPos["scale"],
    });
    gsap.to(headphone!.position, {
        duration: 1,
        ease: "power1.inOut",
        ...selectedPos["translate"],
        // position: selectedPos["translate"],
        // scale: selectedPos["scale"],
    });
    gsap.to(headphone!.scale, {
        duration: 1,
        ease: "power1.inOut",
        ...selectedPos["scale"],
        // position: selectedPos["translate"],
        // scale: selectedPos["scale"],
    });
};
