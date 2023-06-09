import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { UNIT_AU, UNIT_MASS, UNIt_RADIUS } from './constants.js';
import { Star } from './entities/Star.js';

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGL1Renderer({ antialias: true, canvas });

const fov = 75;
const aspect = 2; // the canvas default
const near = 0.1;
const far = UNIT_AU;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const scene = new THREE.Scene();

let dx = 0;
let dy = 0;
let prev_x = 0;
let prev_y = 0;
let isClicked = false;
let phi = 0;
let theta = 0;
let spd_factor = 0.25;
let speed = UNIT_AU * spd_factor;
let direction = new THREE.Vector3();
let camera_radius = UNIT_AU / 2;
let v_theta = 0;
let v_phi = 0;
let isShift = false;
let isSpace = false;
let isForward = false;
let isBackward = false;

document.addEventListener('keydown', (event) => {
  switch (event.keyCode) {
    case 32:
      isSpace = true;
      break;
    case 16:
      isShift = true;
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.keyCode) {
    case 32:
      isSpace = false;
      break;
    case 16:
      isShift = false;
      break;
  }
});

document.addEventListener('mousedown', () => {
  isClicked = true;
});

document.addEventListener('mouseup', () => {
  isClicked = false;
});

document.addEventListener('mousemove', (event) => {
  dx = prev_x - event.clientX;
  dy = prev_y - event.clientY;
  prev_x = event.clientX;
  prev_y = event.clientY;

  if (isClicked) {
    theta = dx * (Math.PI / 256);
    phi = dy * (Math.PI / 256);

    camera.rotation.y += theta;
    camera.rotation.x += phi;
  }
});

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

const sun = new Star(scene, 0, 0, -UNIT_AU, UNIT_MASS * 1000, UNIt_RADIUS);

console.log(scene);

function render(time) {
  time *= 0.001;

  renderer.render(scene, camera);

  if (isShift) {
    camera.position.y -= 0.1;
  }

  if (isSpace) {
    camera.position.y += 0.1;
  }

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
