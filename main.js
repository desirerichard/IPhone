import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

//Base
const canvas = document.querySelector("canvas.webgl");

//Scene
const scene = new THREE.Scene();

//Overlay
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
  vertexShader: `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
  `,
  fragmentShader: `
  uniform float uAlpha;
  void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
  }
  `,
  uniforms: {
    uAlpha: {
      value: 1.0,
    },
  },
  transparent: true,
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

//Loaders
const loadingManager = new THREE.LoadingManager(() => {
  window.setTimeout(() => {
    gsap.to(overlayMaterial.uniforms.uAlpha, {
      duration: 2,
      value: 0,
      delay: 1,
    });
  }, 500);
});

//GLTF Loader
let iphone = null;
const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.load("./assets/iphone/scene.gltf", (gltf) => {
  iphone = gltf.scene;

  iphone.position.x = 1;
  iphone.rotation.y = -1;
  iphone.rotation.z = 0;

  const radius = 10;
  iphone.scale.set(radius, radius, radius);
  scene.add(iphone);
});

//Scroll
const transformIphone = [
  {
    rotationZ: 0,
    positionX: 1,
    rotationY: -1,
  },
  {
    rotationZ: -0.45,
    positionX: -1.5,
    rotationY: 2,
  },
  {
    rotationZ: 0,
    positionX: 0,
    rotationY: -2.5,
  },
];

let scrollY = window.scrollY;
let currentSection = 0;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / sizes.height);

  if (newSection != currentSection) {
    currentSection = newSection;

    if (!!iphone) {
      gsap.to(iphone.rotation, {
        duration: 1.2,
        ease: "power2.inOut",
        z: transformIphone[currentSection].rotationZ,
        y: transformIphone[currentSection].rotationY,
      });
      gsap.to(iphone.position, {
        duration: 1.2,
        ease: "power2.inOut",
        x: transformIphone[currentSection].positionX,
      });
    }
  }
});

//On Reload
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 5;
scene.add(camera);

//Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 5, 0);

scene.add(directionalLight);

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Animate
const clock = new THREE.Clock();
let lastElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const delaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;

  if (!!iphone) {
    iphone.position.y = Math.sin(elapsedTime * 0.5) * 0.1 - 0.1;
  }
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

//Texts Animation
const el2 = document.querySelector("#box2");
gsap.fromTo(
  el2,
  { opacity: 0 },
  {
    opacity: 1,
    duration: 1.3,
    delay: 0.8,
    scrollTrigger: {
      trigger: el2,
      scroller: "body",
    },
  }
);

const el3 = document.querySelector("#box3");
gsap.fromTo(
  el3,
  { opacity: 0 },
  {
    opacity: 1,
    duration: 1.3,
    delay: 0.8,
    scrollTrigger: {
      trigger: el3,
      scroller: "body",
      scrub: false,
    },
  }
);
