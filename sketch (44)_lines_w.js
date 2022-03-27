global.THREE = require("three");
require("three/examples/js/controls/OrbitControls")
require('three/examples/js/utils/BufferGeometryUtils')

const {
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
} = require('three.modifiers/dist/modifiers')


//require('three/examples/js/modifiers')

const anime = require('animejs/lib/anime.min')
const TweenMax = require('TweenMax.min')
const BAS = require('bas.min')

//require('three/examples/js/renderers/Projector')
//const MeshLine = require('MeshLine')
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

    const lightHolder = new THREE.Group();
    const geometry = new THREE.IcosahedronGeometry(1.06,2);
    const material = new THREE.MeshPhongMaterial({
        color: 0x2359bb,
        wireframe: true,
        wireframeLinewidth:1.5,
        side:THREE.DoubleSide,
    });

    const materialIcosahedron = new THREE.MeshPhongMaterial({
        opacity: 0,
        transparent: true
    });
    // const mesh = new THREE.Mesh(geometry,materialIcosahedron);
    const mesh = new THREE.Mesh(geometry,material);
    const pnts=geometry.vertices;
    parent=mesh;



//MOON


    // const sphereGlow=new THREE.IcosahedronBufferGeometry(1.06,9);
    const sphereGlow=new THREE.IcosahedronBufferGeometry(1,9);
    const materialGlow=	new THREE.ShaderMaterial(
        {
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
        }   );

    const moonGlow = new THREE.Mesh( sphereGlow, materialGlow );
    //moonGlow.position = moonGlow.position;
    moonGlow.rotation.y=-1.8;
    moonGlow.rotation.x=.3;
    scene.add( moonGlow );
    lightHolder.add(moonGlow);


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
            targets:ellipse.scale,x:[0,1],y:[0,1],z:[0,1],duration:2600,/*easing:'linear',*/loop:true/*,direction: 'alternate',*/
        })
        parent.add(ellipse);
        return [cylinder,circleLocation]
    }
        /* \ Add circles to geom shere*/
    /*! \ Add geom sphere*/
    /*! Add lights*/
    const light=new THREE.DirectionalLight(0xffffff,1);
    light.position.set(0,3,0);
    const light2=new THREE.DirectionalLight(0xffffff,.8);
    light2.position.set(0,0,3);
    lightHolder.add(light);
    lightHolder.add(light2);
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
    function addNewParticle(o,partCont){
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
    }

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
    function setNewCurve(){
        const newCurve = new CurveNew(getRandomFloat(4,6));
        scene.add(newCurve)
        parent.add(newCurve)//if remove delete this
        anime({
            targets: newCurve.rotation, z: [-9, 10],loop:true, duration: 10000, easing: 'linear'
        })
    }
    let iii=0,setInt=null;
    setInt=setInterval(()=>{
            iii++;
            (iii<15)?setNewCurve():clearInterval(setInt)
        },2000)

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
    let materialCircles=null;
    obj.img=new Image();
    obj.img.src='map.png';
    obj.img.onload=()=>{
        //loaded=true;
        obj.cnt.drawImage(obj.img,0,0,obj.w,obj.h)
        obj.data = obj.cnt.getImageData(0, 0, obj.w, obj.h);
        obj.data = obj.data.data;
        obj.ar=[];
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

        /*obj.nAr=[];
        obj.counter=0;
        //прорядим точки, чтобы не слипались
        for(let i=0;i<obj.ar.length;i=i+2){
            obj.counter++;
            // -89 ... 0 ... 87
            if(
                obj.ar[i-1]!==undefined
                &&Math.abs(Math.round(obj.ar[i-1][1]))%2==1
            ){obj.nAr.push(obj.ar[i])}
        };
        obj.counter2=0;
        const materialCircles = new THREE.MeshPhongMaterial({
            color:0x3E4154,
            side:THREE.FrontSide
        });
        //const materialCircles = new THREE.MeshBasicMaterial( { color: 0xffffff} );
        let uty0=0
        obj.normalPosition=[]
        obj.randPosition=[]
        //obj.randPositionTmp=[]
        obj.ar.forEach(e=>{
            uty0++
            obj.counter2++;
            const geometry=new THREE.CircleBufferGeometry(.01,8);
            // const geometry=new THREE.PlaneBufferGeometry(0.003,0.003);
            lonHelper.rotation.y = THREE.MathUtils.degToRad(e[0])+lonFudge;
            //console.log(THREE.MathUtils.degToRad(e[0])+lonFudge)
            const w=latHelper.rotation.x = THREE.MathUtils.degToRad(e[1])+latFudge;
            //if(uty0<10) console.log(geometry)
            if(w-obj.prewLatX===0&&obj.counter2%5==0){
                originHelper.updateWorldMatrix(true,false);
                geometry.applyMatrix4(originHelper.matrixWorld);
                //FOR FUTURE!!!!!
                // if(uty0<5) {
                //     obj.normalPosition.push(geometry.attributes.position.array)
                //     geometry.attributes.position.array.map(e=>{
                //         obj.randPosition.push(getRandomFloat(.1,-.1))
                //     })
                //     //obj.randPosition.push(1)
                // }
                geometries.push(geometry);
            }
            // if(uty0<10)console.log(geometry)
            // lonHelper.position.x = getRandomFloat(2,-2);
            // lonHelper.position.y = getRandomFloat(2,-2);
            // lonHelper.position.z = getRandomFloat(2,-2);
            obj.prewLatX=w;
        });
// console.log(obj.normalPosition)
// console.log(obj.randPosition)*/

        obj.nAr=[];
        obj.counter=0;
        for(let i=0;i<obj.ar.length;i=i+2){
            obj.counter++;
            //-89 ... 0 ... 87
            if(
                obj.ar[i-1]!==undefined
                &&Math.abs(Math.round(obj.ar[i-1][1]))%2==1
            ){obj.nAr.push(obj.ar[i])}
        };
        // console.log(obj.nAr.length)
        obj.counter2=0;
        // const materialCircles = new THREE.MeshBasicMaterial({
        //     color:0x3E4154,
        //     side:THREE.FrontSide,
        //     transparent:true,
        // });
        // const materialCircles = new THREE.MeshBasicMaterial({
        //     color:0x3E4154,
        //     // side:THREE.FrontSide,
        //     // transparent:true,
        //     // opacity:1
        // });
        const materialCircles = new THREE.ShaderMaterial({
            side:THREE.FrontSide,
            fragmentShader:`
                varying vec2 vUv;
                uniform vec3 color;
                //uniform float time;
                void main(){
                    vec2 center = vec2(.5,.5);
                    float d = distance(vUv,center);
                    float mask = d > .5 ? 1. : .0;
                    mask=1.-mask;
                    // gl_FragColor=vec4(0.,0.,0.,1.);
                    // gl_FragColor=vec4(vec3(mask),1.);
                    gl_FragColor=vec4(vec3(mask/4.),0.);
                    // gl_FragColor=vec4(vec3(vUv.y+sin(time),vUv.y,vUv.y),1.);
                }
            `,
            vertexShader:`
                varying vec2 vUv;
                
                void main(){
                    vUv=uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1. );
                }
            `,
            uniforms:{
                // time:{value:0},
                // color:{value:0xffffff},
                MouseDentro : { type: 'bool', value: false },
                Color       : { type: 'vec3', value: new THREE.Color(0xFFFFFF) },
                Tiempo      : { type: '1f', value: 0 }
            }
        });
        obj.countAr=obj.nAr.length;
        obj.counterTemp=0;
        let s1=.014;
        obj.nAr.forEach(e=>{
            obj.counter2++;
// /*if(obj.counter2<100)*/ /console.log(obj.countAr/2 > obj.counter2)
            if(obj.counter2 > obj.countAr/2+200){
                s1+=-.00001
            }else{
                s1+=+.00001
            }

            /*if(obj.counter2<150){
                s1=.014
            }else if(obj.counter2>149 && obj.counter2<1000){
                s1=.018
            }else{
                s1=0.025
            }*/
            const geometry=new THREE.PlaneBufferGeometry(s1,s1);
            lonHelper.rotation.y = THREE.MathUtils.degToRad(e[0])+lonFudge;
            const w=latHelper.rotation.x = THREE.MathUtils.degToRad(e[1])+latFudge;
            originHelper.updateWorldMatrix(true,false);
            geometry.applyMatrix4(originHelper.matrixWorld);
            //geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( 20, 1 ).setUsage( THREE.DynamicDrawUsage ) );
            if(w-obj.prewLatX===0&&obj.counter2%2==0){
                geometries.push(geometry);
// if(obj.counterTemp<10) console.log(geometry)
//                 obj.counterTemp++
            }
            obj.prewLatX=w;
        });

        const geometryCircles = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries, false);
        //meshCircles = new THREE.Points(geometryCircles, materialCircles);
        meshCircles = new THREE.Mesh(geometryCircles, materialCircles);
        // meshCircles = new THREE.InstancedMesh(geometryCircles.clone(), materialCircles.clone(),1);
        //meshCircles.setAttribute('vertices',1);
        meshCircles.rotation.y=15;
        // meshCircles.position.z=1;
/*        anime({
           targets:meshCircles.scale,x:[0,1],y:[0,1],z:[0,1],duration:1600,easing:'linear'
        })*/
        // console.log(meshCircles);
        scene.add(meshCircles);
        parent.add(meshCircles);


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

        obj.c.remove()

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
/*        const materialg = new THREE.LineBasicMaterial({
            color: 0xff0000
        });

        const pointsg = [];
        pointsg.push( new THREE.Vector3( - 1, 0, 0 ) );
        pointsg.push( new THREE.Vector3( 1, 0, 0 ) );

        const geometryg = new THREE.BufferGeometry().setFromPoints( pointsg );

        const lineg = new THREE.Line( geometryg, materialg );
        scene.add( lineg );
        anime({
            targets:lineg.scale,x:[0,1],loop:true
        })*/
//\FOR TEST LINE


        /*let ux=0,intttx=null;
        intttx=setInterval(()=>{
            if(uu<=circlesAnimatedAr.length&&circlesAnimatedAr[ux]) {
                anime({
                    targets: circlesAnimatedAr[ux].material,
                    opacity: [0, 1],
                    loop: true,
                    duration: 3000,
                    easeng: 'linear',
                    direction: 'alternate',
                    deelay: 1000
                })
                anime({
                    targets: circlesAnimatedAr[ux].scale,
                    x: [0, 1],
                    y: [0, 1],
                    z: [0, 1],
                    loop: true,
                    duration: 4000,
                    //easeng: 'linear',
                    //direction: 'alternate',
                    //deelay: 100
                })
                ux++
            }else{
                clearInterval(intttx);
                // delete inttt
                return false
            }
        },50)*/


        //Main octahedron
        scene.add(mesh);

        modifier = new ModifierStack(mesh);
        /*const taper = new Taper(2);
        taper.setFalloff(2, 5);

        (()=>{
            TweenMax.fromTo(
                taper,
                1,
                {
                    frc: 0
                },
                {
                    frc: 1,
                    ease: Back.easeInOut,
                    yoyo: true,
                    repeat: 999
                }
            );
        })()
        modifier.addModifier(taper)
        modifier && modifier.apply();*/

        //console.log(meshCircles)

/*        let angle = 0;
        const userDefined = new UserDefined();
        userDefined.renderVector = (vec, i)=>{
            vec.setValue(ModConstant.X, vec.x + Math.sin(i * 0.2 + angle) * -.05);
            vec.setValue(ModConstant.Z, vec.z + Math.sin(i * 0.2 + angle) * -.05);
            vec.setValue(ModConstant.Y, vec.y + Math.sin(i * 0.2 + angle) * -.05);
        };
        userDefined.addEventListener("CHANGE", function() {
            angle += .01;
        });

        modifier.addModifier(userDefined);*/
        //modifier && modifier.apply();

        //circles on map
        const circ=new THREE.CircleBufferGeometry(0.02,12);
        //const geometryCurve1 = new THREE.BufferGeometry();
        // console.log(geometry)
//        geometry.faces.map(point=>{
            /*const curve = new THREE.EllipseCurve(
                0,  0,            // ax, aY
                .08, .08,           // xRadius, yRadius
                0,  2 * Math.PI,  // aStartAngle, aEndAngle
                false,            // aClockwise
                0                 // aRotation
            );
            const points = curve.getPoints( 24 );*/
            //console.log(point.vertexNormals)
            // setInterval(()=>{

                /*const m=new THREE.LineBasicMaterial({
                    color:new THREE.Color(255, Math.random(), Math.random()),
                    //linewidth:5,
                    transparent:true
                })*/
                // const vertexShade=`
                // varying vec2 vUv;
                // void main(){
                //     vUv = uv;
                //     gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
                // }
                // `;
                // const fragmentShader=`
                //   varying vec2 vUv;
                //   uniform vec3 color;
                //   void main () {
                //     gl_FragColor = vec4(color, 1.0);
                //   }
                // `;
                // const m=new THREE.ShaderMaterial({
                //     transparent:true,
                //     vertexShade,
                //     fragmentShader,
                //     //side:THREE.DoubleSide,
                //     uniforms:{
                //         color:{value:new THREE.Color('red')}
                //     }
                // })
// PLANES
//             cylinderMesh(point.vertexNormals[0],point.vertexNormals[1],material)
            //     const ellipse = new THREE.Line(
            //         new THREE.BufferGeometry().setFromPoints(
            //         // new THREE.BufferGeometry().setFromPoints(
            //             point.vertexNormals
            //         ),
            //         m
            //     );
            //     ellipse.scale.x=1.06
            //     ellipse.scale.y=1.06
            //     ellipse.scale.z=1.06
            //     //ellipse.lookAt(new THREE.Vector3());
            // //console.log(ellipse)
            //
            //
            //     scene.add(ellipse);
            //     parent.add(ellipse);
            // },2000)
            //console.log(ellipse)

            //anime({targets:ellipse.opacity,opacity:[0xffffff,0x000000],duration:1000,loop:true,easeng:'linear'})


//        });

//points on a big sphere
        const mpnts=new THREE.MeshBasicMaterial( { color: 0x2359bb,side:THREE.BackSide,transparent:true, opacity:1 } );
        pnts.map(point=>{
            //console.log(point)
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
            circlesAnimatedAr.push(mesh)
        });
//animation main icosah points cilinder material
        let uu=0,inttt=null;
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
        },50)
        //\Main octahedron

        /** Text */
        const fontLoader = new THREE.FontLoader();
        // let cacheFont=null;
        fontLoader.load('font-roboto.json',(font)=>{
                const txt1=createText('Rand',[.64,1,-.3],[0,1.95,0],.05,font)
                const txt2=createText('Bitcoin',[.64,.89,-.3],[0,1.95,0],.05,font,0x84B3DF);
            const txt3=createText('Bluetooth',[.617,.97,-.14],[0,1.95,0],.03,font,0x8a8a8a);
            const txt4=createText('Luxembourg',[.617,.91,-.14],[0,1.95,0],.03,font,0x84B3DF);
                const txt5=createText('String',[.88,.68,-.23],[0,1.95,0],.03,font,0x8a8a8a);
                const txt6=createText('Malta',[.88,.62,-.23],[0,1.95,0],.03,font,0x84B3DF);
            const txt7=createText('Jabascribt',[.422,1.105,.142],[0,1.2,0],.03,font,0x8a8a8a);
            const txt8=createText('London',[.422,1.05,.142],[0,1.2,0],.03,font,0x84B3DF);
                const txt9=createText('Golang',[-0.7738271,.83213199,.228805],[0,-1.3,0],.03,font,0x8a8a8a);
                const txt10=createText('USA',[-0.7738271,.78213199,.228805],[0,-1.3,0],.03,font,0x84B3DF);
            const txt11=createText('Future',[-.2,.9,.69],[0,-.4,0],.03,font,0x8a8a8a);
            const txt12=createText('USA',[-.2,.84,.69],[0,-.4,0],.03,font,0x84B3DF);
                const txt13=createText('Freedom',[-0.01,.687274,-.90168],[0,3.1,0],.03,font,0x8a8a8a);
                const txt14=createText('Hong Kong',[-0.01,.637274,-.90168],[0,3.1,0],.03,font,0x84B3DF);
            const txt15=createText('Labtob',[.3682314,.138,-.99022],[0,2.8,0],.03,font,0x8a8a8a);
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
                        addNewParticle({q:[.62,.815,-.13],w:[.7,.8,-.2],e:[.6,1,-.25],r:[.652,.765,-.27]},5);
                        const c2=addMapInf([.63,.92,-.13],[.63,.84,-.13]);
                        anime({targets:c2[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:100,easing:'linear'});
                        anime({targets:c2[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,easing:'linear'});
                    }
                }).add({
                    targets:txt5.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear'
                }).add({//Malta
                    targets:txt6.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        // addNewParticle({q:[.8,.55,-.2139],w:[1,.765,-.3],e:[1,.765,-.27],r:[.652,.765,-.27]},5);
                        const c4=addMapInf([.89,.63,-.2139],[.89,.55,-.2139]);
                        anime({targets:c4[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:100,easing:'linear'});
                        anime({targets:c4[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,easing:'linear'});
                    }
                }).add({
                    targets:txt7.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear'
                }).add({//lond
                    targets:txt8.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        // addNewParticle({q:[.4278,.906,.13],w:[.8,1,.2],e:[.8,1,0],r:[.652,.765,-.27]},12);
                        const c3=addMapInf([.422,1.05,.152],[.422,.96,.152]);
                        anime({targets:c3[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:100,easing:'linear'});
                        anime({targets:c3[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,easing:'linear'});
                    }
                }).add({
                    targets:txt11.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',delay:4000
                }).add({//usa 2
                    targets:txt12.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        // addNewParticle({q:[-.2139,.7738,.6921],w:[.9,.9,1.2],e:[1.2,1.2,.9],r:[.652,.765,-.27]},20);
                        const c6=addMapInf([-.2139,.85,.6921],[-0.2138805, 0.773827135, 0.692131996]);
                        anime({targets:c6[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:2000,easing:'linear'});
                    }
                }).add({
                    targets:txt9.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',delay:4000
                }).add({//usa
                    targets:txt10.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        // addNewParticle({q:[-0.7738271,.69213199,.2138805],w:[.7,1.4,1.2],e:[.2,1.5,.4],r:[.652,.765,-.27]},20)
                        const c5=addMapInf([-0.7738271,.777,.2138805],[-.7738271,.69213199,.21388055]);
                        anime({targets:c5[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:2000,easing:'linear'});
                    }
                }).add({
                   targets:txt13.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',delay:30000
                }).add({//hong
                    targets:txt14.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        // addNewParticle({q:[0,.58,-.916],w:[.6,1,-1.5],e:[.7,.8,-1],r:[.652,.765,-.27]},20);
                        const c7=addMapInf([0,.637274,-.916],[0,.5572749,-.916]);
                        anime({targets:c7[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:100,easing:'linear'});
                        anime({targets:c7[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,easing:'linear'});
                    }
                }).add({
               targets:txt15.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear'
            }).add({//singapug
                   targets:txt16.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        // addNewParticle({q:[.3782314,.09,-.99022],w:[1,1.2,-1],e:[1,1.2,-1.2],r:[.652,.765,-.27]},20);
                        const c8=addMapInf([.3782314,.09,-.99022],[.3782314,-3.892884016241959e-17,-.990222]);
                        anime({targets:c8[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:100,easing:'linear'});
                        anime({targets:c8[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,easing:'linear'});
                   }
                })
            /*FOR TEST (create font!)*/
            /*let num=0
            //console.log(pnts)
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




    //if(materialCircles)materialCircles.uniforms.time.value=time/2;
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

        lightHolder.quaternion.copy(camera.quaternion);
        // modifier && modifier.apply();

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
            /*shininess: 10*/
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
//
// function PointHelper(color, size, position) {
//     THREE.Mesh.call(this,
//         new THREE.SphereGeometry(1.0, 16, 16),
//         new THREE.MeshBasicMaterial({
//             color: 0xff0000,
//             //wireframe: true
//         })
//     );
//
//     position && this.position.copy(position);
// }
// PointHelper.prototype = Object.create(THREE.Mesh.prototype);
// PointHelper.prototype.constructor = PointHelper;
//
// function LineHelper(points, params) {
//     const g = new THREE.Geometry();
//     const m = new THREE.LineBasicMaterial(params);
//
//     g.vertices = points;
//
//     THREE.Line.call(this, g, m);
// }
// LineHelper.prototype = Object.create(THREE.Line.prototype);
// LineHelper.prototype.constructor = LineHelper;

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