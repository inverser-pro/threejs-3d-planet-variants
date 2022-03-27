global.THREE = require("three");
require("three/examples/js/controls/OrbitControls")
require('three/examples/js/utils/BufferGeometryUtils')
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

//const BAS = require('bas.min.1.3.0')

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
    const camera = new THREE.PerspectiveCamera(120, 1/*window.innerWidth / window.innerHeight*/, .01, 100);
    camera.position.set(9, 6, -3.5);
    const controls = new THREE.OrbitControls(camera, context.canvas);
    const scene = new THREE.Scene();

    //BEGIN

/*    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min
    };*/

    const o={};

    o.geometry = new THREE.IcosahedronGeometry(1.06,3);
    o.material = new THREE.MeshPhongMaterial({
        color: 0x2359bb,
        wireframe: true,
        wireframeLinewidth:1.5,
        side:THREE.DoubleSide,
    });

    o.materialIcosahedron = new THREE.MeshPhongMaterial({
        opacity: 0,
        transparent: true
    });
    // const mesh = new THREE.Mesh(geometry,materialIcosahedron);
    o.mesh = new THREE.Mesh(o.geometry,o.material);
    o.pnts=o.geometry.vertices;
    //scene.add(o.mesh)

    const light=new THREE.DirectionalLight(0xffffff,1);
    light.position.set(0,3,0);
    scene.add(light)


    o.w=360;
    o.h=180;
    o.d=document;
    o.c=o.d.createElement('canvas');
    o.cnt=o.c.getContext('2d');
    o.c.width=o.w;
    o.c.height=o.h;
    o.c.classList.add('tmpCanvas');
    o.d.body.appendChild(o.c);

    o.s=o.d.createElement('style');
    o.s.innerText=`.tmpCanvas{position:absolute;z-index:-9;width:0;height:0;overflow:hidden}`;
    o.d.body.appendChild(o.s);
    let materialCircles=null;
    o.img=new Image();
    o.img.src='map.png';
    o.img.onload=()=>{

        //MAP
        o.cnt.drawImage(o.img,0,0,o.w,o.h)
        o.data = o.cnt.getImageData(0, 0, o.w, o.h);
        o.data = o.data.data;
        o.ar=[];
        for(let y = 0; y < o.w; y++) {
            for(let x = 0; x < o.w; x++) {
                const a=o.data[((o.w*y)+x)*4+3];
                if(a>140){
                    o.ar.push([x-o.w,y-o.w/6.2])
                }
            }
        }

        //helpers
        o.lonHelper = new THREE.Object3D();
        scene.add(o.lonHelper);
        // We rotate the latHelper on its X axis to the latitude
        o.latHelper = new THREE.Object3D();
        o.lonHelper.add(o.latHelper);
        // The position helper moves the object to the edge of the sphere
        o.positionHelper = new THREE.Object3D();
        o.positionHelper.position.z = .5;
        // positionHelper.position.z = Math.random();
        o.latHelper.add(o.positionHelper);
        // Used to move the center of the cube so it scales from the position Z axis
        o.originHelper = new THREE.Object3D();
        o.originHelper.position.z=.5;
        o.positionHelper.add(o.originHelper);
        o.lonFudge=Math.PI*.5;
        o.latFudge=Math.PI*-0.135;
        //\helpers
        o.geometries=[];

        o.nAr=[];
        o.counter=0;
        for(let i=0;i<o.ar.length;i=i+2){
            o.counter++;
            //-89 ... 0 ... 87
            if(
                o.ar[i-1]!==undefined
                &&Math.abs(Math.round(o.ar[i-1][1]))%2==1
            ){o.nAr.push(o.ar[i])}
        };
        o.counter2=0;

        o.materialCircles = new THREE.ShaderMaterial({
            side:THREE.DoubleSide,
            transparent:  true,
            vertexShader:
            `
            varying vec2 vUv;
            uniform float time;
            void main() {
                vUv=uv;
                // vec4 mvPosition = modelViewMatrix * vec4( vec3(position.x+time,position.y+time,position.z+time), 1.0 );
                // vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                //vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                //gl_PointSize = .1;
                // gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * (vec4(position,1.));
                gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * (vec4(position,1.));
            }
        `,
            fragmentShader:
            `
            varying vec2 vUv;
            uniform float time;
            void main() {
                // vec2 center = vec2(.5,.5);
                // float d = distance(vUv,center);
                // float mask = d > .5 ? 1. : .0;
                // mask=1.-mask;
                // //gl_FragColor=vec4(vec3(mask/4.),vAlpha);
                gl_FragColor = vec4( vec3(1.,1.,1.), 1 );
            }
        `,
            /*fragmentShader:`
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
            `,*/
            /*vertexShader:`
                varying vec2 vUv;
                void main(){
                    vUv=uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1. );
                }
            `,*/
            uniforms:{
                time:{value:0},
                color:{value:0xffffff},
            }
        });
        o.countAr=o.nAr.length;
        o.counterTemp=0;
        o.s1=.014;

        const geometryForInst=new THREE.PlaneBufferGeometry(.2,.2);
        const arle=o.nAr.length;
        const objForInst=new THREE.InstancedMesh(geometryForInst,o.materialCircles,arle);
        let dummy=new THREE.Object3D();
        let counter=0;

        /*for(let i=-arle/2;i<arle/2;i++){
            for(let j=-arle/2;j<arle/2;j++){*/
                //dummy.position.set(i/10,j/10,0);
                // if(counter%500===0)console.log(i/10)
        o.nAr.map(e=>{
            o.lonHelper.rotation.y = THREE.MathUtils.degToRad(e[0])+o.lonFudge;
            const w=o.latHelper.rotation.x = THREE.MathUtils.degToRad(e[1])+o.latFudge;
            o.originHelper.updateWorldMatrix(true,false);
            // dummy.lookAt(new THREE.Vector3());
            dummy.applyMatrix4(o.originHelper.matrixWorld);
            if(w-o.prewLatX===0&&o.counter2%2==0){
                /*const numVertices = geometry.attributes.position.count;
                const alphas = new Float32Array( numVertices * 1 ); // 1 values per vertex
                for( let i = 0; i < numVertices; i ++ ) {
                    alphas[ i ] = 1;
                }*/
                //geometry.setAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );
                //o.geometries.push(geometry);
                dummy.updateMatrix();
                objForInst.setMatrixAt(counter++,dummy.matrix)
            }
            o.prewLatX=w;
            scene.add(objForInst)
            //objForInst.position.z=.01
        })
        console.log(counter)

            /*}
            scene.add(objForInst)
            objForInst.position.z=.01
        }*/


        //create map
        /*o.nAr.map(e=>{
            o.counter2++;
            (o.counter2 > o.countAr/2+200)?o.s1+=-.00001:o.s1+=+.00001;
            const geometry=new THREE.PlaneBufferGeometry(o.s1,o.s1);
            o.lonHelper.rotation.y = THREE.MathUtils.degToRad(e[0])+o.lonFudge;
            const w=o.latHelper.rotation.x = THREE.MathUtils.degToRad(e[1])+o.latFudge;
            o.originHelper.updateWorldMatrix(true,false);
            geometry.applyMatrix4(o.originHelper.matrixWorld);
            if(w-o.prewLatX===0&&o.counter2%2==0){
                const numVertices = geometry.attributes.position.count;
                const alphas = new Float32Array( numVertices * 1 ); // 1 values per vertex
                for( let i = 0; i < numVertices; i ++ ) {
                    alphas[ i ] = 1;
                }
                geometry.setAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );
                o.geometries.push(geometry);
            }
            o.prewLatX=w;
        });*/
        //console.log(o.geometries.length*4)
/*        o.geometryCircles = THREE.BufferGeometryUtils.mergeBufferGeometries(o.geometries, false);
        o.meshCircles = new THREE.Mesh(o.geometryCircles, o.materialCircles);

        //\create map
        scene.add(o.meshCircles);*/
        // delete o
        //\MAP

    }

    //\END
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