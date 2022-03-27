global.THREE = require("three");
require("three/examples/js/controls/OrbitControls")
require('three/examples/js/utils/BufferGeometryUtils')

/*const {
    ModifierStack,
    Bend,
    Twist,
    Noise,
    Cloth,
    UserDefined,
    Taper,
    Break,
    Bloat,
    Vector3,
    ModConstant
} = require('three.modifiers/dist/modifiers')*/


//require('three/examples/js/modifiers')

const anime = require('animejs/lib/anime.min')
// const TweenMax = require('TweenMax.min')
const TWEEN = require('Tween.min-test-shader.js')
// const BAS = require('bas.min')

//require('three/examples/js/renderers/Projector')
const MeshLine=require('three.meshline/src/THREE.MeshLine')
/*const glslify = require('glslify');
const path = require('path');*/

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
    let materialCircles=null;
    let modifier=null;
    let parent=new Array();
    const timeRotate=80000;
    //let loaded=false;
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
    });
    // WebGL background color
    renderer.setClearColor("#000", 0);
    // Setup a camera
    const camera = new THREE.PerspectiveCamera(12,window.innerWidth / window.innerHeight,.01,100);
    /* CAMERA NORM POS */
    camera.position.set(9,6,-3.5);
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
    const material = new THREE.MeshBasicMaterial({
        color: 0x2359bb,
        wireframe: true,
        wireframeLinewidth:1.5,
        side:THREE.DoubleSide,
    });

    const materialIcosahedron = new THREE.MeshBasicMaterial({
        opacity: 0,
        transparent: true
    });
    // const mesh = new THREE.Mesh(geometry,materialIcosahedron);
    const mesh = new THREE.Mesh(geometry,materialIcosahedron);
    const pnts=geometry.vertices;
    parent=mesh;

    //Waves
    const geom = new THREE.SphereBufferGeometry(1.057, 64, 36);
    const material0 = new THREE.MeshStandardMaterial({
        opacity:1,
        // wireframe: true,
        color: new THREE.Color('#161831'),
        transparent: true,
        blending: THREE.AdditiveBlending,
        blendSrc:THREE.ZeroFactor
    });
    const circlePointsAr=[
        [.662,.775,-.28],
        [.63,.84,-.13],
        [.89,.55,-.2139],
        [.422,.96,.152],
        [-0.2138805, 0.773827135, 0.692131996],
        [-.7738271,.69213199,.21388055],
        [0,.5572749,-.916],
        [.3782314,-3.892884016241959e-17,-.990222]
    ]
//     let maxImpactAmount = 8;
// // init uniforms impacts array
//     const impacts = [];
//     for (let i = 0; i < circlePointsAr.length; i++) {
//         impacts.push({
//             /*impactPosition: new THREE.Vector3().setFromSphericalCoords(
//                 geom.parameters.radius,
//                 Math.PI * Math.random(),
//                 Math.PI * 2 * Math.random()
//             ),*/
//             impactPosition: new THREE.Vector3(circlePointsAr[i][0],circlePointsAr[i][1],circlePointsAr[i][2]),
//             impactMaxRadius: geom.parameters.radius * THREE.Math.randFloat(0.5, 0.75),
//             impactRatio: 0.25
//         });
//     }
//
//     //console.log(impacts);
//
//     material0.onBeforeCompile = shader => {
//         shader.uniforms.impacts = { value: impacts };
//         shader.vertexShader = "varying vec3 vPosition;\n" + shader.vertexShader;
//         shader.vertexShader = shader.vertexShader.replace(
//             "#include <worldpos_vertex>",
//             `#include <worldpos_vertex>
//     vPosition = transformed.xyz;`
//         );
//         shader.fragmentShader =
//             `struct impact {
//         vec3 impactPosition;
//         float impactMaxRadius;
//         float impactRatio;
//       };
//      uniform impact impacts[${maxImpactAmount}];
//      varying vec3 vPosition;
//     ` + shader.fragmentShader;
//         shader.fragmentShader = shader.fragmentShader.replace(
//             "#include <dithering_fragment>",
//             `#include <dithering_fragment>
//       float finalStep = 0.0;
//       for (int i = 0; i < ${maxImpactAmount};i++){
//
//         float dist = distance(vPosition, impacts[i].impactPosition);
//         float curRadius = impacts[i].impactMaxRadius * impacts[i].impactRatio;
//         float sstep = smoothstep(0., curRadius, dist) - smoothstep(curRadius - ( 0.25 * impacts[i].impactRatio ), curRadius, dist);
//         sstep *= 1. - impacts[i].impactRatio;
//         finalStep += sstep;
//
//       }
//       finalStep = 1. - clamp(finalStep, 0., 1.);
//
//       vec3 col = mix(vec3(1.,1.,1.),vec3(1.,1.,1.),finalStep);
//       gl_FragColor = vec4( col, 1.- finalStep);`
//         );
//         materialShader = shader;
//         //console.log(shader);
//     };
//
//     const globe = new THREE.Mesh(geom, material0);
//     scene.add(globe);
//     parent.add(globe);
//
//     const tweens = [];
//
//     for (let i = 0; i < maxImpactAmount; i++) {
//         tweens.push({
//             runTween: function() {
//                 const tween = new TWEEN.Tween({ value: 0 })
//                     .to({ value: 1 }, THREE.Math.randInt(2500, 5000))
//                     //.delay(THREE.Math.randInt(500, 2000))
//                     .onUpdate(val => {
//                         if (materialShader)
//                             materialShader.uniforms.impacts.value[i].impactRatio = val.value;
//                     })
//                     .onComplete(val => {
//                         //console.log(circlePointsAr)
//                         if (materialShader) {
//                             materialShader.uniforms.impacts.value[i].impactPosition=new THREE.Vector3(circlePointsAr[i][0],circlePointsAr[i][1],circlePointsAr[i][2])
//                             materialShader.uniforms.impacts.value[i].impactMaxRadius = geom.parameters.radius * THREE.Math.randFloat(0.5, 0.75);
//                         }
//                         tweens[i].runTween();
//                     });
//                 tween.start();
//             }
//         });
//     }
//
//     tweens.forEach(t => {t.runTween();})

    // \ Waves


//MOON
    const sphereGlow=new THREE.IcosahedronBufferGeometry(1.07,9);
    const materialGlow=	new THREE.ShaderMaterial({
            uniforms:
                {
                    "c":   { type: "f", value: 1.0 },
                    "p":   { type: "f", value: 1.4 },
                    glowColor: { type: "c", value: new THREE.Color(0x0086ff) },
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

//LINES
// Строим массив точек
    /*const segmentLength = 1;
    const nbrOfPoints = 10;
    const points = [];
    for (let i = 0; i < nbrOfPoints; i++) {
        points.push(i * segmentLength, 0, 0);
    }*/

    function createMeshLine(dataFromCreateCurve){
        // Строим геометрию
        const line = new MeshLine.MeshLine();
        line.setGeometry(dataFromCreateCurve);
        const geometryl = line.geometry;
        // Построить материал с параметрами, чтобы оживить его.
        const materiall = new MeshLine.MeshLineMaterial({
            transparent: true,
            lineWidth: .01,
            color: new THREE.Color(.5,getRandomFloat(0,.5),1),
            dashArray: 2, // всегда должен быть
            dashOffset: 0, // начать с dash к zero
            dashRatio: 0.5, // видимая минута ряда длины. Мин: 0.99, Макс: 0.5
        });
        // Построение сетки
        const lineMesh = new THREE.Mesh(geometryl, materiall);
        // lineMesh.position.x = .5;
        // lineMesh.position.y = .5;
        // lineMesh.position.z = .5;
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
        const geometryCurve = new THREE.BufferGeometry().setFromPoints( pointsCurve );
        const materialCurve = new THREE.LineBasicMaterial( { color : 0xffffff } );
        // Create the final object to add to the scene
        const curveObject = new THREE.Line( geometryCurve, materialCurve );
        // const curveObject = new THREE.Mesh( geometryCurve, materialCurve );
        curveObject.lookAt(new THREE.Vector3());
        scene.add(curveObject);
        parent.add(curveObject);
        /*let time4=0;
        function asdasd(){
            time4+=.05;
            materialCurve.uniforms.time=time4;
            requestAnimationFrame(asdasd)
        }
        asdasd();*/
        return curveObject;//////////////////
    }
    //\Curve

//\LINES


    /*! ADD inf map geom*/
    function addMapInf(posCil1,posCir2,main=false){
        let mainSize=mSC=null,color=0x008DFB;
        if(main){
            mainSize=[.007,.007,.3,12];
            mSC=[.037,24];
            color=0x86c3f9
        }else{
            mainSize=[.006,.006,.16,12]
            mSC=[.03,12]
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
            height: .001,
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

    class CurveNew{
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
    }
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

    const geometries=[]
    obj.img.onload=()=>{
        obj.cnt.drawImage(obj.img,0,0,obj.w,obj.h)
        obj.data = obj.cnt.getImageData(0, 0, obj.w, obj.h);
        obj.data = obj.data.data;
        obj.ar=[];


        let maxImpactAmount = 8;
// init uniforms impacts array
        let impacts = [];
        const circlePointsAr=[
            [.662,.775,-.28],
            [.63,.84,-.13],
            [.89,.55,-.2139],
            [.422,.96,.152],
            [-0.2138805, 0.773827135, 0.692131996],
            [-.7738271,.69213199,.21388055],
            [0,.5572749,-.916],
            [.3782314,-3.892884016241959e-17,-.990222]
        ]
        for (let i = 0; i < circlePointsAr.length; i++) {
            //console.log(new THREE.Vector3(circlePointsAr[i][0],circlePointsAr[i][1],circlePointsAr[i][2]))
            impacts.push({
                impactPosition:new THREE.Vector3(circlePointsAr[i][0],circlePointsAr[i][1],circlePointsAr[i][2])/*.setFromSphericalCoords(
                    1,
                    Math.PI * 0.25,
                    Math.PI / 16 * i
                )*/,
                impactMaxRadius: 5 * THREE.Math.randFloat(0.5, 0.75),
                impactRatio: 0.05
            });
        }
        let uniforms = {
            impacts: {value: impacts}
        }
        console.log(uniforms)
        let dummyObj = new THREE.Object3D();
        let p = new THREE.Vector3();

        let cnv = document.createElement("canvas");
        cnv.width = 360;
        cnv.height = 180;
        let ctx = cnv.getContext("2d");

        // img.onload = () => {
        for(let y = 0; y < obj.h; y++){
                for (let x = 0; x < obj.w; x++) {
                    let d = obj.data[((obj.w * y) + x) * 4 + 3];
                    if (d < 128) continue;
                    p.setFromSphericalCoords(1, THREE.MathUtils.degToRad(y), THREE.MathUtils.degToRad(x));
                    dummyObj.lookAt(p);
                    dummyObj.updateMatrix();
                    let g = new THREE.PlaneBufferGeometry(0.005, 0.005);
                    g.applyMatrix4(dummyObj.matrix);
                    g.translate(p.x, p.y, p.z);
                    let centers = [
                        p.x, p.y, p.z,
                        p.x, p.y, p.z,
                        p.x, p.y, p.z,
                        p.x, p.y, p.z
                    ];
                    g.setAttribute("center", new THREE.Float32BufferAttribute(centers, 3));
                    geometries.push(g);
                }
        }
            let g = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries);

            let m = new THREE.MeshBasicMaterial({
                color:0xffffff,
                side: THREE.DoubleSide,
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
          float curRadius = impacts[i].impactMaxRadius * impacts[i].impactRatio/4.;
          float sstep = smoothstep(0., curRadius, dist) - smoothstep(curRadius - ( 0.5 * impacts[i].impactRatio ), curRadius, dist);
          sstep *= 1. - impacts[i].impactRatio;
          finalStep += sstep;

        }
        finalStep = clamp(finalStep, 0., 1.);
        transformed += normal * finalStep * 0.25;
        `
                    );
                    //console.log(shader.vertexShader);
                    shader.fragmentShader = shader.fragmentShader.replace(
                        `vec4 diffuseColor = vec4( diffuse, opacity );`,
                        `
        if (length(vUv - 0.5) > 0.5) discard;
        
        vec4 diffuseColor = vec4( diffuse, opacity );
        `
                    );
                    //console.log(shader.fragmentShader)
                }

            });
            m.defines = {"USE_UV" : ""};
            let o = new THREE.Mesh(g, m);
            o.rotation.y = Math.PI * 9 / 10;
            scene.add(o);
        /*o.scale.x=.2
        o.scale.y=.2
        o.scale.z=.2*/
        // }
        // img.src = imgData;

        var tweens = [];

        for (let i = 0; i < circlePointsAr.length; i++) {
            tweens.push({
                runTween: function() {
                    var tween = new TWEEN.Tween({ value: 0 })
                        .to({ value: 1 }, THREE.Math.randInt(2500, 5000))
                        //.delay(THREE.Math.randInt(500, 2000))
                        .onUpdate(val => {
                            uniforms.impacts.value[i].impactRatio = val.value;
                        })
                        .onComplete(val => {
                            const yyyy= uniforms.impacts.value[i].impactPosition=new THREE.Vector3(circlePointsAr[i][0],circlePointsAr[i][1],circlePointsAr[i][2])/*.setFromSphericalCoords(
                                1,
                                Math.PI * Math.random(),
                                Math.PI * 2 * Math.random()
                            )*/;
                            uniforms.impacts.value[i].impactPosition = new THREE.Vector3(circlePointsAr[i][0],circlePointsAr[i][1],circlePointsAr[i][2])
                            //console.log(uniforms.impacts.value[i].impactPosition,yyyy)
                            uniforms.impacts.value[i].impactMaxRadius = 5 * THREE.Math.randFloat(0.5, 0.75);
                            tweens[i].runTween();
                        });
                    tween.start();
                }
            });
        }

        tweens.forEach(t => {t.runTween();})



    }
    /* \ Planet geometry*/

  function resizeRendererToDisplaySize(renderer){
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {renderer.setSize(width, height, false)}
    return needResize;
  };
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
    anime({
        loop: true,
        targets: mesh.rotation,
        // z: [rotateRadians(360), rotateRadians(0)],
        //x: [rotateRadians(360), rotateRadians(0)],
        y: [rotateRadians(-360), rotateRadians(0)],
        duration: timeRotate,
        easing: "linear"
    });
    const halfWidth = window.innerWidth/2, halfHeight = window.innerHeight/2;

  // draw each frame
    let startTime_=endTime_=null;
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
        TWEEN.update();
        lightHolder.quaternion.copy(camera.quaternion);
        // modifier && modifier.apply();

      controls.update();
      renderer.render(scene, camera);
        if(materialCircles) {
            // if(startTime_<400) {
                // startTime_ += 1;
                 //materialCircles.uniforms.time.value = time;

            //let options = options || {};
            //options.time = this.totalDuration;
            //console.log(this)
            //TweenMax.fromTo(materialCircles.uniforms, 200, {time}, {repeat:1});

        //     }
        }
        //materialCircles.uniforms.time.value -= 0.01;


    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
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
const dd=document;
// const ds=function(e){dd.querySelector(e)};

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