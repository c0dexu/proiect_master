import * as THREE from 'three';
import { G_CONST, UNIT_AU, UNIT_MASS, UNIt_RADIUS } from '../constants.js';

// clasa planeta
export class Planet {
  sphereGeometry;
  planetMesh;
  material;
  parent; // parintele(soarele)
  mass; // masa
  radius; // raza
  gravitational_parameter;
  orbital_eccentricity;
  theta = 0; // unghiul orbital
  angular_velocity = 0; // viteza unghiulara
  semi_major = 0;
  period; // perioada orbitala
  speed; // biteaza orbitala
  distance; // distanta fata de soare
  obj3D = new THREE.Object3D();

  // in constructor se seteaza proprietatile fizice ale planetei
  constructor(
    scene,

    mass,
    radius,
    distance,
    text_path,
    parent = null,
    hasRings = false,
    info = null
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

    if (hasRings) {
      const planeGeometry = new THREE.BoxGeometry(
        this.radius * 8,
        0.1,
        this.radius * 8
      );

      const ringsMaterial = new THREE.MeshBasicMaterial({
        map: loader.load('./textures/planets/txt_saturn_rings.png'),
      });
      ringsMaterial.transparent = true;

      const planeMesh = new THREE.Mesh(planeGeometry, ringsMaterial);
      planeMesh.position.set(0, 0, 0);
      this.obj3D.add(planeMesh);
    }
    if (parent) {
      this.parent = parent;
      this.parent.planets.push(this);
      this.obj3D.add(this.planetMesh);
      this.parent.obj3D.add(this.obj3D);
    } else {
      scene.add(this.planetMesh);
      this.parent = {
        x: 0,
        y: 0,
        z: 0,
        mass: 10e10,
      };
    }

    this.planetMesh.position.set(0, 0, 0);

    this.period =
      Math.PI *
      2 *
      Math.sqrt(Math.pow(this.distance, 3) / (G_CONST * this.parent.mass));

    this.angular_velocity = (2 * Math.PI) / this.period;

    this.theta = Math.random() * Math.PI * 2;

    const orbitGeometry = new THREE.RingGeometry(
      this.distance - 1,
      this.distance + this.radius - 1,
      256
    );
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = -Math.PI / 2;
    this.parent.obj3D.add(orbit);
  }

  update(dt = 0.1) {
    this.obj3D.position.set(
      this.distance * Math.cos(this.theta),
      0,
      this.distance * Math.sin(this.theta)
    );
    this.theta += this.angular_velocity * dt;
  }
}
