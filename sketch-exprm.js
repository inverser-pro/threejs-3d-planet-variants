// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");
// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");
require('three/examples/js/utils/BufferGeometryUtils');


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
    const camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 3, 0, 3 );
    //camera.lookAt(new THREE.Vector3());

    // Setup camera controller
    const controls = new THREE.OrbitControls(camera, context.canvas);

    // Setup your scene
    const scene = new THREE.Scene();

    //var scene = new THREE.Scene();
    //var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 50);
    /*var renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setClearColor(0x404040);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);*/

    //var controls = new THREE.OrbitControls(camera, renderer.domElement);
    var grid = new THREE.GridHelper(40, 40, "white", "gray");
    grid.rotation.x = Math.PI * -0.5;
    scene.add(grid);

    var curve = new THREE.EllipseCurve(0, 0, 20, 20, 0, Math.PI * 2, false, 0);

// using of .getPoints(division) will give you a set of points of division + 1
// so, let's get the points manually :)
    var count = 10;
    var inc = 1 / count;
    var pointAt = 0;
    var points = [];
    for (let i = 0; i < count; i++) {
        let point = curve.getPoint(pointAt); // get a point of THREE.Vector2()
        point.z = 0; // geometry needs points of x, y, z; so add z
        point.pointAt = pointAt; // save position along the curve in a custom property
        points.push(point);
        pointAt += inc; // increment position along the curve for next point
    }
    var pointsGeom = new THREE.Geometry();
    pointsGeom.vertices = points;


    var pointsObj = new THREE.Points(pointsGeom, new THREE.PointsMaterial({
        size: 1,
        color: "aqua"
    }));
    scene.add(pointsObj);

    var clock = new THREE.Clock();
    var time = 0;

    /*render();

    function render() {

        renderer.render(scene, camera);
    }*/



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

  
  var halfWidth = window.innerWidth/2, halfHeight = window.innerHeight/2;

function update(){
   camera.position.x += ( mouseX - camera.position.x ) * 0.05;
   camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
   camera.lookAt( scene.position );

   mesh.rotation.y -= 0.005;

   renderer.render( scene, camera );
}


  function render() {



      requestAnimationFrame(render);
      time = clock.getDelta();
      points.forEach(p => {
          p.pointAt = (p.pointAt + time / 0.5) % 1; // it always will be from 0 to 1
          curve.getPoint(p.pointAt, p); //re-using of the current point
      });
      pointsGeom.verticesNeedUpdate = true;





      requestAnimationFrame(render);

      
    renderRequested = undefined;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update();
    renderer.render(scene, camera);
    
    //EFFECTS
    //composer.render(scene, camera);
  }
  render();

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

dd.body.setAttribute('style','background-color:#161831');

/*
const el=dd.createElement('div');
el.style='position:fixed;z-index:99;top:0;right:0;width:200px;height:200px;background-color:red'
dd.body.appendChild(el);
*/

canvasSketch(sketch, settings);
