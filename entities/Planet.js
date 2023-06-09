import * as THREE from 'three';
import { G_CONST, UNIT_AU, UNIT_MASS, UNIt_RADIUS } from '../constants.js';

export class Planet {
  sphereGeometry;
  planetMesh;
  material;
  parent;
  mass;
  radius;
  gravitational_parameter;
  orbital_eccentricity;
  theta;
  p;
  isOrbitDisplayed = false;
  r;
  angular_velocity = 0;
  semi_major = 0;
  period;
  speed;
  distance;

  constructor(
    scene,

    mass,
    radius,
    distance,
    text_path,
    parent = null
  ) {
    this.distance = distance;
    this.mass = mass;
    this.radius = radius;
    this.sphereGeometry = new THREE.SphereGeometry(this.radius, 16, 16);

    const loader = new THREE.TextureLoader();

    this.material = new THREE.MeshBasicMaterial({
      map: loader.load(`./textures/planets/${text_path}`),
    });

    this.planetMesh = new THREE.Mesh(this.sphereGeometry, this.material);

    if (parent) {
      this.parent = parent;
      this.parent.planets.push(this);
      this.parent.obj3D.add(this.planetMesh);
    } else {
      scene.add(this.planetMesh);
      this.parent = {
        x: 0,
        y: 0,
        z: 0,
        mass: 10e10,
      };
    }

    this.planetMesh.position.set(this.distance, 0, 0);

    this.period =
      Math.PI *
      2 *
      Math.sqrt(Math.pow(this.distance, 3) / (G_CONST * this.parent.mass));

    this.angular_velocity = (2 * Math.PI) / this.period;
  }

  update(dt = 0.016) {
    this.planetMesh.position.set(
      this.distance * Math.cos(this.theta),
      0,
      this.distance * Math.sin(this.theta)
    );
    theta += this.angular_velocity * dt;
  }
}
