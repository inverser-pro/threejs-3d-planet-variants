global.THREE = require("three");
require("three/examples/js/controls/OrbitControls")
require('three/examples/js/utils/BufferGeometryUtils')

const anime = require('animejs/lib/anime.min')
const TWEEN = require('Tween.min-test-shader.js')

//require('three/examples/js/renderers/Projector')
const MeshLine=require('three.meshline/src/THREE.MeshLine')
/*const glslify = require('glslify');
const path = require('path');*/

///
//EFFECTS

/*require('three/examples/js/postprocessing/EffectComposer');
require('three/examples/js/postprocessing/RenderPass');
require('three/examples/js/postprocessing/ShaderPass');
require('three/examples/js/postprocessing/MaskPass');
require('three/examples/js/postprocessing/BloomPass');
require('three/examples/js/shaders/CopyShader');
require('three/examples/js/shaders/HorizontalBlurShader');
require('three/examples/js/shaders/VerticalBlurShader');*/


/*//require('three/examples/js/postprocessing/GlitchPass');
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
    let materialCircles=null;
    // let modifier=null;
    let parent=null;
    const timeRotate=200000
          /*plusWindow=400*/;
    //let loaded=false;
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
    });
    renderer.domElement.setAttribute('class','canvas')
    renderer.domElement.setAttribute('style',`position:absolute;top:3rem;height:${window.innerHeight}px`)
    // WebGL background color
    // console.log(renderer)
    renderer.setClearColor("#000", 0);
    // Setup a camera
    const camera = new THREE.PerspectiveCamera(12,window.innerWidth / window.innerHeight,.01,100);
    /* CAMERA NORM POS */
    if(window.innerWidth<800){
        camera.position.set(18,6,-3.5);
    }else{
        camera.position.set(12,6,-3.5);
        camera.setViewOffset(12, 12, 0, 1, 10, 10)
    }

    /*test*/
    //camera.position.set(0,10,0);
    //camera.lookAt(new THREE.Vector3());
    // Setup camera controller
    const controls = new THREE.OrbitControls(camera, context.canvas);
    // Setup your scene
    const scene = new THREE.Scene();
//BEGIN
    let materialShader=null;
    const lightHolder = new THREE.Group();
    const geometry = new THREE.IcosahedronGeometry(1.058,2);
    const geometryBig = new THREE.IcosahedronGeometry(1.07,2);
    const material = new THREE.MeshBasicMaterial({
        color: 0x2359bb,
        wireframe: true,
        wireframeLinewidth:1.5,
        side:THREE.DoubleSide,
    });

//OUTER GLOW


    function mmm(intensity, fade) {
        // Custom glow shader from https://github.com/stemkoski/stemkoski.github.com/tree/master/Three.js
        let glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                'c': {
                    type: 'f',
                    value: intensity
                },
                'p': {
                    type: 'f',
                    value: fade
                },
                glowColor: {
                    type: 'c',
                    value: new THREE.Color(0x2c3388)
                },
                viewVector: {
                    type: 'v3',
                    value: camera.position
                }
            },
            vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize( normalMatrix * normal );
          vec3 vNormel = normalize( normalMatrix * viewVector );
          intensity = pow( c - dot(vNormal, vNormel), p/2. );
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`
            ,
            fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() 
        {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4( vec3(glow.r,glow.g,glow.b), 1.0 );
        }`
            ,
            side: THREE.BackSide,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        return glowMaterial;
    }

    const geometrySphere=new THREE.IcosahedronGeometry(1.0575,9);
    const meshGeo=new THREE.Mesh(geometrySphere,mmm( 0.5, 3))
    scene.add(meshGeo)

//\OUTER GLOW


    const materialIcosahedron = new THREE.MeshBasicMaterial({
        opacity: 0,
        transparent: true
    });
    // const mesh = new THREE.Mesh(geometry,materialIcosahedron);
    const mesh = new THREE.Mesh(geometry,materialIcosahedron);
    const pnts=geometry.vertices;
    parent=mesh;
    // const meshBig = new THREE.Mesh(geometryBig,materialIcosahedron);
    // const pntsBig=geometryBig.vertices;
    //scene.add(meshBig)
    //parent.add(meshBig)
    const circlePointsAr=[
        //Btc (main)
        [.662,.775,-.28],
        [.63,.84,-.13],
        [.89,.55,-.2139],
        [.422,.96,.152],
        [-0.2138805, 0.773827135, 0.692131996],
        [-.7738271,.69213199,.21388055],
        [0,.5572749,-.916],
        [.3782314,-3.892884016241959e-17,-.990222]
    ]

    //HIDE BACK
    const geomHide = new THREE.SphereBufferGeometry(.99, 64, 36);
    const matHide=new THREE.MeshBasicMaterial({color:new THREE.Color(0x161730)});
    const meshHide= new THREE.Mesh(geomHide, matHide);
    scene.add(meshHide);
    //\HIDE BACK

    //Waves
    /*const geom = new THREE.SphereBufferGeometry(1.057, 64, 36);
    const material0 = new THREE.MeshStandardMaterial({
        opacity:1,
        // wireframe: true,
        color: new THREE.Color('#161831'),
        transparent: true,
        blending: THREE.AdditiveBlending,
        blendSrc:THREE.ZeroFactor
    });
    let maxImpactAmount = 8;
//init uniforms impacts array
    const impacts = [];
    for (let i = 0; i < circlePointsAr.length; i++) {
        impacts.push({
            /!*impactPosition: new THREE.Vector3().setFromSphericalCoords(
                geom.parameters.radius,
                Math.PI * Math.random(),
                Math.PI * 2 * Math.random()
            ),*!/
            impactPosition: new THREE.Vector3(circlePointsAr[i][0],circlePointsAr[i][1],circlePointsAr[i][2]),
            impactMaxRadius: geom.parameters.radius * THREE.Math.randFloat(0.5, 0.75),
            impactRatio: 0.25
        });
    }

    //console.log(impacts);

    material0.onBeforeCompile = shader => {
        shader.uniforms.impacts = { value: impacts };
        shader.vertexShader = "varying vec3 vPosition;\n" + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
            "#include <worldpos_vertex>",
            `#include <worldpos_vertex>
    vPosition = transformed.xyz;`
        );
        shader.fragmentShader =
            `struct impact {
        vec3 impactPosition;
        float impactMaxRadius;
        float impactRatio;
      };
     uniform impact impacts[${maxImpactAmount}];
     varying vec3 vPosition;
    ` + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <dithering_fragment>",
            `#include <dithering_fragment>
      float finalStep = 0.0;
      for (int i = 0; i < ${maxImpactAmount};i++){

        float dist = distance(vPosition, impacts[i].impactPosition);
        float curRadius = impacts[i].impactMaxRadius * impacts[i].impactRatio;
        float sstep = smoothstep(0., curRadius, dist) - smoothstep(curRadius - ( 0.25 * impacts[i].impactRatio ), curRadius, dist);
        sstep *= 1. - impacts[i].impactRatio;
        finalStep += sstep;

      }
      finalStep = 1. - clamp(finalStep, 0., 1.);

      vec3 col = mix(vec3(1.,1.,1.),vec3(1.,1.,1.),finalStep);
      gl_FragColor = vec4( col, 1.- finalStep);`
        );
        materialShader = shader;
        //console.log(shader);
    };

    const globe = new THREE.Mesh(geom, material0);
    scene.add(globe);
    parent.add(globe);

    const tweens = [];

    for (let i = 0; i < maxImpactAmount; i++) {
        tweens.push({
            runTween: function() {
                const tween = new TWEEN.Tween({ value: 0 })
                    .to({ value: 1 }, THREE.Math.randInt(2500, 5000))
                    //.delay(THREE.Math.randInt(500, 2000))
                    .onUpdate(val => {
                        if (materialShader)
                            materialShader.uniforms.impacts.value[i].impactRatio = val.value;
                    })
                    .onComplete(val => {
                        //console.log(circlePointsAr)
                        if (materialShader) {
                            materialShader.uniforms.impacts.value[i].impactPosition=new THREE.Vector3(circlePointsAr[i][0],circlePointsAr[i][1],circlePointsAr[i][2])
                            materialShader.uniforms.impacts.value[i].impactMaxRadius = geom.parameters.radius * THREE.Math.randFloat(0.5, 0.75);
                        }
                        tweens[i].runTween();
                    });
                tween.start();
            }
        });
    }

    tweens.forEach(t => {t.runTween();})*/

    // \ Waves


//MOON

    const sphereGlow=new THREE.IcosahedronBufferGeometry(1.057,9);
    const materialGlow=	new THREE.ShaderMaterial({
            uniforms:
                {
                    "c":   { type: "f", value: 1.0 },
                    "p":   { type: "f", value: 1.4 },
                    glowColor: { type: "c", value: new THREE.Color(0x2c3388) },
                    viewVector: { type: "v3", value: camera.position }
                },
            vertexShader:`uniform vec3 viewVector;
uniform float c;
uniform float p;
varying float intensity;
void main() 
{
    vec3 vNormal = normalize( normalMatrix * normal );
vec3 vNormel = normalize( normalMatrix * viewVector );
intensity = pow( c - dot(vNormal, vNormel), p );

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`            ,
            fragmentShader:
            `uniform vec3 glowColor;
varying float intensity;
void main() 
{
vec3 glow = glowColor * intensity;
    gl_FragColor = vec4( glow, .1 );
}`
            ,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

    const moonGlow = new THREE.Mesh( sphereGlow, materialGlow );
    //moonGlow.position = moonGlow.position;
    moonGlow.rotation.y=-1.8;
    moonGlow.rotation.x=.3;
    scene.add( moonGlow );
    lightHolder.add(moonGlow);


    //\ MOON
//LINES
// Строим массив точек
    /*const segmentLength = 1;
    const nbrOfPoints = 10;
    const points = [];
    for (let i = 0; i < nbrOfPoints; i++) {
        points.push(i * segmentLength, 0, 0);
    }*/

    function createMeshLine(dataFromCreateCurve,flat=null){
        // Строим геометрию
        let color=new THREE.Color(1,getRandomFloat(.5,1.),1);
        let dashRatio=.5,
            lineWidth=.005
        if(flat){
            color=new THREE.Color(0x989898);
            dashRatio=.1
            lineWidth=.003
        }
        const line = new MeshLine.MeshLine();
        line.setGeometry(dataFromCreateCurve);
        const geometryl = line.geometry;
        // Построить материал с параметрами, чтобы оживить его.
        const materiall = new MeshLine.MeshLineMaterial({
            transparent: true,
            lineWidth,
            color,
            dashArray: 2, // всегда должен быть
            dashOffset: 0, // начать с dash к zero
            dashRatio, // видимая минута ряда длины. Мин: 0.99, Макс: 0.5
        });
        // Построение сетки
        const lineMesh = new THREE.Mesh(geometryl, materiall);
        lineMesh.lookAt(new THREE.Vector3())
        scene.add(lineMesh);
        parent.add(lineMesh);

        function update() {
            // Проверьте, есть ли dash, чтобы остановить анимацию.
            //if (lineMesh.material.uniforms.dashOffset.value < -2) return;
            // Уменьшить значение dashOffset анимировать dash.
            lineMesh.material.uniforms.dashOffset.value -= 0.01;
            requestAnimationFrame(update)
        }
        update()

    }

    //Curve
    function createCurve(q){
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
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(q.q[0],q.q[1],q.q[2]),
            new THREE.Vector3(q.w[0],q.w[1],q.w[2]),
            new THREE.Vector3(q.e[0],q.e[1],q.e[2])
        );
        const pointsCurve = curve.getPoints(24);

        return pointsCurve;
        /*const geometryCurve = new THREE.BufferGeometry().setFromPoints( pointsCurve );
        const materialCurve = new THREE.LineBasicMaterial( { color : 0xffffff } );
        // Create the final object to add to the scene
        const curveObject = new THREE.Line( geometryCurve, materialCurve );
        // const curveObject = new THREE.Mesh( geometryCurve, materialCurve );
        curveObject.lookAt(new THREE.Vector3());
        scene.add(curveObject);
        parent.add(curveObject);
        /!*let time4=0;
        function asdasd(){
            time4+=.05;
            materialCurve.uniforms.time=time4;
            requestAnimationFrame(asdasd)
        }
        asdasd();*!/
        return curveObject;//////////////////*/
    }
    //\Curve

//\LINES


    /*! ADD inf map geom*/
    function addMapInf(posCil1,posCir2,main=false){
        let mainSize=mSC=null,color=0x008DFB;
        if(main){
            mainSize=[.004,.004,.3,12];
            mSC=[.017,24];
            color=0x86c3f9
        }else{
            mainSize=[.002,.002,.16,12]
            mSC=[.01,12]
        };
        const cyl=new THREE.CylinderBufferGeometry(mainSize[0],mainSize[1],mainSize[2],mainSize[3]);
        const cylinder=new THREE.Mesh(cyl,new THREE.MeshBasicMaterial({color}));
        cylinder.lookAt(new THREE.Vector3());
        cylinder.position.set(posCil1[0],posCil1[1],posCil1[2]);
        scene.add(cylinder);
        parent.add(cylinder);
        if(posCir2==''){return [cylinder]}
        const circLocation = new THREE.CircleBufferGeometry(mSC[0],mSC[1]);
        const circleLocation = new THREE.Mesh(
            circLocation,
            new THREE.MeshBasicMaterial({color, side: THREE.DoubleSide})
        );
        circleLocation.position.set(posCir2[0],posCir2[1],posCir2[2]);
        //circleLocation.rotation.set(rotateCir[0],rotateCir[1],rotateCir[2]);
        circleLocation.lookAt(new THREE.Vector3());
        scene.add(circleLocation);
        parent.add(circleLocation);
/*
        //add ellipse (for animate locations)
        const curve = new THREE.EllipseCurve(
            0,  0,            // ax, aY
            .08, .08,           // xRadius, yRadius
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );
        const points = curve.getPoints( 24 );
        const ellipse = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints( points ),
            new THREE.LineBasicMaterial({color:0x008DFB,side:THREE.DoubleSide})
        );
        ellipse.position.set(posCir2[0],posCir2[1],posCir2[2]);
        ellipse.lookAt(new THREE.Vector3());
        scene.add(ellipse);
        // enable transparency
        ellipse.material.transparent = true;
// set opacity to 50%
        ellipse.material.opacity = 0.5;
        anime({
            targets:ellipse.scale,x:[0,1],y:[0,1],z:[0,1],duration:2600,/!*easing:'linear',*!/loop:true/!*,direction: 'alternate',*!/
        })
        parent.add(ellipse);*/
        return [cylinder,circleLocation]
    }
        /* \ Add circles to geom shere*/
    /*! \ Add geom sphere*/
    /*! Add lights*/
    // const light=new THREE.DirectionalLight(0xffffff,1);
    // light.position.set(0,3,0);
    // const light2=new THREE.DirectionalLight(0xffffff,.8);
    // light2.position.set(0,0,3);
    // lightHolder.add(light);
    // lightHolder.add(light2);
    // //2
    const aLight=new THREE.DirectionalLight(0x6400ff,1);
    lightHolder.add(aLight);
    aLight.position.set(0,-1,0);
    scene.add(lightHolder);
    /*! \ Add ligths*/

    function createText(text,pos,rot,size,font,color=0xffffff){
        text=new String(text);
        const textGeo = new THREE.TextBufferGeometry(text,{
            font,
            size,
            height: .004,
            curveSegments: 12,
        } );
        let textMaterial=new THREE.MeshBasicMaterial({color});
        text=new THREE.Mesh(textGeo,textMaterial);
        text.position.set(pos[0],pos[1],pos[2]);
        text.rotation.set(rot[0],rot[1],rot[2]);
        text.updateMatrix();
        scene.add(text);
        parent.add(text);
        return text;
    }

    ///**  Particles  **///
    /*function addNewParticle(o,partCont){
        // each prefab will start at startPosition (the red point)
        const startPosition = new THREE.Vector3(o.q[0],o.q[1],o.q[2]);
        // the 1st control point for each prefab will be in control0Range (the red box)
        // the range is defined as a Box3 for easy visualisation
        const control0Range = new THREE.Box3(
            new THREE.Vector3(o.w[0],o.w[1],o.w[2]),
            new THREE.Vector3(o.e[0],o.e[1],o.e[2])
        );
        // the 2nd control point for each prefab will be in control1Range (the green box)
        const control1Range = new THREE.Box3(
            //new THREE.Vector3(-8, -12, 16),
            //new THREE.Vector3(8, -8, 24)
            new THREE.Vector3(o.r[0],o.r[1],o.r[2]),
            new THREE.Vector3(o.r[0],o.r[1],o.r[2])
        );
        // each prefab will end at endPosition (the green point)
        const endPosition = new THREE.Vector3(o.r[0],o.r[1],o.r[2]);
        // pass the path definition to the animation
        const animation = new Animation(startPosition, control0Range, control1Range, endPosition,partCont);
        animation.animate(8.0, {ease: Power0.easeIn, repeat:-1});
        scene.add(animation);
        parent.add(animation);
        // debug helpers / visuals
        const center = new THREE.Vector3();
        const control0RangeCenter = control0Range.getCenter(center);
        const control1RangeCenter = control1Range.getCenter(center);
        const curve = new THREE.CubicBezierCurve3(
            startPosition,
            control0RangeCenter,
            control1RangeCenter,
            endPosition
        );
    }*/

    /*class CurveNew{
        constructor(stop){
            //this.i=0;
            this.curve = new THREE.EllipseCurve(
                0,  0,            // ax, aY
                1.1, 1.1,           // xRadius, yRadius
                0, stop,  // aStartAngle, aEndAngle
                true,            // aClockwise
                0                 // aRotation
            );
            this.points=this.curve.getPoints(50);
            this.geometry=new THREE.BufferGeometry().setFromPoints(this.points);
            this.material=new THREE.LineBasicMaterial({color:0x381D6D,linewidth:1.5});
            this.ellipse=new THREE.Line(this.geometry,this.material);
            scene.add(this.ellipse)
            parent.add(this.ellipse)
            this.ellipse.rotation.x=this.getRandomFloat(0,5)
            this.ellipse.rotation.y=this.getRandomFloat(0,5)
            this.ellipse.rotation.z=this.getRandomFloat(0,5)
            return this.ellipse;
        }
        getRandomFloat(min, max) {
            return Math.random() * (max - min) + min
        };
        update(){
        }
    }*/
    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min
    };
/*    function setNewCurve(){
        const newCurve = new CurveNew(getRandomFloat(4,6));
        scene.add(newCurve)
        parent.add(newCurve)//if remove delete this
        anime({
            targets: newCurve.rotation, z: [-9, 10],loop:true, duration: 10000, easing: 'linear'
        })
    }
    let iii=0,setInt=null;*/
    //ADD RANDOM CURVES
/*    setInt=setInterval(()=>{
            iii++;
            (iii<15)?setNewCurve():clearInterval(setInt)
        },2000
    )*/

    //let arEdgesBoxes=[];

    let meshCircles=null;
    const circlesAnimatedAr=[]
    /*Planet geometry*/
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
    obj.s.innerText=`.tmpCanvas{position:absolute;z-index:-9;width:0;height:0;overflow:hidden}`;
    obj.d.body.appendChild(obj.s);
    //let materialCircles=null;
    obj.img=new Image();
    obj.img.src='map.png';
    obj.img.onload=()=>{
        //loaded=true;
        obj.cnt.drawImage(obj.img,0,0,obj.w,obj.h)
        obj.data = obj.cnt.getImageData(0, 0, obj.w, obj.h);
        obj.data = obj.data.data;
        obj.ar=[];


        //console.log(circlePointsAr)
        // let maxImpactAmount = 16;
// init uniforms impacts array
        const impacts = [];
        for (let i = 0; i < circlePointsAr.length; i++) {
            //console.log(new THREE.Vector3(circlePointsAr[i][0],circlePointsAr[i][1],circlePointsAr[i][2]))
            impacts.push({
                impactPosition:new THREE.Vector3(circlePointsAr[i][0],circlePointsAr[i][1],circlePointsAr[i][2]),
                impactMaxRadius: THREE.Math.randFloat(0.0001, 0.0002),
                impactRatio: 0.01
            });
        }
        let uniforms = {
            impacts: {value: impacts}
        }
        for(let y = 0; y < obj.w; y++) {
            for(let x = 0; x < obj.w; x++) {
                const a=obj.data[((obj.w*y)+x)*4+3];
                if(a>140){
                    obj.ar.push([x-obj.w,y-obj.w/6.2])
                }
            }
        }
        const lonHelper = new THREE.Object3D();
        scene.add(lonHelper);
        // We rotate the latHelper on its X axis to the latitude
        const latHelper = new THREE.Object3D();
        lonHelper.add(latHelper);
        // The position helper moves the object to the edge of the sphere
        const positionHelper = new THREE.Object3D();
        positionHelper.position.z = .5;
        // positionHelper.position.z = Math.random();
        latHelper.add(positionHelper);
        // Used to move the center of the cube so it scales from the position Z axis
        const originHelper = new THREE.Object3D();
        originHelper.position.z=.5;
        positionHelper.add(originHelper);
        const lonFudge=Math.PI*.5;
        const latFudge=Math.PI*-0.135;
        const geometries=[];

        obj.nAr=[];
        obj.counter=0;
        obj.counter2=0;
        materialCircles=new THREE.MeshBasicMaterial({
            color:0xffffff,
            side:THREE.FrontSide,
            onBeforeCompile: shader => {
                shader.uniforms.impacts = uniforms.impacts;
                shader.vertexShader = `
      	struct impact {
          vec3 impactPosition;
          float impactMaxRadius;
          float impactRatio;
        };
      	uniform impact impacts[${circlePointsAr.length}];
        
        attribute vec3 center;
        
        ${shader.vertexShader}
      `.replace(
                    `#include <begin_vertex>`,
                    `#include <begin_vertex>
        float finalStep = 0.0;
        for (int i = 0; i < ${circlePointsAr.length};i++){

          float dist = distance(center, impacts[i].impactPosition);
          float curRadius = impacts[i].impactMaxRadius * impacts[i].impactRatio/2.;
          float sstep = smoothstep(0., curRadius*1.8, dist) - smoothstep(curRadius - ( .8 * impacts[i].impactRatio ), curRadius, dist);
          sstep *= 1. - impacts[i].impactRatio;
          finalStep += sstep;

        }
        finalStep = clamp(finalStep*.5, 0., 1.);
        transformed += normal * finalStep * 0.25;
        `
                );
                //console.log(shader.vertexShader);
                shader.fragmentShader = shader.fragmentShader.replace(
                    `vec4 diffuseColor = vec4( diffuse, opacity );`,
                    `
        if (length(vUv - 0.5) > 0.5) discard;
        
        vec4 diffuseColor = vec4( vec3(.7,.7,.7), .1 );
        `
                );
                //console.log(shader.fragmentShader)
            }

        });
        materialCircles.defines = {"USE_UV" : ""};
/*

        materialCircles = new THREE.ShaderMaterial({
            side:THREE.FrontSide,
            /!*transparent:true,
            opacity:1,*!/
            fragmentShader:`
                varying vec2 vUv;
                uniform vec3 color;
                //uniform float time;
                                
                void main(){
                    vec2 center = vec2(.5,.5);
                    float d = distance(vUv,center);
                    if(d>0.5) discard;
                    float mask = d > .5 ? 1. : .0;
                    mask=1.-mask;
                    //if (mask.rgb == vec3(1.0,0.0,0.0))discard;
                    // gl_FragColor=vec4(0.,0.,0.,1.);
                    // gl_FragColor=vec4(vec3(mask),1.);
                    gl_FragColor=vec4(vec3(mask),0.);
                    // gl_FragColor=vec4(vec3(vUv.y+sin(time),vUv.y,vUv.y),1.);
                }
            `,
            vertexShader:`
                varying vec2 vUv;
                //attribute float power;
                // varying float progress;
                uniform float time;
                void main(){
                    vUv=uv;
                    //if(time<3.)
                    //    {
                            //if(progress<1.)progress+=1.;
                            //WORK
                            // vec3 newposition = position + position*sin(time*6.2 + position.z*8.)*0.03;
                            // W2
                             vec3 newposition = position + position*sin(time*6.2 + position.z*12.)*0.03;
                        //vec3 newposition = position + position*sin(position.z*12.)*0.03;
                            // vec3 newposition = position + position*sin(time*6.2 + length(position-vec3(-.5,1.,0.))*6.2)*0.03;
                            //newposition = newposition);
                            gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1. );
                    //    }
                    //else
                    //    {
                    //        //power=0.;
                    //        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1. );
                    //    }
                    
                    //
                }
            `,
            uniforms:{
                time:{value:0},
            }
        });
*/

        let uty0=0
        // obj.normalPosition=[]
        // obj.randPosition=[]
        //obj.randPositionTmp=[]
        //let dummyObj = new THREE.Object3D();
        //let p = new THREE.Vector3();
        obj.ar.forEach(e=>{
            uty0++
            obj.counter2++;
            const geometry=new THREE.PlaneBufferGeometry(0.005,0.005);
            lonHelper.rotation.y = THREE.MathUtils.degToRad(e[0])+lonFudge+15;
            //console.log(THREE.MathUtils.degToRad(e[0])+lonFudge)
            const w=latHelper.rotation.x = THREE.MathUtils.degToRad(e[1])+latFudge;
            if(w-obj.prewLatX===0/*&&obj.counter2%2==0*/){
                originHelper.updateWorldMatrix(true,false);
                geometry.applyMatrix4(originHelper.matrixWorld);
                geometry.setAttribute("center", new THREE.Float32BufferAttribute(geometry.attributes.position.array, 3));
                geometries.push(geometry);
            }
            // if(uty0<10)console.log(geometry)
            // lonHelper.position.x = getRandomFloat(2,-2);
            // lonHelper.position.y = getRandomFloat(2,-2);
            // lonHelper.position.z = getRandomFloat(2,-2);
            obj.prewLatX=w;
        });
        // console.log(geometries)
        const geometryCircles = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries, false);
        //meshCircles = new THREE.Points(geometryCircles, materialCircles);
        meshCircles = new THREE.Mesh(geometryCircles, materialCircles);
        // meshCircles = new THREE.InstancedMesh(geometryCircles.clone(), materialCircles.clone(),1);
        //meshCircles.setAttribute('vertices',1);
        //meshCircles.rotation.y=15;
        //meshCircles.rotation.y = Math.PI * 9 / 10;
        // meshCircles.position.z=1;
/*        anime({
           targets:meshCircles.scale,x:[0,1],y:[0,1],z:[0,1],duration:1600,easing:'linear'
        })*/
        // console.log(meshCircles);
        scene.add(meshCircles);
        parent.add(meshCircles);

        const tweens2 = [];
        // console.log(uniforms.impacts.value[0].impactRatio)
        for (let i = 0; i < circlePointsAr.length; i++) {
            tweens2.push({
                runTween:()=>{
                    const tween=new TWEEN.Tween({value:0})
                        .to({ value: 1 }, THREE.Math.randInt(2500,5000))
                        //.delay(THREE.Math.randInt(500, 2000))
                        .onUpdate(val=>{
                            uniforms.impacts.value[i].impactRatio = val.value;
                        })
                        .onComplete(()=>{
                            // console.log(uniforms.impacts.value[i])
                            uniforms.impacts.value[i].impactPosition=new THREE.Vector3(circlePointsAr[i][0],circlePointsAr[i][1],circlePointsAr[i][2]);
                            uniforms.impacts.value[i].impactMaxRadius = 5 * THREE.Math.randFloat(0.5, 0.75);
                            tweens2[i].runTween();
                        });
                    tween.start();
                }
            });
        }

        tweens2.forEach(t=>{t.runTween()})


//         if(meshCircles!==null&&meshCircles.geometry!==null){
//             // console.log(1)
//             const positionAttribute = meshCircles.geometry.attributes.position;
//             // console.log( positionAttribute );
//             let time0=0,udfg=null;
//             for ( let i = 0; i < positionAttribute.count; i ++ ) {
// // anime({targets:positionAttribute,y:[0,1],loop:true})
//                 // access single vertex (x,y,z)
//
//                  let x = positionAttribute.getX( i );
//                  let y = positionAttribute.getY( i );
//                  let z = positionAttribute.getZ( i );
//
//                 // modify data (in this case just the z coordinate)
//
//
//
//
//
//                 // write data back to attribute
//                 //positionAttribute.setXYZ( i, x, y, z );
//                 udfg=
//                 setInterval(()=>{
//                     time0++
//                     x++;
//                     // y *= getRandomFloat(-.2,.2);
//                     z++;
//                     if(time0%4==0 && time0 < 3000){
//                         positionAttribute.setXYZ( i, x, y, z );
//                         console.log(1)
//                     }else{
//                         clearInterval(udfg)
//                     }
//                 },1000)
//
//             }
//         }


















/*        meshCircles.geometry.attributes.position.array.map(e=>{
            anime({
                targets:e.position,x:[0,1],loop:true
            })
        })*/

        obj.c.remove();
        obj.s.remove()

//////////TEST

        /*const boxTest=new THREE.BoxBufferGeometry(1.5,1.5,1.5);
        const vertexShaderTest=`varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

void main () {
  vPosition = position;
  vUv = uv;
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
}`;
        const fragmentShaderTest=`varying vec2 vUv;

void main () {
  vec3 fragColor = vec3(vUv.x);
  gl_FragColor = vec4(fragColor, 1.0);
}`;
        const materialTest=new THREE.ShaderMaterial({
            vertexShader:vertexShaderTest,
            fragmentShader:fragmentShaderTest,
            /!*uniforms:{
                color:
            }*!/
        })
        const meshTest=new THREE.Mesh(boxTest,materialTest);
        scene.add(meshTest)*/
////////// \ TEST



        /*ALL OTHER OBJECTS | For sync rotation*/

        // var cylinderMesh = function( pointX, pointY )
        // {
        //     // edge from X to Y
        //     var direction = new THREE.Vector3().subVectors( pointY, pointX );
        //     var arrow = new THREE.ArrowHelper( direction, pointX );
        //
        //     // cylinder: radiusAtTop, radiusAtBottom,
        //     //     height, radiusSegments, heightSegments
        //     var edgeGeometry = new THREE.CylinderGeometry( .03, .03, direction.length(), 6, 4 );
        //
        //     var edge = new THREE.Mesh( edgeGeometry,
        //         new THREE.MeshBasicMaterial( { color: 0x0000ff } ) );
        //     edge.rotation = arrow.rotation.clone();
        //     edge.position = new THREE.Vector3().addVectors( pointX, direction.multiplyScalar(0.5) );
        //     scene.add( edge );
        // }
/*
        const vertexShaderTest=`varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

void main () {
  vPosition = position;
  vUv = uv;
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
}`;
        const fragmentShaderTest=`varying vec2 vUv;
uniform vec3 color;
uniform float time;
void main () {
  gl_FragColor = vec4(vec3(vUv.y + sin(time))*color, .0);
}`;
        const materialTest=new THREE.ShaderMaterial({
            vertexShader:vertexShaderTest,
            fragmentShader:fragmentShaderTest,
            uniforms:{
                color:{value:new THREE.Color(0x2359bb)},
                time:{value:0}
            }
        })*/

        //ADD ANIMATED PLANE GEOM (WEB)
        // AND FIND cylinderMesh(point.verte


        /*let ugh=0;
        //const lineAniCenter = new THREE.Group();
        function cylinderMesh(pointX, pointY,material) {
            ugh++;
            if(ugh%2==0) {
                // const material = new THREE.MeshBasicMaterial({
                //     color:new THREE.Color('#0086ff'),
                // })
                const direction = new THREE.Vector3().subVectors(pointY, pointX);
                const orientation = new THREE.Matrix4();
                orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
                orientation.multiply(new THREE.Matrix4().set(1, 0, 0, 0,
                    0, 0, 1, 0,
                    0, -1, 0, 0,
                    0, 0, 0, 1));
                // var edgeGeometry = new THREE.CylinderBufferGeometry(.02, .02, direction.length(), 10);
                const edgeGeometry = new THREE.PlaneBufferGeometry(.001, direction.length());
                const edge = new THREE.Mesh(edgeGeometry.clone(), material.clone());
                //edgeGeometry.center(edge.position);
                edge.applyMatrix4(orientation);
                // position based on midpoints - there may be a better solution than this
                edge.position.x = (pointY.x + pointX.x) / 1.9;
                edge.position.y = (pointY.y + pointX.y) / 1.9;
                edge.position.z = (pointY.z + pointX.z) / 1.9;
                // edge.scale.x = 1.16
                edge.scale.y = 0
                // edge.scale.z = 1.16
                scene.add(edge);
                // edge.geometry.center();
                parent.add(edge);
                //делает обратным появлине (ни сверху вниз, а наоборот)
                //edge.position.multiplyScalar(-1);
                arEdgesBoxes.push(edge)
                //lineAniCenter.add(edge)
            }
            // return edge;

        }
        setTimeout(()=>{
            let uf=0,intery=null;
            intery=setInterval(()=>{
                if(uf<=arEdgesBoxes.length) {
                    if(arEdgesBoxes[uf]) {
                        anime({
                            targets: arEdgesBoxes[uf].scale,
                            y: [0, 1],
                            duration: 2000,
                            delay: 5000,
                            easing: 'easeInOutQuint',
                            loop: true,
                            direction:'alternate'
                        })
                        uf++
                    }
                }else{
                    clearInterval(intery)
                    return
                };
            },100)
        },1000)*/



//FOR TEST LINE
        /*const materialg = new THREE.ShaderMaterial(//https://stackoverflow.com/questions/45625986/three-js-gaussian-blur-in-glsl-shader
            {
                opacity:0,
                transparent:true,
                uniforms: {
                    tDiffuse: { type: "t", value: null },
                    tAdd: { type: "t", value: null },
                    fCoeff: { type: "f", value: 1.0 }
                },

                vertexShader: [
                    "varying vec2 vUv;",

                    "void main() {",
                    "vUv = uv;",
                    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                    "}"
                ].join("\n"),

                fragmentShader: [
                    "uniform sampler2D tDiffuse;",
                    "uniform sampler2D tAdd;",
                    "uniform float fCoeff;",

                    "varying vec2 vUv;",

                    "void main() {",
                    "vec4 texel = texture2D( tDiffuse, vUv );",
                    "vec4 add = texture2D( tAdd, vUv );",
                    "gl_FragColor = texel + add * fCoeff, 1.0;",
                    "}"
                ].join("\n")
            }   );
        const geometryg = new THREE.IcosahedronGeometry(1.2,3);

        // const lineg = new THREE.Line( geometryg, materialg );
        const lineg = new THREE.Mesh( geometryg, materialg );
        scene.add( lineg );
        parent.add( lineg );*/
//\FOR TEST LINE

        //Main octahedron
        scene.add(mesh);
        //circles on map
        const circ=new THREE.CircleBufferGeometry(0.01,12);
//points on a big sphere
        const mpnts=new THREE.MeshBasicMaterial({color:0x2359bb,side:THREE.BackSide/*,transparent:true,opacity:1*/});
        // let arFlc=0
        /*pnts.map(point=>{
            //Crate circles
            const mesh = new THREE.Mesh(
                circ,
                mpnts
                // new THREE.MeshPhongMaterial({
                //     color: 0x2359bb,
                //     //wireframe: true,
                //     side:THREE.BackSide,
                //     specular: 0x2359bb,
                //     shininess: 20,
                //     transparent:true,
                //     opacity:0
                // }).clone()
                // shaderMaterial
            );
            mesh.position.copy(point);
            mesh.lookAt(new THREE.Vector3());
            scene.add(mesh);
            parent.add(mesh);
            //\Crate circles

            circlesAnimatedAr.push(mesh)
            // console.log(point)
        });*/
        //add icosahedron faces NEW
        // const geoFcs=geometry.faces;
        /*geometry.faces.map(point=>{
            // console.log(point.vertexNormals[0],point.vertexNormals[1])
            let o={}
            //first center point
            // if(pnts!==undefined){
                o.x=THREE.MathUtils.lerp(point.vertexNormals[0].x,point.vertexNormals[2].x,.5)
                o.y=THREE.MathUtils.lerp(point.vertexNormals[0].y,point.vertexNormals[2].y,.5)
                o.z=THREE.MathUtils.lerp(point.vertexNormals[0].z,point.vertexNormals[2].z,.5)
                //2
                o.x2=THREE.MathUtils.lerp(o.x,point.vertexNormals[2].x,.5)
                o.y2=THREE.MathUtils.lerp(o.y,point.vertexNormals[2].y,.5)
                o.z2=THREE.MathUtils.lerp(o.z,point.vertexNormals[2].z,.5)
                //3
                o.x3=THREE.MathUtils.lerp(point.vertexNormals[0].x,o.x,.5)
                o.y3=THREE.MathUtils.lerp(point.vertexNormals[0].y,o.y,.5)
                o.z3=THREE.MathUtils.lerp(point.vertexNormals[0].z,o.z,.5)
                // console.log(o.x2)

                const nePA=new Array();
                obj.nePA2=new Array();
                nePA.push(
                    new THREE.Vector3(point.vertexNormals[0].x,point.vertexNormals[0].y,point.vertexNormals[0].z),
                    new THREE.Vector3(o.x3,o.y3,o.z3),
                    new THREE.Vector3(o.x,o.y,o.z),
                    new THREE.Vector3(o.x2,o.y2,o.z2),
                    new THREE.Vector3(point.vertexNormals[2].x,point.vertexNormals[2].y,point.vertexNormals[2].z)
                )
                // console.log(nePA)
                // throw '';
                nePA.map(e=>{
                    // console.log(e.normalize())
                    obj.nePA2.push(e.normalize())
                })
                const line = new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints(
                        // point.vertexNormals
                        obj.nePA2
                    ),
                    new THREE.LineBasicMaterial({color:0x2359bb,linewidth:0.4})
                );
            line.scale.set(1.06,1.06,1.06)
                scene.add(line)
                parent.add(line)
                // arFlc+=2
            // }

        })*/
        //\add icosahedron faces NEW



//animation main icosah points cilinder material
        /*let uu=0,inttt=null;
        inttt=setInterval(()=>{
            if(uu<=circlesAnimatedAr.length&&circlesAnimatedAr[uu]) {
                anime({
                    targets: circlesAnimatedAr[uu].material,
                    opacity: [0, 1],
                    loop: true,
                    duration: 3000,
                    easing: 'linear',
                    direction: 'alternate',
                    delay: 1000
                })
                anime({
                    targets: circlesAnimatedAr[uu].scale,
                    x: [0, 1],
                    y: [0, 1],
                    z: [0, 1],
                    loop: true,
                    duration: 4000,
                    //easeng: 'linear',
                    //direction: 'alternate',
                    //deelay: 100
                })
                uu++
            }else{
                clearInterval(inttt);
                // delete inttt
                return false
            }
        },50)*/
        //\Main octahedron

        /** Text */
        const fontLoader = new THREE.FontLoader();
        // let cacheFont=null;
        fontLoader.load('font-roboto.json',(font)=>{
                const txt1=createText('Rand',[.64,1,-.3],[0,1.95,0],.05,font)
                const txt2=createText('Bitcoin',[.64,.89,-.3],[0,1.95,0],.05,font,0x84B3DF);
            const txt3=createText('Bluetooth',[.617,.97,-.14],[0,1.95,0],.03,font);
            const txt4=createText('Luxembourg',[.617,.91,-.14],[0,1.95,0],.03,font,0x84B3DF);
                const txt5=createText('String',[.88,.68,-.23],[0,1.95,0],.03,font);
                const txt6=createText('Malta',[.88,.62,-.23],[0,1.95,0],.03,font,0x84B3DF);
            const txt7=createText('Jabascribt',[.422,1.105,.142],[0,1.2,0],.03,font);
            const txt8=createText('London',[.422,1.05,.142],[0,1.2,0],.03,font,0x84B3DF);
                const txt9=createText('Golang',[-0.7738271,.83213199,.228805],[0,-1.3,0],.03,font);
                const txt10=createText('USA',[-0.7738271,.78213199,.228805],[0,-1.3,0],.03,font,0x84B3DF);
            const txt11=createText('Future',[-.2,.9,.69],[0,-.4,0],.03,font);
            const txt12=createText('USA',[-.2,.84,.69],[0,-.4,0],.03,font,0x84B3DF);
                const txt13=createText('Freedom',[-0.01,.687274,-.90168],[0,3.1,0],.03,font);
                const txt14=createText('Hong Kong',[-0.01,.637274,-.90168],[0,3.1,0],.03,font,0x84B3DF);
            const txt15=createText('Labtob',[.3682314,.138,-.99022],[0,2.8,0],.03,font);
            const txt16=createText('Singapore',[.36882314,.085,-.99022],[0,2.8,0],.03,font,0x84B3DF);

            anime.timeline().add({
                    targets:txt1.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear'
                }).add({
                    targets:txt2.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        //Btc (main)
                        let c1=addMapInf([.66,.928,-.28],[.662,.775,-.28],true);
                        anime({targets:c1[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:100,easing:'linear'});
                        anime({targets:c1[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,easing:'linear'});
                    }
                }).add({
                    targets:txt3.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear'
                }).add({//lux
                    targets:txt4.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        //addNewParticle({q:[.62,.815,-.13],w:[.7,.8,-.2],e:[.6,1,-.25],r:[.652,.765,-.27]},5);
                        createMeshLine(createCurve({q:[.63,.84,-.13],w:[.7,.8,-.2],e:[.68,.77,-.29]}))
                        const c2=addMapInf([.63,.92,-.13],[.63,.84,-.13]);
                        anime({targets:c2[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:100,easing:'linear'});
                        anime({targets:c2[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,easing:'linear'});
                    }
                }).add({
                    targets:txt5.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear'
                }).add({//Malta
                    targets:txt6.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        // addNewParticle({q:[.8,.55,-.2139],w:[1,.765,-.3],e:[1,.765,-.27],r:[.652,.765,-.27]},5);
                        createMeshLine(createCurve({q:[.89,.55,-.2139],w:[1,.7,-.3],e:[.68,.77,-.29]}))
                        const c4=addMapInf([.89,.63,-.2139],[.89,.55,-.2139]);
                        anime({targets:c4[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:100,easing:'linear'});
                        anime({targets:c4[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,easing:'linear'});
                    }
                }).add({
                    targets:txt7.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear'
                }).add({//lond
                    targets:txt8.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        // addNewParticle({q:[.4278,.906,.13],w:[.8,1,.2],e:[.8,1,0],r:[.652,.765,-.27]},12);
                        createMeshLine(createCurve({q:[.422,.96,.152],w:[.8,1,.2],e:[.68,.77,-.29]}))
                        const c3=addMapInf([.422,1.05,.152],[.422,.96,.152]);
                        anime({targets:c3[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:100,easing:'linear'});
                        anime({targets:c3[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,easing:'linear'});
                    }
                }).add({
                    targets:txt11.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',delay:4000
                }).add({//usa 2
                    targets:txt12.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        // addNewParticle({q:[-.2139,.7738,.6921],w:[.9,.9,1.2],e:[1.2,1.2,.9],r:[.652,.765,-.27]},20);
                        createMeshLine(createCurve({q:[-0.2138805, 0.773827135, 0.692131996],w:[.9,.9,1.2],e:[.68,.77,-.29]}))
                        const c6=addMapInf([-.2139,.85,.6921],[-0.2138805, 0.773827135, 0.692131996]);
                        anime({targets:c6[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:2000,easing:'linear'});
                    }
                }).add({
                    targets:txt9.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',delay:4000
                }).add({//usa
                    targets:txt10.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        // addNewParticle({q:[-0.7738271,.69213199,.2138805],w:[.7,1.4,1.2],e:[.2,1.5,.4],r:[.652,.765,-.27]},20)
                        createMeshLine(createCurve({q:[-.7738271,.69213199,.21388055],w:[.5,1.6,1.2],e:[.68,.77,-.29]}))
                        const c5=addMapInf([-0.7738271,.777,.2138805],[-.7738271,.69213199,.21388055]);
                        anime({targets:c5[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:2000,easing:'linear'});
                    }
                }).add({
                   targets:txt13.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',delay:30000
                }).add({//hong
                    targets:txt14.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        // addNewParticle({q:[0,.58,-.916],w:[.6,1,-1.5],e:[.7,.8,-1],r:[.652,.765,-.27]},20);
                        createMeshLine(createCurve({q:[0,.5572749,-.916],w:[.6,1,-1.5],e:[.68,.77,-.29]}))
                        const c7=addMapInf([0,.637274,-.916],[0,.5572749,-.916]);
                        anime({targets:c7[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:100,easing:'linear'});
                        anime({targets:c7[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,easing:'linear'});
                    }
                }).add({
               targets:txt15.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear'
            }).add({//singapug
                   targets:txt16.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        // addNewParticle({q:[.3782314,.09,-.99022],w:[1,1.2,-1],e:[1,1.2,-1.2],r:[.652,.765,-.27]},20);
                        createMeshLine(createCurve({q:[.3782314,-3.892884016241959e-17,-.990222],w:[1,1.2,-1],e:[.68,.77,-.29]}))
                        const c8=addMapInf([.3782314,.09,-.99022],[.3782314,-3.892884016241959e-17,-.990222]);
                        anime({targets:c8[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:100,easing:'linear'});
                        anime({targets:c8[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,easing:'linear'});
                   }
                })
            /*FOR TEST (create font!)*/
            /*let num=0
            // console.log(pnts)
            pnts.map(point=>{
                //console.log(point)
                createText(num,[point.x,point.y,point.z],[0,1.95,0],.05,font,0x84B3DF);
                num++
            });*/
            /*\ FOR TEST*/
        });
        //\TEXT+

        /* \ ALL OTHER OBJECTS*/
    }
    /* \ Planet geometry*/

    //create planet flat linesmesh
    const flatLines={
        0:[-0.5562235116958618,.8999885320663452,0],
        1:[0.34541305899620056,.4269540011882782,.9043030738830566],
    }

    function dataForFlatCurve(d,mps=1.25){
        let o={}
        //Main Rand
        o.const=[.662,.775,-.28];
        o.x=THREE.MathUtils.lerp(d[0],o.const[0],.5)
        o.y=THREE.MathUtils.lerp(d[1],o.const[1],.5)
        o.z=THREE.MathUtils.lerp(d[2],o.const[2],.5)
        const nePA=new Array();
        const nePA2=new Array();
        nePA.push(
            new THREE.Vector3(d[0],d[1],d[2]),
            new THREE.Vector3(o.x,o.y,o.z),
            new THREE.Vector3(o.const[0],o.const[1],o.const[2])
        )
        nePA.map(e=>{
            nePA2.push(e.normalize())
        })
        const curve = new THREE.QuadraticBezierCurve3(
            nePA2[0].multiplyScalar(1.075),
            nePA2[1].multiplyScalar(mps),
            nePA2[2].multiplyScalar(1.071)
        );
        const pointsCurve = curve.getPoints(24);
        const geometryCurve = new THREE.BufferGeometry().setFromPoints( pointsCurve );
        const materialCurve = new THREE.LineBasicMaterial( { color : 0xffffff,opacity:.5,transparent:true } );
        const curveObject = new THREE.Line( geometryCurve, materialCurve );
        return curveObject.geometry.attributes.position.array
    }

    //2 from BIG icosahedron 2,34,55,59,99
    createMeshLine(dataForFlatCurve([-.55622351,.899988,0]),1)
    createMeshLine(dataForFlatCurve([.9995644,.381799638,0],1.1),1)
    //34
    createMeshLine(dataForFlatCurve([.91455984,.34933078,.431796],1.17),1)
    //55
    createMeshLine(dataForFlatCurve([.3493307,.4317965,-.914559],1.12),1)
    //19
    createMeshLine(dataForFlatCurve([-.2158982902765274,.7811273,-.69866]),1)
    //54
    createMeshLine(dataForFlatCurve([0,-.562532305,-.9101963639],1.5),1)
    //40
    createMeshLine(dataForFlatCurve([0,-.21589829,1.047992348],1.7),1)
    //5
    createMeshLine(dataForFlatCurve([-.6986615,.2158982,.7811273],1.72),1)
    //\create planet flat linesmesh

    // parent.translateOnAxis(1,1)

/*  function resizeRendererToDisplaySize(renderer){
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {renderer.setSize(width, height, false)}
    return needResize;
  };*/
    function rotateRadians(deg){
        return deg * (Math.PI / 180);
    }
    /*addStars()
    function addStars() {

        let i, j, materials, x, y, z;
        let geometry = new THREE.Geometry();
        materials = new THREE.PointsMaterial({
            color: 0xffffff,
            size: .05,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false
        });
        for (i = j = 0; j <= 100; i = ++j) {
            x = Math.random() * 8-4;
            y = Math.random() * 8-4;
            z = Math.random() * 8-4;
            geometry.vertices.push(new THREE.Vector3(x, y, z));
        }
        let starSystem = new THREE.Points(geometry.clone(), materials.clone());
        starSystem.sortParticles = true;

        //rotateRadians = (1,1,1);

        anime({
            loop: true,
            targets: starSystem.rotation,
            // z: [rotateRadians(360), rotateRadians(0)],
            //x: [rotateRadians(360), rotateRadians(0)],
            y: [rotateRadians(-360), rotateRadians(0)],
            duration: 20000,
            easing: "linear"
        });
        scene.add(starSystem);
    }*/
    const animeMesh=anime({
        loop: true,
        targets: mesh.rotation,
        // z: [rotateRadians(360), rotateRadians(0)],
        //x: [rotateRadians(360), rotateRadians(0)],
        y: [rotateRadians(-360), rotateRadians(0)],
        duration: timeRotate,
        easing: "linear"
    });
    //const halfWidth = window.innerWidth/2, halfHeight = window.innerHeight/2;
//     update()
// function update(){
//    renderer.render( scene, camera );
// }
/*
  let time=time2=0;
  function render() {
     time++;
      if(meshCircles){
          //if(time){
          // if(time==100){
//              const l=meshCircles.geometry.attributes.position.array.length;
//              const v3=[]

//              for(let i=0;i<12;i++){
//                  meshCircles.geometry.attributes.position.array[time2+i]=0
//              }
              /!*

              anime({
      targets: this.staggerArray,
      y: [
        {value: (this.geometry.parameters.height*0.25), duration: 500},
        {value: -(this.geometry.parameters.height*0.25), duration: 2000},
      ],
      delay: anime.stagger(200, {grid: [this.nRows, this.nCols], from: randFrom}),
      easing: easingString,
      complete: (anim) => this.beginAnimationLoop()
    });

              *!/

              //const r=getRandomFloat(0,l/4).toFixed(0);

              // meshCircles.geometry.attributes.position.needsUpdate = true;
              //console.log(r)

          // time2+=12;
              // meshCircles[getRandomFloat(0,l).toFixed(0)].material.opacity=0
              //meshCircles.material.opacity=0
          //}
      }
    /!*if(meshCircles){
        if(meshCircles.geometry.attributes.size){
            //console.log(meshCircles.geometry.attributes.size)
            const sizes_ = meshCircles.geometry.attributes.size.array;

            for (let i = 0; i < sizes_.length; i++) {
                const o = 10 * (1 + Math.sin(0.1 * i + time))
                sizes_[i] = o;
                //console.log(o)
            }

            meshCircles.geometry.attributes.size.needsUpdate = true;
            //console.log(9)
        }
    }*!/
    /!*if(meshCircles!==undefined&&meshCircles!==null) {//console.log(meshCircles.geometry.attributes.size.array)
            //if(meshCircles.geometry.attributes.size){

                const sizes = meshCircles.geometry.attributes.size.array;

                for ( let i = 0; i < sizes.length; i ++ ) {
                    const o=10 * ( 1 + Math.sin( 0.1 * i + time ) )
                    sizes[ i ] = o;
                   //console.log(o)
                }

                geometry.attributes.size.needsUpdate = true;
            //}
        //console.log(1)
    }*!/




    if(materialCircles)materialCircles.uniforms.time.value=time/2;
    requestAnimationFrame(render);
    renderRequested = undefined;

    if(resizeRendererToDisplaySize(renderer)){
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    controls.update();
    renderer.render(scene, camera);
  }
  render();
*/
    const _={};
    _.tf=true;
    _.w=window.innerHeight;
    window.addEventListener('resize',()=>{
        _.w=window.innerHeight;
    })
    window.addEventListener('scroll',()=>{
        _.w=window.innerHeight;
        window.scrollY>_.w+200?_.tf=false:_.tf=true
    })

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

        if(_.tf){
            //console.log(time,_.w)
            TWEEN.update();
            lightHolder.quaternion.copy(camera.quaternion);
            renderer.render(scene, camera);
        }


        //if(materialCircles) {
            // if(startTime_<400) {
                // startTime_ += 1;
                 //materialCircles.uniforms.time.value = time;

            //let options = options || {};
            //options.time = this.totalDuration;
            //console.log(this)
            //TweenMax.fromTo(materialCircles.uniforms, 200, {time}, {repeat:1});

        //     }
        //}
        //materialCircles.uniforms.time.value -= 0.01;


    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      //controls.dispose();
      renderer.dispose();
    }
  };
};

/*
function Animation(startPosition, control0Range, control1Range, endPosition,prefabCount=30) {
    // each prefab is a plane
    const prefabGeometry = new THREE.PlaneGeometry(.007,.007);
    //prefabGeometry.lookAt(new THREE.Vector3());
    //var  = 30;

    // create the buffer geometry with all the prefabs
    const geometry = new BAS.PrefabBufferGeometry(prefabGeometry, prefabCount);

    // ANIMATION

    // the actual duration of the animation is controlled by Animation.animate
    // this duration can be set to any value
    // let's set it to 1.0 to keep it simple
    const totalDuration = this.totalDuration = 1.0;

    geometry.createAttribute('aDelayDuration', 2, function(data, i, count) {
        // calculating the delay based on index will spread the prefabs over the 'timeline'
        data[0] = i / count * totalDuration;
        // all prefabs have the same animation duration, so we could store it as a uniform instead
        // storing it as an attribute takes more memory,
        // but for the sake of this demo it's easier in case we want to give each prefab a different duration
        data[1] = totalDuration;
    });

    // START & END POSITIONS

    // copy the start and end position for each prefab
    // these could be stored as uniforms as well, but we will keep them as attributes for the same reason as aDelayDuration
    geometry.createAttribute('aStartPosition', 3, function(data) {
        data[0] = startPosition.x;
        data[1] = startPosition.y;
        data[2] = startPosition.z;
    });

    geometry.createAttribute('aEndPosition', 3, function(data) {
        data[0] = endPosition.x;
        data[1] = endPosition.y;
        data[2] = endPosition.z;
    });

    // CONTROL POINTS

    // a temp point so we don't create exessive objects inside the factories (they will be called once for each prefab)
    const point = new THREE.Vector3();

    // while the start & end positions for each prefab are the same,
    // the control points are spread out within their respective ranges
    // because of this each prefab will have a different path

    geometry.createAttribute('aControl0', 3, function(data) {
        // pick a random point inside the given range for the first control point
        BAS.Utils.randomInBox(control0Range, point).toArray(data);
    });

    geometry.createAttribute('aControl1', 3, function(data) {
        // pick a random point inside the given range for the second control point
        BAS.Utils.randomInBox(control1Range, point).toArray(data);
    });

    // ROTATION

    // each prefab will get a random axis and an angle around that axis
    const axis = new THREE.Vector3();
    let angle = 0;

    geometry.createAttribute('aAxisAngle', 4, function(data) {
        axis.x = THREE.Math.randFloatSpread(2);
        axis.y = THREE.Math.randFloatSpread(2);
        axis.z = THREE.Math.randFloatSpread(2);
        axis.normalize();

        angle = Math.PI * THREE.Math.randInt(16, 32);

        data[0] = axis.x;
        data[1] = axis.y;
        data[2] = axis.z;
        data[3] = angle;
    });

    // COLOR

    // each prefab will get a psudo-random vertex color
    const color = new THREE.Color();
    // we will use the built in VertexColors to give each prefab its own color
    // note you have to set Material.vertexColors to THREE.VertexColors for this to work
    geometry.createAttribute('color', 3, function(data, i, count) {
        color.setRGB(82, 151, 239);
        color.toArray(data);
    });

    const material = new BAS.PhongAnimationMaterial({
        flatShading: true,
        vertexColors: THREE.VertexColors,
        side: THREE.DoubleSide,
        uniforms: {
            uTime: {type: 'f', value: 0}
        },
        uniformValues: {
            specular: new THREE.Color(0xff0000),
            //shininess: 10
        },
        vertexFunctions: [
            // cubic_bezier defines the cubicBezier function used in the vertexPosition chunk
            BAS.ShaderChunk['cubic_bezier'],
            BAS.ShaderChunk['quaternion_rotation']
        ],
        // note we do not have to define 'color' as a uniform because THREE.js will do this for us
        // trying to define it here will throw a duplicate declaration error
        vertexParameters: [
            'uniform float uTime;',
            'attribute vec2 aDelayDuration;',
            'attribute vec3 aStartPosition;',
            'attribute vec3 aEndPosition;',
            'attribute vec3 aControl0;',
            'attribute vec3 aControl1;',
            'attribute vec4 aAxisAngle;'
        ],
        vertexInit: [
            // tProgress is in range 0.0 to 1.0
            // we want each prefab to restart at 0.0 if the progress is < 1.0, creating a continuous motion
            // the delay is added to the time uniform to spread the prefabs over the path
            'float tProgress = mod((uTime + aDelayDuration.x), aDelayDuration.y) / aDelayDuration.y;',

            'vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, aAxisAngle.w * tProgress);'
        ],
        vertexPosition: [
            'transformed = rotateVector(tQuat, transformed);',
            // cubicBezier will return a vec3 on a cubic bezier curve defined by four points
            'transformed += cubicBezier(aStartPosition, aControl0, aControl1, aEndPosition, tProgress);'
        ]
    });

    THREE.Mesh.call(this, geometry, material);

    this.frustumCulled = false;
}
Animation.prototype = Object.create(THREE.Mesh.prototype);
Animation.prototype.constructor = Animation;
Object.defineProperty(Animation.prototype, 'time', {
    get: function () {
        return this.material.uniforms['uTime'].value;
    },
    set: function (v) {
        this.material.uniforms['uTime'].value = v;
    }
});

Animation.prototype.animate = function (duration, options) {
    options = options || {};
    options.time = this.totalDuration;
    //console.log(this)
    return TweenMax.fromTo(this, duration, {time: 0.0}, options);
};

function PointHelper(color, size, position) {
    THREE.Mesh.call(this,
        new THREE.SphereGeometry(1.0, 16, 16),
        new THREE.MeshBasicMaterial({
            color: 0xff0000,
            //wireframe: true
        })
    );

    position && this.position.copy(position);
}
PointHelper.prototype = Object.create(THREE.Mesh.prototype);
PointHelper.prototype.constructor = PointHelper;

function LineHelper(points, params) {
    const g = new THREE.Geometry();
    const m = new THREE.LineBasicMaterial(params);

    g.vertices = points;

    THREE.Line.call(this, g, m);
}
LineHelper.prototype = Object.create(THREE.Line.prototype);
LineHelper.prototype.constructor = LineHelper;
*/
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
//const dd=document;
// const ds=function(e){dd.querySelector(e)};
//dd.body.setAttribute('style','background-color:#161831;overflow:hidden;/*display:block;color:#ccc;text-align:center*/');
/*
const _={}
for(let i=0;i<100;i++){
    _.d=dd.createElement('div')
    _.d.style.margin='3rem 0'
    _.d.innerText=`${i}_444444`;
    dd.body.appendChild(_.d)
}*/
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






/*



(function() {
    var Particles, work;

    Particles = class Particles {
        constructor() {
            this.move = this.move.bind(this);
            this.setActors = this.setActors.bind(this);
            this.addStars = this.addStars.bind(this);
            //this.addKnot = this.addKnot.bind(this);
            this.getTexture = this.getTexture.bind(this);
            //this.setStage = this.setStage.bind(this);
            // @controls = new THREE.OrbitControls( @camera, @renderer.domElement )
            // @controls.addEventListener( 'change', @render )
            // @controls.target.set( 0, 0, 0 )
            //this.rotateRadians = this.rotateRadians.bind(this);
            this.animate = this.animate.bind(this);
            this.render = this.render.bind(this);
            this.setStage();
            this.setLighting();
            this.setActors();
            this.animate();
            this.move();
            this.render();
        }

        move() {
            anime({
                loop: true,
                targets: this.starSystem.rotation,
                z: [this.rotateRadians(360), this.rotateRadians(0)],
                x: [this.rotateRadians(360), this.rotateRadians(0)],
                y: [this.rotateRadians(360), this.rotateRadians(0)],
                duration: 20000,
                easing: "linear"
            });
            anime({
                loop: true,
                targets: this.torusSystem.rotation,
                z: [this.rotateRadians(-360), this.rotateRadians(0)],
                x: [this.rotateRadians(-360), this.rotateRadians(0)],
                y: [this.rotateRadians(-360), this.rotateRadians(0)],
                duration: 30000,
                easing: "linear"
            });
            return anime({
                loop: true,
                targets: this.sphereSystem.rotation,
                z: [this.rotateRadians(360), this.rotateRadians(0)],
                x: [this.rotateRadians(360), this.rotateRadians(0)],
                y: [this.rotateRadians(360), this.rotateRadians(0)],
                duration: 30000,
                easing: "linear"
            });
        }

        setActors() {
            //this.addKnot();
            return this.addStars();
        }





    };

    work = new Particles();

}).call(this);*/