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







    const v = new THREE.Vector3();

    function randomPointInSphere( radius ) {

        const x = THREE.Math.randFloat( -1, 1 );
        const y = THREE.Math.randFloat( -1, 1 );
        const z = THREE.Math.randFloat( -1, 1 );
        const normalizationFactor = 1 / Math.sqrt( x * x + y * y + z * z );

        v.x = x * normalizationFactor * radius;
        v.y = y * normalizationFactor * radius;
        v.z = z * normalizationFactor * radius;

        return v;
    }

    function initPoints() {

        const geometry = new THREE.BufferGeometry();

        var positions = [];

        for (var i = 0; i < 50000; i ++ ) {

            var vertex = randomPointInSphere( 50 );
            positions.push( vertex.x, vertex.y, vertex.z );

        }

        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );

        material = new THREE.PointsMaterial( { color: 0xff00ff, size: 0.1 } );
        particles = new THREE.Points(geometry, material);
        scene.add( particles );


    }
    //init();
    //initPoints();


    const obj={};
    obj.w=360;
    obj.h=180;
    obj.d=document;
    obj.c=obj.d.createElement('canvas');
    obj.cnt=obj.c.getContext('2d');
    obj.c.width=obj.w;
    obj.c.height=obj.h;
    obj.c.classList.add('tmpCanvas');
    obj.d.body.appendChild(obj.c);

    obj.s=obj.d.createElement('style');
    obj.s.innerText=`.tmpCanvas{position:absolute;z-index:999;top:-100vh;left:-10vh/!*;background-color:red*!/}`;
    obj.d.body.appendChild(obj.s);

    obj.img=new Image();
    obj.img.src='map.png';
    obj.img.onload=()=>{
        obj.cnt.drawImage(obj.img,0,0,obj.w,obj.h)
        obj.data = obj.cnt.getImageData(0, 0, obj.w, obj.h);
        obj.data = obj.data.data;
        //console.log(obj.data);return;
        obj.ar=[];
        for(let y = 0; y < obj.w; y++) {
            for(let x = 0; x < obj.w; x++) {
                // const r = obj.data[((obj.w * y) + x) * 4];
                // const g = obj.data[((obj.w * y) + x) * 4 + 1];
                // const b = obj.data[((obj.w * y) + x) * 4 + 2];
                const a=obj.data[((obj.w*y)+x)*4+3];
                if(a>140){
                    obj.ar.push([x-obj.w,y-obj.w/6.2])
                }
            }
        }

        /*const material = new THREE.PointsMaterial({
            size:.006,
            vertexColors: THREE.VertexColors,
            map: (new THREE.TextureLoader).load("particle.png"),
            alphaTest: 0.5
        })*/

        const lonHelper = new THREE.Object3D();
        scene.add(lonHelper);
        // We rotate the latHelper on its X axis to the latitude
        const latHelper = new THREE.Object3D();
        lonHelper.add(latHelper);
        // The position helper moves the object to the edge of the sphere
        const positionHelper = new THREE.Object3D();
        positionHelper.position.z = .5;
        latHelper.add(positionHelper);
        // Used to move the center of the cube so it scales from the position Z axis
        const originHelper = new THREE.Object3D();
        originHelper.position.z=.5;
        positionHelper.add(originHelper);

        const lonFudge=Math.PI*.5;
        const latFudge=Math.PI*-0.135;
        const geometries=[];

        //const geometry = new THREE.Geometry();
        //obj.ar=shuffle(fillUp(obj.ar, 15))
        let i=0;
        //obj.prewX=0;
        //console.log(    obj.ar);throw '';

        obj.nAr=[];
        for (let i = 0; i < obj.ar.length; i = i+2) {
            obj.nAr.push(obj.ar[i]);
        };

        obj.nAr.forEach((el,index)=>{
            i++;
            const geometry = new THREE.CircleBufferGeometry(0.006,8);
            const q=lonHelper.rotation.y = THREE.MathUtils.degToRad(el[0]) + lonFudge;
            const w=latHelper.rotation.x = THREE.MathUtils.degToRad(el[1]) + latFudge;
            /*if(i<1000){
                console.log(q,obj.prewQ,'+++',w,obj.prewW,'----=',q-obj.prewQ,w-obj.prewW)
            }*/
            originHelper.updateWorldMatrix(true, false);
            geometry.applyMatrix4(originHelper.matrixWorld);
            //console.log(geometry)
            if(q-obj.prewQ>.0345)geometries.push(geometry);
            obj.prewQ=q
            obj.prewW=w


            //geometry.vertices.push(new THREE.Vector3(el[0], el[1],/*Math.random()*1*/0));
            //geometry.lookAt(new THREE.Vector3())
            //geometry.colors.push(255,0,0);
        });

        const mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries, false);
        //const material = new THREE.MeshStandardMaterial({
        //const material = new THREE.MeshBasicMaterial({
        const material2 = new THREE.MeshPhongMaterial({
            color:0x3E4154,
            side:THREE.FrontSide,
            //ambient: 0x555555,
            //specular: 0x0064B9,
            //shininess: 20,
            //flatShading : THREE.SmoothShading
        });
        const mesh2 = new THREE.Mesh(mergedGeometry, material2);
        //mesh.rotation.y=(0,20,0);
        scene.add(mesh2);

        //var pointCloud = new THREE.PointCloud(geometry, material);
        //scene.add(pointCloud);






        function fillUp(array,max){

            var length = array.length;
            for(i=0;i<max-length;i++){
                array.push(array[Math.floor(Math.random()*length)])
            }
            return array;
        }
        function shuffle(a) {
            for (let i = a.length; i; i--) {
                let j = Math.floor(Math.random() * i);
                [a[i - 1], a[j]] = [a[j], a[i - 1]];
            }
            return a;
        }
        obj.c.remove()
    }
    /* Add lights*/
    const light=new THREE.DirectionalLight(0xffffff,1);
    //light.position.copy(camera.position);
    light.position.set(0,30,0);
    //light.lookAt(camera.position)
    const lightHolder = new THREE.Group();
    lightHolder.add(light);
    //2
    const aLight=new THREE.DirectionalLight(0x2B2062,1);
    lightHolder.add(aLight);
    aLight.position.set(0,-30,0);
    scene.add(lightHolder);
    /* \ Add ligths*/

    //var texture = (new THREE.TextureLoader).load("img/particle.png");

    //var x, y, z;


    // Точечки
    // for (var i =0; i<=10000;i++) {
    //   x = Math.sin(i/10)*100;
    //   y = Math.cos(i/10)*100;
    //   z = i;

    //   geometry.vertices.push(new THREE.Vector3(x, y, z));
    //   geometry.colors.push(new THREE.Color(Math.random(), Math.random(), Math.random()));
    // };*/




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
