

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");
// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");
require('three/examples/js/utils/BufferGeometryUtils');
require('three/examples/js/postprocessing/EffectComposer');
require('three/examples/js/postprocessing/GlitchPass');
require('three/examples/js/shaders/DigitalGlitch');
require('three/examples/js/shaders/CopyShader');
require('three/examples/js/postprocessing/ShaderPass');
require('three/examples/js/postprocessing/RenderPass');

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
  const camera = new THREE.PerspectiveCamera(18, 1/*window.innerWidth / window.innerHeight*/, 0.01, 100);
  camera.position.set(9,5,-3);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();


    /*!Add geom sphere*/
    
    const loader=new THREE.TextureLoader();
    
    const geometry = new THREE.IcosahedronGeometry(1.06,2);
    //const material = new THREE.MeshStandardMaterial({
    const material = new THREE.MeshPhongMaterial({
    //const material = new THREE.MeshBasicMaterial({
        color: 0x2359bb,
        wireframe: true,
        side:THREE.DoubleSide,
        ambient: 0xff0000,
        specular: 0x2359bb,
        shininess: 20,
        shading: THREE.SmoothShading
      });
    const mesh = new THREE.Mesh(geometry,material);
    scene.add(mesh);
        /*Add circles to geom shere*/
        const circ=      new THREE.CircleGeometry(1,12);
        const pnts=geometry.vertices;
        //const texture=loader.load('color-.jpg')
        pnts.forEach(point=>{
            const mesh = new THREE.Mesh(
                circ,
                //new THREE.MeshStandardMaterial({
                //new THREE.MeshBasicMaterial({
                //new THREE.MeshPhongMaterial({
                    //color:0x0064B9,
                    //map:texture,
                    /*side:THREE.DoubleSide,*/
                    //side:THREE.BackSide,
                    //wireframe:true
                    /*ambient: 0x555555,
                        color: 0x555555,
                        specular: 0xffffff,
                        side:THREE.DoubleSide,
                        shininess: 50,
                        shading: THREE.SmoothShading*/
                //}));
                
                new THREE.MeshPhongMaterial({
                    color:0x0064B9,
                    side:THREE.BackSide,
                    //ambient: 0x555555,
                    specular: 0x0064B9,
                    shininess: 1,
                    shading: THREE.SmoothShading
                }));
                
            mesh.position.copy(point);
            mesh.scale.setScalar(0.03);
            mesh.lookAt(new THREE.Vector3());
            scene.add(mesh)
        });
        /* \ Add circles to geom shere*/
    /*! \ Add geom sphere*/
    /*! Add lights*/
        
        const light=new THREE.DirectionalLight(0xffffff,1);
        //light.position.copy(camera.position);
        light.position.set(0,3,0);
        //light.lookAt(camera.position)
        scene.add(light);
        
        //const aLight= new THREE.AmbientLight(0xff0000);
        const aLight=new THREE.DirectionalLight(0x301D5D,2);
        aLight.position.set(0,-3,0);
        scene.add(aLight);
        
    /*! \ Add ligths*/

  /*{
    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/world.jpg');
    const geometry = new THREE.SphereBufferGeometry(1, 64, 32);
    const material = new THREE.MeshBasicMaterial({map: texture});
    scene.add(new THREE.Mesh(geometry, material));
  }*/

  async function loadFile(url) {
    const req = await fetch(url);
    return req.text();
  }

  function parseData(text) {
    const data = [];
    const settings = {data};
    let max;
    let min;
    // split into lines
    
    text.split('\n').forEach((line) => {
      // split the line by whitespace
      const parts = line.trim().split(/\s+/);
      if (parts.length === 2) {
        // only 2 parts, must be a key/value pair
        settings[parts[0]] = parseFloat(parts[1]);
      } else if (parts.length > 2) {
        // more than 2 parts, must be data
        const values = parts.map((v) => {
          const value = parseFloat(v);
          if (value === settings.NODATA_value) {
            return undefined;
          }
          max = Math.max(max === undefined ? value : max, value);
          min = Math.min(min === undefined ? value : min, value);
          return value;
        });
        data.push(values);
      }
    });
    
    return Object.assign(settings, {min, max});
  }

  function addBoxes(file) {
    const {min, max, data} = file;
    const range = max - min;

    // these helpers will make it easy to position the boxes
    // We can rotate the lon helper on its Y axis to the longitude
    const lonHelper = new THREE.Object3D();
    scene.add(lonHelper);
    // We rotate the latHelper on its X axis to the latitude
    const latHelper = new THREE.Object3D();
    lonHelper.add(latHelper);
    // The position helper moves the object to the edge of the sphere
    const positionHelper = new THREE.Object3D();
    positionHelper.position.z = 1;
    latHelper.add(positionHelper);
    // Used to move the center of the cube so it scales from the position Z axis
    const originHelper = new THREE.Object3D();
    originHelper.position.z = 0.5;
    positionHelper.add(originHelper);

    const lonFudge = Math.PI * .5;
    const latFudge = Math.PI * -0.135;
    const geometries = [];
    data.forEach((row, latNdx) => {
      row.forEach((value, lonNdx) => {
        if (value === undefined) {
          return;
        }
        //const amount = (value - min) / range;
        /*const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;*/
        //const geometry = new THREE.BoxBufferGeometry(boxWidth, boxHeight, boxDepth);
        const geometry = new THREE.CircleBufferGeometry(1,12);

        // adjust the helpers to point to the latitude and longitude
        lonHelper.rotation.y = THREE.MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge;
        latHelper.rotation.x = THREE.MathUtils.degToRad(latNdx + file.yllcorner) + latFudge;

        // use the world matrix of the origin helper to
        // position this geometry
        positionHelper.scale.set(0.006, 0.006, 0.006/*THREE.MathUtils.lerp(0.01, 0.5, amount)*/);
        originHelper.updateWorldMatrix(true, false);
        geometry.applyMatrix4(originHelper.matrixWorld);
        geometries.push(geometry);
      });
    });

    const mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(
        geometries, false);
    //const material = new THREE.MeshStandardMaterial({
    //const material = new THREE.MeshBasicMaterial({
    const material = new THREE.MeshPhongMaterial({
        color:0x930DB4,
        side:THREE.DoubleSide,
        //ambient: 0x555555,
        specular: 0x0064B9,
        shininess: 20,
        shading: THREE.SmoothShading
    });
    const mesh = new THREE.Mesh(mergedGeometry, material);
    scene.add(mesh);
  }

  loadFile('gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc')
    .then(parseData)
    .then(addBoxes)
    .then(render);

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


  const composer=new THREE.EffectComposer(renderer);
  const renderPass=new THREE.RenderPass(scene,camera);
  composer.addPass(renderPass);
  
  const passGlitch=new THREE.GlitchPass(0);
  composer.addPass(passGlitch);
  passGlitch.renderToScreen=true;
  
  render();
  function render() {
      
      
      //requestAnimationFrame(render);
  
      // rotate the cube
      //mesh.rotation.x += 0.01;
      //mesh.rotation.y += 0.01;
      
      
    renderRequested = undefined;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update();
    

    composer.render();
    //renderer.render(scene, camera);
  }





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

dd.body.setAttribute('style','background-color:#161831')

canvasSketch(sketch, settings);
