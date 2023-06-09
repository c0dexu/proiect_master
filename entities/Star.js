import * as THREE from 'three';

import { UNIT_AU, UNIT_MASS, UNIt_RADIUS } from '../constants.js';

export class Star {
  mass;
  radius;
  sphereGeometry;
  starMesh;
  material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  luminosity;
  lightSource = new THREE.PointLight(0xffffff, UNIT_AU);
  x;
  y;
  z;
  planets = [];
  obj3D = new THREE.Object3D();
  constructor(scene, x, y, z, mass, radius) {
    this.sphereGeometry = new THREE.SphereGeometry(radius, 16, 16);
    this.starMesh = new THREE.Mesh(this.sphereGeometry, this.material);
    this.mass = mass * UNIT_MASS;
    this.radius = radius * UNIt_RADIUS;
    this.obj3D.add(this.starMesh);
    scene.add(this.obj3D);

    this.lightSource.position.set(x, y, z);
    this.starMesh.position.x = x;
    this.starMesh.position.y = y;
    this.starMesh.position.z = z;
  }

  update(dt = 0.01) {
    this.planets.forEach((planet) => {
      planet.update(dt);
    });
  }
}
