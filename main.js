import './style.css'
import * as TWEEN from 'tween'
import * as THREE from 'three'
import jQuery from "jquery"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

window.$ = window.jQuery = jQuery;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
let firstLight;
let secondLight;
let thirdLight;
let heartMesh;
const loader = new THREE.TextureLoader();
document.body.appendChild(renderer.domElement);

function init() {
	scene.background = new THREE.Color('black');
	camera.position.set(0,10,15);
	camera.lookAt(0,10,0)
}

function setLight(){
	const hemiLight = new THREE.HemisphereLight (0xffffff, 0x8d8d8d, 1);
	hemiLight.position.set(0,0,1);
	scene.add(hemiLight);
	firstLight = new THREE.DirectionalLight(0xFFFFFF, 2);
	firstLight.position.set(-10,10,15);
	firstLight.castShadow=true;
	firstLight.shadow.camera.top=50;
	firstLight.shadow.camera.bottom=-20;
	firstLight.shadow.camera.left=-20;
	firstLight.shadow.camera.right=20;
	firstLight.shadow.camera.near=10;
	firstLight.shadow.camera.far=300;
	scene.add(firstLight);
}

function addCube(){
	const cubeGeometry = new THREE.BoxGeometry(1,1,1);
	const material = new THREE.MeshPhongMaterial({color:0x00ff00});
	const cube = new THREE.Mesh( cubeGeometry, material );
	cube.castShadow=true;
	cube.receiveShadow=false;
	scene.add(cube);
}

function addBackground(){
	const planeGeometry = new THREE.PlaneGeometry(10000,10000);
	loader.load('textures/painted_plaster_wall_diff_4k.jpg');
	const planeMaterial = new THREE.MeshPhongMaterial({
			color:0xFFFFFF,
			side: THREE.DoubleSide,
	});
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.position.z=-2;
	plane.receiveShadow=true;
	plane.castShadow=false;
	scene.add(plane);
}

function addGround(){
	const groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshPhongMaterial({color:0xFFFFFF, depthWrite:false, side:THREE.DoubleSide}));
	groundMesh.receiveShadow=true;
	groundMesh.rotation.x=-Math.PI/2;
	scene.add(groundMesh);

}

function loadGLTF(){
	let heartLoader = new GLTFLoader();
	const standardMaterial = new THREE.MeshPhongMaterial({
		color:0xFF0000,
	})
	heartLoader.load('models/heart.gltf', (gltf) => {
		const heartMesh = gltf.scene;
		heartMesh.position.x = 0;
		heartMesh.position.y = 1;
		heartMesh.position.z = 0;
		heartMesh.traverse((o) => {
			if(o.isMesh){
				o.material = standardMaterial;
				o.castShadow = true;
				o.receiveShadow = false;
			}
		});
	scene.add(heartMesh);
	new TWEEN.Tween(heartMesh.rotation)
		.to({y: "-"+(Math.PI)*6}, 6000)
		.start(),
	new TWEEN.Tween(heartMesh.position)
		.to({y:15}, 6000)
		.start()		
	})
}
function animate(){
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	TWEEN.update();
}




init();
setLight();
addBackground();
$.when(loadGLTF()).then(animate());
