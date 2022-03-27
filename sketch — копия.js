// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#000", 0);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(-1, -1, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();
/*
  // Setup a geometry
  const geometryq = new THREE.SphereGeometry(1.25, 32, 16);

  // Setup a material
  const materialq = new THREE.MeshBasicMaterial({
    color: "red",
    wireframe: true
  });

  // Setup a mesh with geometryq + materialq
  const meshq = new THREE.Mesh(geometryq, materialq);
  scene.add(meshq);
*/


const geometry = new THREE.IcosahedronGeometry(1,4);
//const geometry3 = new THREE.SphereGeometry(1, 32, 16);

		//console.log(geometry3.rotateY)

const material = new THREE.MeshBasicMaterial({
    color: "#2359bb",
    wireframe: true
  });
const mesh = new THREE.Mesh(geometry,material);
scene.add(mesh);

const geo2=      new THREE.IcosahedronGeometry(1,1);
const circ=      new THREE.CircleGeometry(1,24);
const pnts=geometry.vertices;
pnts.forEach(point=>{
	const mesh = new THREE.Mesh(
		circ,
		new THREE.MeshBasicMaterial({
			color:'#2359bb',
			/*side:THREE.DoubleSide,*/
			side:THREE.BackSide,
			/*wireframe:true*/
		}));
	mesh.position.set(point);
	mesh.scale.setScalar(1);
	mesh.lookAt(new THREE.Vector3());
	scene.add(mesh)
})

/*! Earth */
/*var Shaders = {
	'earth' : {
		uniforms: {
			"texture": { type: "t", value: 0, texture: null }
		},
		vertexShader: `
			varying vec3 vNormal;
			varying vec2 vUv;
			void main() {
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				vNormal = normalize( normalMatrix * normal );
				vUv = uv;
			}`,

		fragmentShader: `
			uniform sampler2D texture;
			varying vec3 vNormal;
			varying vec2 vUv;
			void main() {
				vec3 diffuse = texture2D( texture, vUv ).xyz;
				float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );
				vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );
				gl_FragColor = vec4( diffuse + atmosphere, 1.0 );
			}`

	}

};*/
let pointsGeometry,point,
	geometryZ1 = new THREE.BoxGeometry( 0.75, 0.75, 1 );
	console.log(geometryZ1)
	for ( var i = 0; i < geometryZ1.vertices.length; i ++ ) {
		var vertex = geometryZ1.vertices[ i ];
		vertex.z += 0.5;
		//console.log(vertex.z)
	}

point = new THREE.Mesh( geometryZ1 );
pointsGeometry = new THREE.Geometry();

function plotData() {

	var lat, lng, size, color;

	points = new THREE.Mesh( pointsGeometry, new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } ) );
	
	fetch('data.json').then(d=>d.json()).then(data=>{
		data.forEach(point=>{
	const mesh = new THREE.Mesh(
		
		new THREE.CircleGeometry(1,24),
		new THREE.MeshBasicMaterial({
			color:'#2359bb',
			/*side:THREE.DoubleSide,*/
			side:THREE.BackSide,
			/*wireframe:true*/
		}));
	mesh.position.copy(point);
	mesh.scale.setScalar(0.02);
	mesh.lookAt(new THREE.Vector3());
	//scene.add(mesh)
})
	})
}
plotData();

/*! \ Earth */

//ROTATION

/*
// You already had this part
var geometry = new THREE.IcosahedronGeometry(10, 1);
var material = new THREE.MeshBasicMaterial({
    color: "#FFF",
    wireframe: true
});

var isoMesh = new THREE.Mesh(geometry, material);
scene.add(isoMesh);

// Add your circles directly to the scene
var nodes = [];
for(var i = 0, l = geometry.vertices.length; i < l; ++i){
  nodes.push(new THREE.Mesh(new THREE.CircleGeometry(1, 32), material));
  scene.add(nodes[nodes.length - 1]);
}

// This is called in render. Get the world positions of the vertices and apply them to the circles.
var tempVector = new THREE.Vector3();
function updateVertices(){
    if(typeof isoMesh !== "undefined" && typeof nodes !== "undefined" && nodes.length === isoMesh.geometry.vertices.length){
    //isoMesh.rotation.x += 0.005;
    isoMesh.rotation.y += 0.002;
    for(var i = 0, l = nodes.length; i < l; ++i){
      tempVector.copy(isoMesh.geometry.vertices[i]);
      nodes[i].position.copy(isoMesh.localToWorld(tempVector));
      nodes[i].lookAt(camera.position);
    }
  }
}*/

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
		//meshq.rotation.y=time/4;
		//updateVertices()
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

const dd=document;
const ds=function(e){dd.querySelector(e)};

dd.body.setAttribute('style','background-color:#280f75')

canvasSketch(sketch, settings);
