global.THREE = require("three");
require("three/examples/js/controls/OrbitControls")
require('three/examples/js/utils/BufferGeometryUtils')
///
//EFFECTS
/*
require('three/examples/js/postprocessing/EffectComposer');
//require('three/examples/js/postprocessing/GlitchPass');
//require('three/examples/js/shaders/DigitalGlitch');

require('three/examples/js/shaders/CopyShader');
require('three/examples/js/postprocessing/ShaderPass');
require('three/examples/js/postprocessing/RenderPass');

///// TRY
require('three/examples/js/postprocessing/UnrealBloomPass');
require('three/examples/js/shaders/LuminosityHighPassShader');
///
*/
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
    const camera = new THREE.PerspectiveCamera(12,1/*window.innerWidth / window.innerHeight*/,.01,100);
    /* CAMERA NORM POS */
    camera.position.set(9,6,-3.5);
    /*test*/
    //camera.position.set(0,10,0);
    //camera.lookAt(new THREE.Vector3());
    // Setup camera controller
    const controls = new THREE.OrbitControls(camera, context.canvas);
    // Setup your scene
    const scene = new THREE.Scene();
    /*! ADD inf map geom*/
    function addMapInf(posCil1,posCir2,rotateCir,main=false){
        let mainSize=mSC=null;
        if(main){
            mainSize=[.007,.007,.3,12];
            mSC=[.037,12]
        }else{
            mainSize=[.006,.006,.16,12]
            mSC=[.03,12]
        };
        const cyl=new THREE.CylinderGeometry(mainSize[0],mainSize[1],mainSize[2],mainSize[3]);
        const cylinder=new THREE.Mesh(cyl,new THREE.MeshBasicMaterial({color:0x008DFB}));
        cylinder.lookAt(new THREE.Vector3());
        cylinder.position.set(posCil1[0],posCil1[1],posCil1[2])
        scene.add(cylinder);
        if(posCir2==''){return}
        const circLocation = new THREE.CircleGeometry(mSC[0],mSC[1]);
        const circleLocation = new THREE.Mesh(
            circLocation,
            new THREE.MeshBasicMaterial({color: 0x008DFB, side: THREE.DoubleSide})
        );
        circleLocation.position.set(posCir2[0],posCir2[1],posCir2[2]);
        circleLocation.rotation.set(rotateCir[0],rotateCir[1],rotateCir[2])
        scene.add(circleLocation);
    }
    //Btc (main)
    addMapInf([.65,.918,-.27],[.652,.765,-.27],[1.25,-.62,-1],true);
    //Lux
    addMapInf([.62,.89,-.13],[.62,.81,-.13],[1.45,-.62,-.5]);
    //London
    addMapInf([.422,1,.152],[.422,.92,.152],[1.7,-.72,0]);
    //Malta
    addMapInf([.81,.63,-.2139],[.81,.55,-.2139],[1.2,-1,0]);
    //hong
    addMapInf([-.3461,.5,-.906],[.81,.55,-.2139],[1.2,-1,0]);
    //usa
    addMapInf([.2139,.85,.6921],'',[1.2,-1,0]);
    //usa2
    addMapInf([-.2139,.85,.6921],'',[1.2,-1,0]);
    //sing
    addMapInf([-.6921,-.1,-.7738],'',[1.2,-1,0]);

        /*FOR TEST*/
        /*
            const circLocation2=new THREE.CircleGeometry(.07,12);
            const circleLocation2 = new THREE.Mesh(
                circLocation2,                
                new THREE.MeshBasicMaterial({color:0xff0000,side:THREE.DoubleSide})
            );
            //circleLocation2.lookAt(new THREE.Vector3());
            circleLocation2.position.set(1,1,1);
            //circleLocation.scale.setScalar(0);
            //circleLocation2.rotation.set(1,1,1)
            scene.add(circleLocation2);
        */
        /*\FOR TEST*/
    /*! \ ADD inf map geom*/

    /*!Add geom sphere*/
    
    //const loader=new THREE.TextureLoader();
    
    const geometry = new THREE.IcosahedronGeometry(1.06,2);
    /*let parent_node = new THREE.Object3D();
    parent_node.add( geometry );
    //geometry.attributes.position.setUsage( THREE.DynamicDrawUsage );
    //const material = new THREE.MeshStandardMaterial({
        */

    const material = new THREE.MeshPhongMaterial({
    //const material = new THREE.MeshBasicMaterial({
        color: 0x2359bb,
        wireframe: true,
        /*side:THREE.DoubleSide,
        specular: 0x2359bb,
        shininess: 20,*/
        //flatShading : THREE.SmoothShading
      });
    const mesh = new THREE.Mesh(geometry,material);
    scene.add(mesh);
    //let pointsToAnimate=[];
    /*Add circles to geom shere*/
    const circ=      new THREE.CircleGeometry(1,12);
    const pnts=geometry.vertices;
    //const texture=loader.load('color-.jpg')
    pnts.map(point=>{
        const mesh = new THREE.Mesh(
            circ,                
            new THREE.MeshPhongMaterial({
                color: 0x2359bb,
                //wireframe: true,
                side:THREE.DoubleSide,
                specular: 0x2359bb,
                shininess: 20,
            })
        );                
        mesh.position.copy(point);
        
        //console.log(point.x.toFixed(4),point.y.toFixed(4),point.z.toFixed(4));
        
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
        const lightHolder = new THREE.Group();
        lightHolder.add(light);
        //2
        const aLight=new THREE.DirectionalLight(0x2B2062,1);
        lightHolder.add(aLight);
        aLight.position.set(0,-3,0);
        scene.add(lightHolder);
    /*! \ Add ligths*/
    /*! Text */
    
    const fontLoader = new THREE.FontLoader();
    let cacheFont=null;
    fontLoader.load('font-roboto.json',(font)=>{
        createText('Rand',[.64,1,-.3],[0,1.95,0],.05,font);
        createText('Bitcoin',[.64,.89,-.3],[0,1.95,0],.05,font,0x84B3DF);

        createText('Bluetooth',[.61,.94,-.14],[0,1.95,0],.03,font,0x8a8a8a);
        createText('Luxembourg',[.61,.88,-.14],[0,1.95,0],.03,font,0x84B3DF);

        createText('Jabascribt',[.422,1.05,.142],[0,1.2,0],.03,font,0x8a8a8a);
        createText('London',[.422,.997,.142],[0,1.2,0],.03,font,0x84B3DF);

        createText('String',[.81,.68,-.23],[0,1.95,0],.03,font,0x8a8a8a);
        createText('Malta',[.81,.62,-.23],[0,1.95,0],.03,font,0x84B3DF);

        createText('Golang',[.22,.9,.68],[0,.4,0],.03,font,0x8a8a8a);
        createText('USA',[.22,.84,.68],[0,.4,0],.03,font,0x84B3DF);

        createText('Future',[-.2,.9,.69],[0,-.4,0],.03,font,0x8a8a8a);
        createText('USA',[-.2,.84,.69],[0,-.4,0],.03,font,0x84B3DF);

        createText('Freedom',[-.368,.55,-.9],[0,3.6,0],.03,font,0x8a8a8a);
        createText('Hong Kong',[-.368,.48,-.9],[0,3.6,0],.03,font,0x84B3DF);

        createText('Labtob',[-.71,-.04,-.77],[0,3.8,0],.03,font,0x8a8a8a);
        createText('Singapore',[-.71,-.1,-.77],[0,3.8,0],.03,font,0x84B3DF);
        /*FOR TEST (create font!)*/
        /*let num=0
        //console.log(pnts)
        pnts.map(point=>{
            //console.log(point.x)
            createText(num,[point.x,point.y,point.z],[0,1.95,0],font,0x84B3DF);
            num++
        });*/
        /*\ FOR TEST*/
    });
    function createText(text,pos,rot,size,font,color=0xffffff){
        text=new String(text);
        const textGeo = new THREE.TextGeometry(text,{
            font,
            size,
            height: .01,
            curveSegments: 12,
            /*bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 8,
            bevelOffset: 0,
            bevelSegments: 5*/
        } );
        let textMaterial=new THREE.MeshBasicMaterial({color});
        text=new THREE.Mesh(textGeo,textMaterial);
        text.position.set(pos[0],pos[1],pos[2]);
        text.rotation.set(rot[0],rot[1],rot[2])
        scene.add(text);
    }

    /* CURVE */
    /*malta*/
    createCurve({q:[.8,.55,-.2139],w:[1,.7,-.3],e:[.7,.85,-.27],r:[.652,.765,-.27]})
    /*hong*/
    createCurve({q:[-.3461,.4278,-.906],w:[.6,1,-1.5],e:[.7,.8,-.5],r:[.652,.765,-.27]})
    /*lond*/
    createCurve({q:[.4278,.906,.13],w:[.4,1,.2],e:[.8,1,0],r:[.652,.765,-.27]})
    /*singapug*/
    createCurve({q:[-.6921,-.2139,-.7738],w:[-.5,1.2,-1.2],e:[.5,1.2,-.7],r:[.652,.765,-.27]})
    /*usa*/
    createCurve({q:[.2139,.7738,.6921],w:[.7,1,.8],e:[.2,1.2,.4],r:[.652,.765,-.27]})
    /*usa2*/
    createCurve({q:[-.2139,.7738,.6921],w:[.7,.7,1],e:[.8,1,.7],r:[.652,.765,-.27]})
    /*lux*/
    createCurve({q:[.62,.815,-.13],w:[.7,.8,-.2],e:[.6,1,-.25],r:[.652,.765,-.27]})
    function createCurve(q){
        const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(q.q[0],q.q[1],q.q[2]),
            new THREE.Vector3(q.w[0],q.w[1],q.w[2]),
            new THREE.Vector3(q.e[0],q.e[1],q.e[2]),
            new THREE.Vector3(q.r[0],q.r[1],q.r[2])
        );
        const pointsCurve = curve.getPoints(24);
        const geometryCurve = new THREE.BufferGeometry().setFromPoints( pointsCurve );
        const materialCurve = new THREE.LineBasicMaterial( { color : 0xffffff } );
        // Create the final object to add to the scene
        const curveObject = new THREE.Line( geometryCurve, materialCurve );
        curveObject.lookAt(new THREE.Vector3());
        scene.add(curveObject);}
    /* \ CURVE */

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
  function addBoxes(file/*,eeeee=0*/) {
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
    positionHelper.position.z = .5;
    latHelper.add(positionHelper);
    // Used to move the center of the cube so it scales from the position Z axis
    const originHelper = new THREE.Object3D();
    originHelper.position.z = 0.5;
    positionHelper.add(originHelper);

    const lonFudge = Math.PI * .5;
    const latFudge = Math.PI * -0.135;
    const geometries = [];
    //let mmm=null;
    data.map((row, latNdx) => {
        row.map((value, lonNdx) => {
        if (value === undefined) {
          return;
        }
        //const amount = (value - min) / range;
        /*const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;*/
        //const geometry = new THREE.BoxBufferGeometry(boxWidth, boxHeight, boxDepth);
        const geometry = new THREE.CircleBufferGeometry(0.006,6);

        // adjust the helpers to point to the latitude and longitude
        //let dddd= lonHelper.rotation.y = THREE.MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge;
        //let zzzz= latHelper.rotation.x = THREE.MathUtils.degToRad(latNdx + file.yllcorner) + latFudge;
        lonHelper.rotation.y = THREE.MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge;
        latHelper.rotation.x = THREE.MathUtils.degToRad(latNdx + file.yllcorner) + latFudge;

        // use the world matrix of the origin helper to
        // position this geometry
        //positionHelper.scale.set(0.006, 0.006, 0.006/*THREE.MathUtils.lerp(0.01, 0.5, amount)*/);
        originHelper.updateWorldMatrix(true, false);
        geometry.applyMatrix4(originHelper.matrixWorld);
        //if(eeeee<10){eeeee++;console.log(geometry)}            
        geometries.push(geometry);
      });
    });

    const mergedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries, false);
    //const material = new THREE.MeshStandardMaterial({
    //const material = new THREE.MeshBasicMaterial({
    const material = new THREE.MeshPhongMaterial({
        color:0x3E4154,
        side:THREE.DoubleSide,
        //ambient: 0x555555,
        //specular: 0x0064B9,
        //shininess: 20,
        //flatShading : THREE.SmoothShading
    });
    let mesh = new THREE.Mesh(mergedGeometry, material);
    mesh = new THREE.InstancedMesh( mergedGeometry, material );
    mesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage );
    scene.add(mesh);
  }
/**/
//FETCHING THE FILE
  loadFile('gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc')
    .then(parseData)
    .then(addBoxes)
    .then(render);
/**/
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

/*
EFFECTS
    const composer=new THREE.EffectComposer(renderer);
    const renderPass=new THREE.RenderPass(scene,camera);
    composer.addPass(renderPass);
*/
    //const passGlitch=new THREE.GlitchPass(0);
    /*
    EFFECTS
    const passGlitch=new THREE.UnrealBloomPass(0);
    composer.addPass(passGlitch);
    passGlitch.renderToScreen=true;
    */
  //let clock = new THREE.Clock;
  //let iooo=0;
  
  var halfWidth = window.innerWidth/2, halfHeight = window.innerHeight/2;

function update(){
   camera.position.x += ( mouseX - camera.position.x ) * 0.05;
   camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
   camera.lookAt( scene.position );

   mesh.rotation.y -= 0.005;

   renderer.render( scene, camera );
}

/*function onMouseMove( event ) {
  mouseX = event.clientX - halfWidth;
  mouseY = event.clientY - halfHeight;
  
  mesh.rotation.y += mouseX * .0000001;
  
  
}*/
  function render() {
      
   /*  
document.addEventListener('mousemove', e => {
  onMouseMove(e)
}); */
      //iooo++;
      requestAnimationFrame(render);
  
      // rotate the cube
      //mesh.rotation.x += 0.01;


      lightHolder.quaternion.copy(camera.quaternion);
      
      //mesh.rotation.x += 0.01;
    //mesh.rotation.y += 0.001;
    
    //if(iooo<100 && iooo%5==0)console.log(geometry.vertices)
    //if(iooo<3000 && iooo%5==0){
        //let zzz=0;
        //    scene.updateMatrixWorld(true);
            
        //console.log(mesh.BufferAttribute)
        //console.log(geometry.vertices[0])
//        console.log(pointsToAnimate[0].position)
        
        //pointsToAnimate.forEach(e=>{
            //console.log(geometry.vertices[zzz])
            //var positionqw = new THREE.Vector3();
            //positionqw=positionqw.getPositionFromMatrix( mesh.matrixWorld );
            
            //console.log(positionqw);
            /*e.position.x = 0.001;
            e.position.y = 0.001;
            e.position.z = 0.001;*/
            //console.log(geometry.vertices[zzz])
        //    if(zzz>5)return
        //})
    //}
    
    /*var vertex = new THREE.Vector3();
    var positionAttribute = geometry.BufferAttribute;*/
        //if(iooo<100 && iooo%5==0)console.log(geometry);

    /*for ( var i = 0; i < positionAttribute.count; i ++ ) {

        vertex.fromBufferAttribute( positionAttribute, i );

        // do something with vertex

    }*/
    
/*
    let t = clock.getElapsedTime(),delta;
    //console.log(t)

    if (t <= 10)
    {
        if(Math.abs(1-(t/3.0))>1){return}else{delta=1-(t/3.0)}
        mesh.scale.x = delta;
        mesh.scale.y = delta;
        mesh.scale.z = delta;
        console.log(delta)
    }
     */ 
      
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
/*
document.addEventListener('mousemove',(event)=>{
    let mouseX = event.clientX - halfWidth;
    let mouseY = event.clientY - halfHeight;
    mesh.rotation.x += ( mouseX/10 - camera.position.x ) /10;
    //camera.position.y += ( - mouseY/10 - camera.position.y ) /10;
})
 */       /**/


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
/*
document.addEventListener(
    "click",
    event => {
        const x = event.clientX / window.innerWidth * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        console.log(x,y)
    },
    false
);
*/
const dd=document;
const ds=function(e){dd.querySelector(e)};

dd.body.setAttribute('style','background-color:#161831');

/*
const el=dd.createElement('div');
el.style='position:fixed;z-index:99;top:0;right:0;width:200px;height:200px;background-color:red'
dd.body.appendChild(el);
*/

canvasSketch(sketch, settings);
/*
let object={};
object.canvas=dd.createElement('canvas');
object.canvas.setAttribute('id','qwe');
dd.body.appendChild(object.canvas)
const canvas = object.canvas;
const ctx = canvas.getContext('2d');
ctx.rect(10, 10, 100, 100);
ctx.fill();

let imageData = ctx.getImageData(60, 60, 200, 100);
ctx.putImageData(imageData, 150, 10);
*/
