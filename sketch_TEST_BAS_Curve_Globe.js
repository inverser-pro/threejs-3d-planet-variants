global.THREE = require("three");
require("three/examples/js/controls/OrbitControls")
require('three/examples/js/utils/BufferGeometryUtils')
const anime = require('animejs/lib/anime.min')

/*
const {
    ModifierStack,
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
*/

const canvasSketch = require("canvas-sketch");

const settings = {
    animate: true,
    context: "webgl"
};

const sketch = ({ context }) => {
    const renderer = new THREE.WebGLRenderer({
        canvas: context.canvas
    });
    renderer.setClearColor("#000", 0);
    const camera = new THREE.PerspectiveCamera(12, 1/*window.innerWidth / window.innerHeight*/, .01, 100);
    camera.position.set(9, 6, -3.5);
    const controls = new THREE.OrbitControls(camera, context.canvas);
    const scene = new THREE.Scene();

    //BEGIN

    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min
    };

    const o={};


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
            // parent.add(this.ellipse)
            // this.ellipse.rotation.x=this.getRandomFloat(0,5)
            // this.ellipse.rotation.y=this.getRandomFloat(0,5)
            // this.ellipse.rotation.z=this.getRandomFloat(0,5)
            return this.ellipse;
        }
        // getRandomFloat(min, max) {
        //     return Math.random() * (max - min) + min
        // };
        update(){
        }
    }


    o.geometry = new THREE.IcosahedronGeometry(1.06,4);
    // o.geometry = new THREE.OctahedronGeometry(1.06,10);
    // o.geometry = new THREE.TetrahedronGeometry(1.06,5);
    o.material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        wireframe: true,
        opacity:1,
        transparent:true,
        //wireframeLinewidth:1.5,
        //side:THREE.DoubleSide,
    });

    o.materialIcosahedron = new THREE.MeshPhongMaterial({
        opacity: 0,
        transparent: true
    });
    // const mesh = new THREE.Mesh(geometry,materialIcosahedron);
    o.mesh = new THREE.Mesh(o.geometry,o.material);
    o.pnts=o.geometry.vertices;
    scene.add(o.mesh)

    // o.w=360;
    // o.h=180;
    // o.d=document;
    // o.c=o.d.createElement('canvas');
    // o.cnt=o.c.getContext('2d');
    // o.c.width=o.w;
    // o.c.height=o.h;
    // o.c.classList.add('tmpCanvas');
    // o.d.body.appendChild(o.c);
    //
    // o.s=o.d.createElement('style');
    // o.s.innerText=`.tmpCanvas{position:absolute;z-index:-9;width:0;height:0;overflow:hidden}`;
    // o.d.body.appendChild(o.s);
    // let materialCircles=null;
    // o.img=new Image();
    // o.img.src='map.png';
    // o.img.onload=()=>{
    //
    //     //MAP
    //     o.cnt.drawImage(o.img,0,0,o.w,o.h)
    //     o.data = o.cnt.getImageData(0, 0, o.w, o.h);
    //     o.data = o.data.data;
    //     o.ar=[];
    //     for(let y = 0; y < o.w; y++) {
    //         for(let x = 0; x < o.w; x++) {
    //             const a=o.data[((o.w*y)+x)*4+3];
    //             if(a>140){
    //                 o.ar.push([x-o.w,y-o.w/6.2])
    //             }
    //         }
    //     }
    //
    //     //helpers
    //     o.lonHelper = new THREE.Object3D();
    //     scene.add(o.lonHelper);
    //     // We rotate the latHelper on its X axis to the latitude
    //     o.latHelper = new THREE.Object3D();
    //     o.lonHelper.add(o.latHelper);
    //     // The position helper moves the object to the edge of the sphere
    //     o.positionHelper = new THREE.Object3D();
    //     o.positionHelper.position.z = .5;
    //     // positionHelper.position.z = Math.random();
    //     o.latHelper.add(o.positionHelper);
    //     // Used to move the center of the cube so it scales from the position Z axis
    //     o.originHelper = new THREE.Object3D();
    //     o.originHelper.position.z=.5;
    //     o.positionHelper.add(o.originHelper);
    //     o.lonFudge=Math.PI*.5;
    //     o.latFudge=Math.PI*-0.135;
    //     //\helpers
    //     o.geometries=[];
    //
    //     o.nAr=[];
    //     o.counter=0;
    //     for(let i=0;i<o.ar.length;i=i+2){
    //         o.counter++;
    //         //-89 ... 0 ... 87
    //         if(
    //             o.ar[i-1]!==undefined
    //             &&Math.abs(Math.round(o.ar[i-1][1]))%2==1
    //         ){o.nAr.push(o.ar[i])}
    //     };
    //     o.counter2=0;
    //
    //     o.materialCircles = new THREE.ShaderMaterial({
    //         side:THREE.FrontSide,
    //         transparent:  true,
    //         vertexShader:
    //         `
    //         varying vec2 vUv;
    //         attribute float alpha;
    //         varying float vAlpha;
    //         uniform float time;
    //         void main() {
    //             vUv=uv;
    //             vAlpha = alpha;
    //             // vec4 mvPosition = modelViewMatrix * vec4( vec3(position.x+time,position.y+time,position.z+time), 1.0 );
    //             // vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    //             vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    //             gl_PointSize = .1;
    //             gl_Position = projectionMatrix * mvPosition;
    //         }
    //     `,
    //         fragmentShader:
    //         `
    //         varying vec2 vUv;
    //         uniform vec3 color;
    //         varying float vAlpha;
    //         uniform float time;
    //         void main() {
    //             vec2 center = vec2(.5,.5);
    //             float d = distance(vUv,center);
    //             float mask = d > .5 ? 1. : .0;
    //             mask=1.-mask;
    //             //gl_FragColor=vec4(vec3(mask/4.),vAlpha);
    //             gl_FragColor = vec4( vec3(mask/4.), vAlpha );
    //         }
    //     `,
    //         /*fragmentShader:`
    //             varying vec2 vUv;
    //             uniform vec3 color;
    //             //uniform float time;
    //             void main(){
    //                 vec2 center = vec2(.5,.5);
    //                 float d = distance(vUv,center);
    //                 float mask = d > .5 ? 1. : .0;
    //                 mask=1.-mask;
    //                 // gl_FragColor=vec4(0.,0.,0.,1.);
    //                 // gl_FragColor=vec4(vec3(mask),1.);
    //                 gl_FragColor=vec4(vec3(mask/4.),0.);
    //                 // gl_FragColor=vec4(vec3(vUv.y+sin(time),vUv.y,vUv.y),1.);
    //             }
    //         `,*/
    //         /*vertexShader:`
    //             varying vec2 vUv;
    //             void main(){
    //                 vUv=uv;
    //                 gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1. );
    //             }
    //         `,*/
    //         uniforms:{
    //             time:{value:0},
    //             color:{value:0xffffff},
    //         }
    //     });
    //     o.countAr=o.nAr.length;
    //     o.counterTemp=0;
    //     o.s1=.014;
    //
    //     //create map
    //     o.nAr.map(e=>{
    //         o.counter2++;
    //         (o.counter2 > o.countAr/2+200)?o.s1+=-.00001:o.s1+=+.00001;
    //         const geometry=new THREE.PlaneBufferGeometry(o.s1,o.s1);
    //         o.lonHelper.rotation.y = THREE.MathUtils.degToRad(e[0])+o.lonFudge;
    //         const w=o.latHelper.rotation.x = THREE.MathUtils.degToRad(e[1])+o.latFudge;
    //         o.originHelper.updateWorldMatrix(true,false);
    //         geometry.applyMatrix4(o.originHelper.matrixWorld);
    //         if(w-o.prewLatX===0&&o.counter2%2==0){
    //             const numVertices = geometry.attributes.position.count;
    //             const alphas = new Float32Array( numVertices * 1 ); // 1 values per vertex
    //             for( let i = 0; i < numVertices; i ++ ) {
    //                 alphas[ i ] = 1;
    //             }
    //             geometry.setAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );
    //             o.geometries.push(geometry);
    //         }
    //         o.prewLatX=w;
    //     });
    //     //console.log(o.geometries.length*4)
    //     o.geometryCircles = THREE.BufferGeometryUtils.mergeBufferGeometries(o.geometries, false);
    //     o.meshCircles = new THREE.Mesh(o.geometryCircles, o.materialCircles);
    //
    //     //\create map
    //     scene.add(o.meshCircles);
    //     // delete o
    //     //\MAP
    //
    // }

    //\END

    // const geometry0 = new THREE.SphereBufferGeometry( 1, 1, 1 );
    //
    // const wireframe = new THREE.WireframeGeometry( o.geometry );
    //
    // const line = new THREE.LineSegments( wireframe );
    // line.material.depthTest = false;
    // line.material.opacity = 0.25;
    // line.material.transparent = true;
    // line.material.linewidth = 3;
    //
    // scene.add( line );


    //TEST NEW 2021-01-20-18-05
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

        const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(q.q[0],q.q[1],q.q[2]),
            new THREE.Vector3(q.w[0],q.w[1],q.w[2]),
            new THREE.Vector3(q.w[0],q.w[1],q.w[2]),
            new THREE.Vector3(q.r[0],q.r[1],q.r[2])
        );
        const pointsCurve = curve.getPoints(24);
        const geometryCurve = new THREE.BufferGeometry().setFromPoints( pointsCurve );
        const materialCurve = new THREE.LineBasicMaterial( { color : 0xffffff } );
        // Create the final object to add to the scene
        const curveObject = new THREE.Line( geometryCurve, materialCurve );
        //curveObject.lookAt(new THREE.Vector3());
        scene.add(curveObject);
        return curveObject;//////////////////
    }
    let arEdgesBoxes=[];
    let ugh=0
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
            const edgeGeometry = new THREE.PlaneBufferGeometry(.003, direction.length());
            const edge = new THREE.Mesh(edgeGeometry, material);
            //edgeGeometry.center(edge.position);
            edge.applyMatrix4(orientation);
            // position based on midpoints - there may be a better solution than this
            edge.position.x = (pointY.x + pointX.x) / 1.9;
            edge.position.y = (pointY.y + pointX.y) / 1.9;
            edge.position.z = (pointY.z + pointX.z) / 1.9;
            // edge.scale.x = 1.16
            // edge.scale.y = 0
            // edge.scale.z = 1.16
            scene.add(edge);
            // edge.geometry.center();
            //делает обратным появлине (ни сверху вниз, а наоборот)
            //edge.position.multiplyScalar(-1);
            arEdgesBoxes.push(edge)
            //lineAniCenter.add(edge)
        }
        // return edge;

    }

    // setTimeout(()=>{
    //     let uf=0,intery=null;
    //     intery=setInterval(()=>{
    //         if(uf<=arEdgesBoxes.length) {
    //             if(arEdgesBoxes[uf]) {
    //                 anime({
    //                     targets: arEdgesBoxes[uf].scale,
    //                     y: [0, 1],
    //                     duration: 2000,
    //                     delay: 5000,
    //                     easing: 'easeInOutQuint',
    //                     loop: true,
    //                     direction:'alternate'
    //                 })
    //                 uf++
    //             }
    //         }else{
    //             clearInterval(intery)
    //             return
    //         };
    //     },100)
    // },1000)

    const material = new THREE.MeshPhongMaterial({
        color: 0x2359bb,
        // wireframe: true,
        // wireframeLinewidth:1.5,
        side:THREE.DoubleSide,
    });
    let iu=0
    o.pnts.map(point=> {
//         const curve = new THREE.EllipseCurve(
//             0, 0,            // ax, aY
//             .08, .08,           // xRadius, yRadius
//             0, 2 * Math.PI,  // aStartAngle, aEndAngle
//             false,            // aClockwise
//             0                 // aRotation
//         );
//         const points = curve.getPoints(24);
//         //console.log(point.vertexNormals)
//
//         const m = new THREE.MeshBasicMaterial({
//             transparent: true,
//             side:THREE.DoubleSide,
//             opacity:0,
//             color:0xff0000
//         })
// // PLANES
//         cylinderMesh(point.vertexNormals[0], point.vertexNormals[1], material)
//         const ellipse = new THREE.Line(
//             new THREE.BufferGeometry().setFromPoints(
//                 // new THREE.BufferGeometry().setFromPoints(
//                 point.vertexNormals
//             ),
//             m
//         );
//         ellipse.scale.x = 1.06
//         ellipse.scale.y = 1.06
//         ellipse.scale.z = 1.06
//
//         scene.add(ellipse);

        if(iu%20===0){
            console.log(point)
            // const curve=new CurveNew(1);
            // curve.position.copy(point.vertexNormals[1]);
            // curve.lookAt(new THREE.Vector3())
        }
        iu++
    });

    createCurve({q:[ 0.6510968208312988, 0, -0.836464524269104],w:[0.5016295313835144, -0.7259650826454163, -0.5873180627822876],r:[ 1.0519939661026, 0, 0.13003359735012054]});
    const light=new THREE.DirectionalLight(0xffffff,1);
    light.position.set(0,3,0);
    scene.add(light)

    //\TEST NEW 2021-01-20-18-05



// let tmp=qwe=0

    return {
        resize({pixelRatio, viewportWidth, viewportHeight}) {
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(viewportWidth, viewportHeight, false);
            camera.aspect = viewportWidth / viewportHeight;
            camera.updateProjectionMatrix();
        },
        render({time}) {
            // tmp++;
            /*if(o.meshCircles&&tmp%1===0){

                console.log(time)
            }*/


            // if(o.meshCircles){
            //     const alphas = o.meshCircles.geometry.attributes.alpha;
            //     const count = alphas.array.length;
            //     let r=Math.round(getRandomFloat(0,count));
            //     r=r-r%4
            //     if(r==count){r=r-3}
            //
            //     const a=new Array();
            //     for (let i=0;i<4;i++){
            //         a.push(r+i)
            //     }
            //     // if(tmp%5==0){
            //     //     console.log(alphas.array[a[0]])
            //     // }
            //      //if(time%20===0){
            //         for(let i=0;i<a.length;i++){
            //             let q=alphas.array[a[i]];
            //             //if(q<1)alphas.array[a[i]]=(alphas.array[a[i]]+.4).toFixed(1)
            //             //alphas.array[a[i]]=1
            //             //setInterval(()=>{
            //                 //     (q>=1)?q+=-.1:q+=.1;
            //                 //     alphas.array[a[i]] = q;
            //
            //             // setInterval(()=>{
            //             //     if(q==1){
            //             //
            //             //         if(q<1){
            //             //             alphas.array[a[i]]+=.01;
            //             //         }else{
            //             //             alphas.array[a[i]]-=.01;
            //             //         }
            //             //     }else{
            //             //         if(q<1){
            //             //             alphas.array[a[i]]+=.01;
            //             //         }
            //             //     }
            //             // },2)
            //
            //             //},200)
            //             // console.log(alphas.array[a[i]])
            //         }
            //         alphas.needsUpdate = true;
            //      //}
            // }
            // tmp++



            controls.update();
            renderer.render(scene, camera);
        }

    };
}

const dd=document;
// dd.body.setAttribute('style','background-color:#161831');
dd.body.setAttribute('style','background-color:#161831');
canvasSketch(sketch, settings);