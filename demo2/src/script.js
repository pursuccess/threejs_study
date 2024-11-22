import './style.css';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 定义渲染尺寸
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// 初始化渲染器
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 初始化场景
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xffffff);
scene.fog = new THREE.Fog(0x1A1A1A, 1, 1000);

// 初始化相机
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(10, 100, 450);
scene.add(camera);

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 添加环境光
const light = new THREE.AmbientLight(0x00ffff, 1.5);
scene.add(light);

// 创建星球
const SphereMaterial = new THREE.MeshLambertMaterial({
  color: 0x03c03c,
  wireframe: true,
});
const SphereGeometry = new THREE.SphereGeometry(80, 32, 32);
const planet = new THREE.Mesh(SphereGeometry, SphereMaterial);
scene.add(planet);

// 创建星球轨道环
const TorusGeometry = new THREE.TorusGeometry(350, 0.3, 2, 120);
const TorusMaterial = new THREE.MeshLambertMaterial({
  color: 0x40a9ff,
});
const ring = new THREE.Mesh(TorusGeometry, TorusMaterial);
ring.rotation.x = Math.PI / 2;
// ring.rotation.y = -0.1 * (Math.PI / 2);
scene.add(ring);

// 创建卫星
const IcoGeometry = new THREE.IcosahedronGeometry(6, 10);
const IcoMaterial = new THREE.MeshLambertMaterial({
  color: 0x03c03c,
  wireframe: true,
});
const satellite = new THREE.Mesh(IcoGeometry, IcoMaterial);
scene.add(satellite);
// 创建卫星轨道环
const TorusGeometrySatellite = new THREE.TorusGeometry(20, 2, 2, 60);
const TorusMaterialSatellite = new THREE.MeshLambertMaterial({
  color: 0x40a9ff,
  wireframe: true
});
const ringSatellite = new THREE.Mesh(TorusGeometrySatellite, TorusMaterialSatellite);
ringSatellite.rotation.x = Math.PI / 2;
ringSatellite.rotation.y = -0.1 * (Math.PI / 2);
scene.add(ringSatellite);

// 创建星星
const stars = new THREE.Group();
for (let i = 0; i < 500; i++) {
  const geometry = new THREE.IcosahedronGeometry(Math.random() * 2, 0);
  const material = new THREE.MeshToonMaterial({ color: 0xeeeeee });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (Math.random() - 0.5) * 700;
  mesh.position.y = (Math.random() - 0.5) * 700;
  mesh.position.z = (Math.random() - 0.5) * 700;
  mesh.rotation.x = Math.random() * 2 * Math.PI;
  mesh.rotation.y = Math.random() * 2 * Math.PI;
  mesh.rotation.z = Math.random() * 2 * Math.PI;
  stars.add(mesh);
}
scene.add(stars);

// 页面缩放事件监听
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // 更新渲染
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // 更新相机
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});

// 动画
let rot = 0;
// 动画
const axis = new THREE.Vector3(0, 0, 1);
const tick = () => {
  // 更新渲染器
  renderer.render(scene, camera);
  // 给网格模型添加一个转动动画
  rot += 0.3;
  const radian = (rot * Math.PI) / 180;
  // 星球位置动画
  planet && (planet.rotation.y += .005);
  // 星球轨道环位置动画
  ring && ring.rotateOnAxis(axis, Math.PI / 400);

  // 卫星位置动画
  satellite.position.x = 350 * Math.sin(radian);
  satellite.position.z = -350 * Math.cos(radian);
  satellite.rotation.y += 0.005;

  // 卫星轨道位置动画
  ringSatellite.position.x = 350 * Math.sin(radian);
  ringSatellite.position.z = -350 * Math.cos(radian);

  // 星星动画
  stars.rotation.y += 0.0009;
  stars.rotation.z -= 0.0003;
  // 更新控制器
  controls.update();
  // 页面重绘时调用自身
  window.requestAnimationFrame(tick);
}
tick();

