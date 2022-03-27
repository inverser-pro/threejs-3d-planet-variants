global.THREE = require("three");
require("three/examples/js/controls/OrbitControls")
require('three/examples/js/utils/BufferGeometryUtils')

const anime = require('animejs/lib/anime.min')
const TWEEN = require('Tween.min-test-shader.js')
const MeshLine=require('three.meshline/src/THREE.MeshLine')
const canvasSketch = require("canvas-sketch");

const settings = {
  animate: true,
  context: "webgl"
};

const sketch = ({ context }) => {
    let materialCircles=null;
    let parent=null;
    const timeRotate=200000
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: context.canvas
    });
    renderer.domElement.setAttribute('class','canvas')
    //renderer.domElement.setAttribute('style',`position:absolute;top:3rem;height:${window.innerHeight}px`)
    renderer.domElement.setAttribute('style',`position:absolute;right:0;max-width:100%;top:5rem`)
    // WebGL background color
    renderer.setClearColor("#000", 0);
    // Setup a camera
    const camera = new THREE.PerspectiveCamera(12,window.innerWidth / window.innerHeight,.01,100);
    /* CAMERA NORM POS */
    if(window.innerWidth<800){
        camera.position.set(18,6,-3.5);
    }else{
        camera.position.set(10.5,4,-3.5);
        camera.setViewOffset(10, 10, -2, .5, 9, 9)
    }

    // Setup camera controller
    const controls = new THREE.OrbitControls(camera, context.canvas);
    //controls.listenToKeyEvents( window ); // optional

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)



    //controls.screenSpacePanning = false;

    ///controls.minDistance = 100;
    //controls.maxDistance = 500;

    //controls.maxPolarAngle = Math.PI / 2;
    // Setup your scene
    const scene = new THREE.Scene();
//BEGIN
    const lightHolder = new THREE.Group();
    const geometry = new THREE.IcosahedronGeometry(1.0,2);


    //TEST BOX
/*    const bbox=new THREE.BoxGeometry(.5,.5);
    // const bboxx = new THREE.Mesh(bbox,new THREE.MeshBasicMaterial({color:new THREE.Color(0x000000)}));
    const bboxx = new THREE.Mesh(bbox,new THREE.MeshPhongMaterial({
        color:0xffffff,
        side:THREE.FrontSide
    }));
    bboxx.position.set(-1.5,1.7,.7);
    //scene.add(bboxx);
    lightHolder.add(bboxx);*/
    //\TEST BOX

    //LIGHT

    const userAgent = window.navigator.userAgent;

    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
        //send simple light to yaphone
        const aLight=new THREE.DirectionalLight(0xffffff,2);
        // const aLight=new THREE.PointLight(0xff0000,6);

        //const aLight=new THREE.HemisphereLight(0xff0000,0xff0000,2);
        aLight.position.set(-1.5,1.7,.7);
        lightHolder.add(aLight);

        const aLight2=new THREE.DirectionalLight(0xffffff,2);
        aLight2.position.set(-1.5,0.3,.7);
        lightHolder.add(aLight2);
    }else{
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.03;
        //send shader to normal phones and other devices
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
                            value: new THREE.Color(0x091e5a)
                        }
                    },
                    vertexShader: `
                uniform float c;
                uniform float p;
                varying float intensity;
                void main() {
                  vec3 vNormal = normalize( normalMatrix * normal );
                  vec3 vNormel = normalize( normalMatrix * vec3(1.,1.,1.) );
                  intensity = pow( c - dot(vNormal, vNormel), p );
                  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,
                    fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() 
                {
                  vec3 glow = glowColor * intensity;
                  gl_FragColor = vec4( vec3(glow.r,glow.g,glow.b), 1. );
                }`,
                    side: THREE.FrontSide,
                    depthWrite: false,
                    depthTest: false,
                    // wireframe:true,
                    blending: THREE.AdditiveBlending,
                    //blending: THREE.SubtractiveBlending,
                    transparent: true
                });
                return glowMaterial;
            }

            // const geometrySphere=new THREE.IcosahedronGeometry(1.0575,9);
            // const geometrySphere=new THREE.IcosahedronGeometry(1.051,9);
            const geometrySphere=new THREE.SphereBufferGeometry(1.051, 64, 36)
            const meshGeo=new THREE.Mesh(geometrySphere,mmm( .7, 2));
        /*    meshGeo.rotation.y=1.5;
            meshGeo.rotation.x=-1.5;*/
            meshGeo.rotation.y=.4;
            meshGeo.rotation.x=-3;
            //scene.add(meshGeo)
            lightHolder.add(meshGeo);

//\OUTER GLOW

    }
//\LIGHT
    const materialIcosahedron = new THREE.MeshBasicMaterial({
        opacity: 0,
        transparent: true
    });
    const mesh = new THREE.Mesh(geometry,materialIcosahedron);
    parent=mesh;
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
    ];
    //HIDE BACK
    const geomHide = new THREE.SphereBufferGeometry(1.0499, 64, 36);
    //const matHide=new THREE.MeshBasicMaterial({color:new THREE.Color(0x051f38)});
    //const matHide=new THREE.MeshBasicMaterial({color:new THREE.Color(0x000000)});
    const matHide=new THREE.MeshStandardMaterial({color:new THREE.Color(0x091e5a)});
    //CHANGE SHADOW PLANET
/*    const matHide=new THREE.MeshPhongMaterial({
        color:0x091e5a,
        side:THREE.FrontSide,
        shininess: 94
    })*/
    // const matHide=new THREE.MeshStandardMaterial({color:new THREE.Color(0x161730)});

    const meshHide= new THREE.Mesh(geomHide, matHide);
    scene.add(meshHide);
    //\HIDE BACK
//MOON
//     const sphereGlow=new THREE.IcosahedronBufferGeometry(1.0573,9);
    /*const sphereGlow=new THREE.IcosahedronBufferGeometry(1.06,9);
    const materialGlow=	new THREE.ShaderMaterial({
            uniforms:
                {
                    "c":   { type: "f", value: 1.0 },
                    "p":   { type: "f", value: 1.4 },
                    glowColor: { type: "c", value: new THREE.Color(0x161831) },
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
/!*    moonGlow.rotation.y=-1.8;
    moonGlow.rotation.x=.3;*!/
    scene.add( moonGlow );
    lightHolder.add(moonGlow);
    */
    //\ MOON
    scene.add(lightHolder);
//LINES
// Строим массив точек
    const lineMesh=[];
    function createMeshLine(dataFromCreateCurve,flat=null){
        // Строим геометрию
        // let color=new THREE.Color(1,getRandomFloat(.5,1.),1);
        // let color=new THREE.Color(.2,.7,1);
        // let color=new THREE.Color(.2,getRandomFloat(.5,.8),1);
        let color=new THREE.Color(.2,THREE.Math.randFloat(.5,.8),1);
        let dashRatio=.5,
            lineWidth=.005
        if(flat){
            color=new THREE.Color(0xffffff);
            dashRatio=.9
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
        const lineMeshMat = new THREE.Mesh(geometryl, materiall);
        lineMeshMat.lookAt(new THREE.Vector3())
        scene.add(lineMeshMat);
        parent.add(lineMeshMat);
        lineMesh.push(lineMeshMat);
        /*function update() {
            // Проверьте, есть ли dash, чтобы остановить анимацию.
            // Уменьшить значение dashOffset анимировать dash.
            lineMesh.material.uniforms.dashOffset.value -= 0.01;
            // requestAnimationFrame(update)
        }
        update()*/

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
        return [cylinder,circleLocation]
    }

    function createText(text,pos,rot,size,font,color=0xffffff){
        text=new String(text);
        const textGeo = new THREE.TextBufferGeometry(text,{
            font,
            size,
            height: .004,
            curveSegments: 12,
        } );
        let textMaterial=new THREE.MeshBasicMaterial({
            color,
            side:THREE.FrontSide
        });
        text=new THREE.Mesh(textGeo,textMaterial);
        text.position.set(pos[0],pos[1],pos[2]);
        text.rotation.set(rot[0],rot[1],rot[2]);
        text.updateMatrix();
        scene.add(text);
        parent.add(text);
        return text;
    }

/*    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min
    };*/
    let meshCircles=null;
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
    obj.img=new Image();
    obj.img.src='map.png';
    obj.img.onload=()=>{
        //loaded=true;
        obj.cnt.drawImage(obj.img,0,0,obj.w,obj.h)
        obj.data = obj.cnt.getImageData(0, 0, obj.w, obj.h);
        obj.data = obj.data.data;
        obj.ar=[];
        const impacts = [];
        for (let i = 0; i < circlePointsAr.length; i++) {
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
        `);
            }

        });
        materialCircles.defines = {"USE_UV" : ""};

        let uty0=0
        obj.ar.map(e=>{
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

                // console.log(geometry.attributes.position)
                // geometry.attributes.position.z=geometry.attributes.position.z*2.1
                geometries.push(geometry);
            }
            obj.prewLatX=w;
        });
        const geometryCircles = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries, false);
        meshCircles = new THREE.Mesh(geometryCircles, materialCircles);
        //meshCircles = new THREE.Mesh(geometryCircles, new THREE.MeshBasicMaterial({color:0xffffff}));
        scene.add(meshCircles);
        parent.add(meshCircles);
        meshCircles.scale.set(1.051,1.051,1.051)

        const tweens2 = [];
        for (let i = 0; i < circlePointsAr.length; i++) {
            tweens2.push({
                runTween:()=>{
                    const tween=new TWEEN.Tween({value:0})
                        .to({ value: 1 }, THREE.Math.randInt(2500,5000))
                        .onUpdate(val=>{
                            uniforms.impacts.value[i].impactRatio = val.value;
                        })
                        .onComplete(()=>{
                            uniforms.impacts.value[i].impactPosition=new THREE.Vector3(circlePointsAr[i][0],circlePointsAr[i][1],circlePointsAr[i][2]);
                            uniforms.impacts.value[i].impactMaxRadius = 5 * THREE.Math.randFloat(0.5, 0.75);
                            tweens2[i].runTween();
                        });
                    tween.start();
                }
            });
        }
        tweens2.map(t=>{t.runTween()});
        obj.c.remove();
        obj.s.remove()

        scene.add(mesh);

        /** Text */
        const fontLoader = new THREE.FontLoader();
        fontLoader.load('font-roboto.json',(font)=>{

            const loader = new THREE.TextureLoader();

// load a resource
            loader.load(
                'texture-2.png',
                function ( texture ) {
                    const material = new THREE.MeshBasicMaterial( {
                        map: texture,
                        side: THREE.DoubleSide,
                        alphaTest:.5
                    });
                    const meshTexture = new THREE.Mesh(
                        new THREE.PlaneGeometry(.235,.235),
                        material
                    );
                    meshTexture.position.set(.62,1,-.37);
                    meshTexture.rotation.set(0,1.95,0);
                    meshTexture.scale.set(0,0,0);
                    scene.add(meshTexture)
                    parent.add(meshTexture)
                    anime({targets:meshTexture.scale,x:[0,.7],y:[0,.7],z:[0,1],duration:600,easing:'linear'})
                },
                undefined,
                function ( e ) {
                    console.error( e );
                }
            );

            const txt1=createText(' ',[.64,1,-.3],[0,1.95,0],.05,font)
                const txt2=createText(' ',[.64,.89,-.3],[0,1.95,0],.05,font,0x84B3DF);
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
            const mainPos=[.662,.8,-.28];
            anime.timeline().add({
                    targets:txt1.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear'
                }).add({
                    targets:txt2.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        //Btc (main)
                        let c1=addMapInf([.66,.95,-.28],mainPos,true);
                        anime({targets:c1[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:100,easing:'linear'});
                        anime({targets:c1[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,easing:'linear'});
                    }
                }).add({
                    targets:txt3.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear'
                }).add({//lux
                    targets:txt4.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        //addNewParticle({q:[.62,.815,-.13],w:[.7,.8,-.2],e:[.6,1,-.25],r:[.652,.765,-.27]},5);
                        createMeshLine(createCurve({q:[.63,.84,-.13],w:[.7,.8,-.2],e:mainPos}))
                        const c2=addMapInf([.63,.92,-.13],[.63,.84,-.13]);
                        anime({targets:c2[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:100,easing:'linear'});
                        anime({targets:c2[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,easing:'linear'});
                    }
                }).add({
                    targets:txt5.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear'
                }).add({//Malta
                    targets:txt6.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        // addNewParticle({q:[.8,.55,-.2139],w:[1,.765,-.3],e:[1,.765,-.27],r:[.652,.765,-.27]},5);
                        createMeshLine(createCurve({q:[.89,.55,-.2139],w:[1,.7,-.3],e:mainPos}))
                        const c4=addMapInf([.89,.63,-.2139],[.89,.55,-.2139]);
                        anime({targets:c4[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:100,easing:'linear'});
                        anime({targets:c4[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,easing:'linear'});
                    }
                }).add({
                    targets:txt7.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear'
                }).add({//lond
                    targets:txt8.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        // addNewParticle({q:[.4278,.906,.13],w:[.8,1,.2],e:[.8,1,0],r:[.652,.765,-.27]},12);
                        createMeshLine(createCurve({q:[.422,.96,.152],w:[.8,1,.2],e:mainPos}))
                        const c3=addMapInf([.422,1.04,.152],[.422,.96,.152]);
                        anime({targets:c3[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:100,easing:'linear'});
                        anime({targets:c3[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,easing:'linear'});
                    }
                }).add({
                    targets:txt11.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',delay:25000
                }).add({//usa 2
                    targets:txt12.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        // addNewParticle({q:[-.2139,.7738,.6921],w:[.9,.9,1.2],e:[1.2,1.2,.9],r:[.652,.765,-.27]},20);
                        createMeshLine(createCurve({q:[-0.2138805, 0.773827135, 0.692131996],w:[.9,.9,1.2],e:mainPos}))
                        const c6=addMapInf([-.2139,.85,.6921],[-0.2138805, 0.773827135, 0.692131996]);
                        anime({targets:c6[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:2000,easing:'linear'});
                    }
                }).add({
                    targets:txt9.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',delay:31000
                }).add({//usa
                    targets:txt10.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        // addNewParticle({q:[-0.7738271,.69213199,.2138805],w:[.7,1.4,1.2],e:[.2,1.5,.4],r:[.652,.765,-.27]},20)
                        createMeshLine(createCurve({q:[-.7738271,.69213199,.21388055],w:[.5,1.6,1.2],e:mainPos}))
                        const c5=addMapInf([-0.7738271,.777,.2138805],[-.7738271,.69213199,.21388055]);
                        anime({targets:c5[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:2000,easing:'linear'});
                    }
                }).add({
                   targets:txt13.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',delay:51000
                }).add({//hong
                    targets:txt14.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        // addNewParticle({q:[0,.58,-.916],w:[.6,1,-1.5],e:[.7,.8,-1],r:[.652,.765,-.27]},20);
                        createMeshLine(createCurve({q:[0,.5572749,-.916],w:[.6,1,-1.5],e:mainPos}))
                        const c7=addMapInf([0,.637274,-.916],[0,.5572749,-.916]);
                        anime({targets:c7[0].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,delay:100,easing:'linear'});
                        anime({targets:c7[1].scale,x:[0,1],y:[0,1],z:[0,1],duration:1000,easing:'linear'});
                    }
                }).add({
               targets:txt15.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,delay:15000,easing:'linear'
            }).add({//singapug
                   targets:txt16.scale,x:[0,1],y:[0,1],z:[0,1],duration:600,easing:'linear',complete:()=>{
                        // addNewParticle({q:[.3782314,.09,-.99022],w:[1,1.2,-1],e:[1,1.2,-1.2],r:[.652,.765,-.27]},20);
                        createMeshLine(createCurve({q:[.3782314,-3.892884016241959e-17,-.990222],w:[1,1.2,-1],e:mainPos}))
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
    function dataForFlatCurve(d,mps=1.25){
        let o={}
        //Main Rand
        o.const=[.64,.775,-.275];
        o.x=THREE.MathUtils.lerp(d[0],o.const[0],.5)
        o.y=THREE.MathUtils.lerp(d[1],o.const[1],.5)
        o.z=THREE.MathUtils.lerp(d[2],o.const[2],.5)
        const nePA=new Array();
        const nePA2=new Array();
        nePA.push(
            new THREE.Vector3(o.const[0],o.const[1],o.const[2]),
            new THREE.Vector3(o.x,o.y,o.z),
            new THREE.Vector3(d[0],d[1],d[2])
        );
        nePA.forEach(e=>{
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
    /*SPIDER*/
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
    //\SPIDER create planet flat linesmesh

    function rotateRadians(deg){
        return deg * (Math.PI / 180);
    }

    anime({
        loop: true,
        targets: mesh.rotation,
        // z: [rotateRadians(360), rotateRadians(0)],
        //x: [rotateRadians(360), rotateRadians(0)],
        y: [rotateRadians(-360), rotateRadians(0)],
        duration: timeRotate,
        easing: "linear"
    });

    const _={};
    _.tf=true;
    _.w=window.innerHeight;
    window.addEventListener('resize',()=>{
        _.w=window.innerHeight;
    })
    window.addEventListener('scroll',()=>{
        _.w=window.innerHeight;
        window.scrollY>_.w-200?_.tf=false:_.tf=true
    });
    let iteration=0;
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    start(/*{_}*/){
        //if(_.tf){
            TWEEN.update();
            lightHolder.quaternion.copy(camera.quaternion);
            renderer.render(scene, camera);
            lineMesh.map(e=>{
                e.material.uniforms.dashOffset.value -= 0.01
            });
        //console.log(123)
        //}


    },

    render({ time }) {
        this.start()
        // console.log(_,this.start)
        //window.requestAnimationFrame(this.start)
        //mesh.rotation.y+=.00055
    },
    // Dispose of events & renderer for cleaner hot-reloading
    /*unload() {
      renderer.dispose();
    }*/
  };
};

const dd=document;
dd.body.setAttribute('style','background-color:#161831;overflow:hidden;/*display:block;color:#ccc;text-align:center*/');

canvasSketch(sketch, settings);
