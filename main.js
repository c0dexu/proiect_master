import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { UNIT_AU, UNIT_MASS, UNIt_RADIUS } from './constants.js';
import { Star } from './entities/Star.js';
import { Planet } from './entities/Planet.js';
import GUI from './node_modules/lil-gui/dist/lil-gui.esm.js';

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGL1Renderer({ antialias: true, canvas });

const fov = 75;
const aspect = 2; // the canvas default
const near = 0.1;
const far = UNIT_AU * 40;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const scene = new THREE.Scene();

let dx = 0;
let dy = 0;
let prev_x = 0;
let prev_y = 0;
let isClicked = false;
let phi = 0;
let theta = 0;
let spd_factor = 0.015;
let speed = UNIT_AU * spd_factor;
let camera_radius = UNIT_AU / 2;
let v_theta = 0;
let v_phi = 0;
let isShift = false;
let isSpace = false;
let isForward = false;
let isBackward = false;
let dt = 1;

const properties = {
  mScaleFactor: spd_factor,
  deltaTime: dt,
};

const gui = new GUI(); // gui utilizat pt controlul camerei si timpului

gui.add(properties, 'mScaleFactor', 0, 1).onChange((value) => {
  spd_factor = value;
  console.log(spd_factor);
});

gui.add(properties, 'deltaTime', 0.1, 10e5).onChange((value) => {
  dt = value;
  console.log(spd_factor);
});

document.addEventListener('keydown', (event) => {
  switch (event.keyCode) {
    case 32:
      isSpace = true;
      break;
    case 16:
      isShift = true;
      break;
  }

  if (event.keyCode === 87) {
    isForward = true;
  }

  if (event.keyCode === 83) {
    isBackward = true;
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

  if (event.keyCode === 87) {
    isForward = false;
  }

  if (event.keyCode === 83) {
    isBackward = false;
  }
});

document.addEventListener('mousedown', () => {
  isClicked = true;
});

document.addEventListener('mouseup', () => {
  isClicked = false;
});

// event pt calcularea rotatiei camerei
document.addEventListener('mousemove', (event) => {
  dx = prev_x - event.clientX; // se calcueaza diferenta de pozitii dintre pozitia finala si cea initiala
  dy = prev_y - event.clientY;
  prev_x = event.clientX;
  prev_y = event.clientY;

  if (isClicked) {
    theta = dx * (Math.PI / 256); // ea este utilizata pt a sti cat de mult se roteste camera
    phi = dy * (Math.PI / 256);

    camera.rotation.y += theta; // aplica rotatia
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

// se genereaza sistemul solar
const sun = new Star(scene, 0, 0, 0, UNIT_MASS * 1000, UNIt_RADIUS * 10);

sun.obj3D.position.set(UNIT_AU / 2, 0, 0);

const earth = new Planet(
  scene,
  UNIT_MASS,
  UNIt_RADIUS,
  UNIT_AU,
  'text_earth.jpg',
  sun,
  false,
  {
    name: 'Earth',
  }
);

const mercury = new Planet(
  scene,
  UNIT_MASS,
  UNIt_RADIUS * 0.382,
  UNIT_AU * 0.39,
  'text_mercury.jpg',
  sun
);

const venus = new Planet(
  scene,
  UNIT_MASS,
  UNIt_RADIUS * 0.8,
  UNIT_AU * 0.72,
  'text_venus.jpg',
  sun
);

const mars = new Planet(
  scene,
  UNIT_MASS,
  UNIt_RADIUS * 0.53,
  UNIT_AU * 1.52,
  'text_mars.jpg',
  sun
);

const jupiter = new Planet(
  scene,
  UNIT_MASS,
  UNIt_RADIUS * 11,
  UNIT_AU * 5.2,
  'text_jupiter.jpg',
  sun
);

const saturn = new Planet(
  scene,
  UNIT_MASS,
  UNIt_RADIUS * 9.45,
  UNIT_AU * 9.58,
  'text_saturn.jpg',
  sun,
  true
);

const uranus = new Planet(
  scene,
  UNIT_MASS,
  UNIt_RADIUS * 4,
  UNIT_AU * 19,
  'text_uranus.jpg',
  sun,
  false
);

const neptune = new Planet(
  scene,
  UNIT_MASS,
  UNIt_RADIUS * 3.88,
  UNIT_AU * 30.07,
  'text_neptune.jpg',
  sun,
  false
);

const pluto = new Planet(
  scene,
  UNIT_MASS,
  UNIt_RADIUS * 0.18,
  UNIT_AU * 39.48,
  'text_pluto.jpg',
  sun,
  false
);

// functia de afisare obiecte grafice
function render(time) {
  time *= 0.001;

  renderer.render(scene, camera);

  if (isShift) {
    camera.position.y -= 5;
  }

  if (isSpace) {
    camera.position.y += 5;
  }

  sun.update(dt);

  let direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  let xdir = direction.x;
  let ydir = direction.y;
  let zdir = direction.z; // calculeaza directia camerei

  if (isBackward) {
    // daca se apasa S, se misca inapoi
    xdir *= -1;
    ydir *= -1;
    zdir *= -1;
  }

  // update la pozitia camerei

  if (isForward || isBackward) {
    camera.position.x += xdir * UNIT_AU * spd_factor;
    camera.position.y += ydir * UNIT_AU * spd_factor;
    camera.position.z += zdir * UNIT_AU * spd_factor;
  }

  // functie folosite pt responsive

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
