// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

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
  const camera = new THREE.PerspectiveCamera(28, 1/*window.innerWidth / window.innerHeight*/, 0.01, 100);
  camera.position.set(9,5,-4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  //const geometryq = new THREE.SphereGeometry(0.9, 32, 16);

  // Setup a material
  /*
  const materialq = new THREE.MeshBasicMaterial({
	  //wireframe:true
	  map:new THREE.TextureLoader().load('earth-stroke.png'),
	  //minFilter: THREE.LinearFilter
    //color: "red",
    //wireframe: true
  });
  */
//materialq.map.minFilter = THREE.LinearFilter;
  

  // Setup a mesh with geometryq + materialq
  //const meshq = new THREE.Mesh(geometryq, materialq);
  //scene.add(meshq);



const geometry = new THREE.IcosahedronGeometry(2.1,3);
//const geometry3 = new THREE.SphereGeometry(1, 32, 16);

		//console.log(geometry3.rotateY)

const material = new THREE.MeshBasicMaterial({
    color: "#2359bb",
    wireframe: true
  });
const mesh = new THREE.Mesh(geometry,material);
scene.add(mesh);

//const geo2=      new THREE.IcosahedronGeometry(1,1);
const circ=      new THREE.CircleGeometry(1,12);
const pnts=geometry.vertices;
pnts.forEach(point=>{
	const mesh = new THREE.Mesh(
		circ,
		new THREE.MeshBasicMaterial({
			color:0x0064B9,
			/*side:THREE.DoubleSide,*/
			side:THREE.BackSide,
			/*wireframe:true*/
		}));
	mesh.position.copy(point);
	mesh.scale.setScalar(0.03);
	mesh.lookAt(new THREE.Vector3());
	scene.add(mesh)
});

/*!Earth*/
/*FOR TEST*/
/*
const l = new THREE.Mesh(
				new THREE.CircleGeometry(.5,24),
				new THREE.MeshBasicMaterial({
					color:'red',
					/*side:THREE.DoubleSide,*/
/*					side:THREE.DoubleSide,
					/*wireframe:true*/
/*				}));
			l.position.set(0,.5,.5);
			//mesh.scale.setScalar(2);
			l.lookAt(new THREE.Vector3());
			scene.add(l)
*/
/*
let pointsGeometry,point,
	geometryZ1 = new THREE.BoxGeometry( 0.75, 0.75, 1 );
//	console.log(geometryZ1)
	for ( var i = 0; i < geometryZ1.vertices.length; i ++ ) {
		var vertex = geometryZ1.vertices[ i ];
		vertex.z += 0.5;
		//console.log(vertex.z)
	}
*/
/*
point = new THREE.Mesh( geometryZ1 );
pointsGeometry = new THREE.Geometry();

function plotData(){

	//var lat, lng, size, color;

	//points = new THREE.Mesh( pointsGeometry, new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } ) );
	
	fetch('data.json').then(d=>d.json()).then(data=>{
		data.forEach(point=>{
			/*
			const mesh = new THREE.Mesh(
				new THREE.CircleGeometry(1,24),
				new THREE.MeshBasicMaterial({
					color:'red',
					/*side:THREE.DoubleSide,*/
			/*		side:THREE.BackSide,
					/*wireframe:true*/
			/*	}));
			mesh.position.copy(point);
			//mesh.scale.setScalar(2);
			mesh.lookAt(new THREE.Vector3());
			scene.add(mesh)
			*/
/*			
			var lat, lng, size, color;

	points = new THREE.Mesh( pointsGeometry, new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } ) );

	for ( var i = 0, l = data.length; i < l; i ++ ) {

		lat = data[ i ][ 1 ];
		lng = data[ i ][ 2 ];
		size = data[ i ][ 0 ];

		addPoint( lat, lng, size * 150, '#fff'  );//column size

	}

	scene.add( points );
			
		})
	})
}
plotData();

function addPoint( lat, lng, size, color ) {

	// if ( lat == 0 && lng == 0 ) return;

	var phi = ( 90 - lat ) * Math.PI / 180;
	var theta = ( 180 - lng ) * Math.PI / 180;

	// position

	point.position.x = 200 * Math.sin( phi ) * Math.cos( theta );
	point.position.y = 200 * Math.cos( phi );
	point.position.z = 200 * Math.sin( phi ) * Math.sin( theta );

	// rotation

	point.lookAt( mesh.position );

	// scaling

	point.scale.z = size;
	point.updateMatrix();

	// color
	for ( var i = 0; i < point.geometry.faces.length; i ++ ) {
		point.geometry.faces[ i ].color = color;
	}
	THREE.BufferGeometryUtils.merge( pointsGeometry, point );

}*/

/*! \ Earth*/


/*! Planet */

function latLongToVector3(lat, lon, radius, heigth) {
        var phi = (lat)*Math.PI/180;
        var theta = (lon-180)*Math.PI/180;

        var x = -(radius+heigth) * Math.cos(phi) * Math.cos(theta);
        var y = (radius+heigth) * Math.sin(phi);
        var z = (radius+heigth) * Math.cos(phi) * Math.sin(theta);
        console.log(x,y,z);

        return new THREE.Vector3(x,y,z);
    }

fetch('data-minus-one-step-3-edit-6.json').then(r=>r.json()).then(d=>{
	//throw('exit3')
	//throw('exit;');
		const materialPlanet = new THREE.MeshBasicMaterial({
		color:0x3E3C54,
		//side:THREE.DoubleSide,
		side:THREE.BackSide,
		//wireframe: true
	  });
      
	  /*planet.scale.setScalar(0.06);

planet.position.set(1,.5,0);
planet.lookAt(new THREE.Vector3());
scene.add(planet);
throw('exit2')*/
        let vvv=0,oldVal=oldVal2=0,ar=[];
        
        //var temp1=temp2=0;
		d.forEach((e)=>{
            //console.log(vvv%3===0)
/*            if(vvv%1==0){
                
                const circ2=    new THREE.CircleGeometry(1,3);
                const planet = new THREE.Mesh(circ2,materialPlanet);
*/                /*planet.position.set(-1,-.5,0);
    planet.lookAt(new THREE.Vector3());
    scene.add(planet);
    throw('exit2')*/
                //console.log(circ,materialPlanet)
                /*const*/// planet = new THREE.Mesh(circ,materialPlanet);
                ///
                
                
                
                    //vvv++;
                    //if(vvv>100){return}
                    /*
                    const x = parseInt(e[0])+180;
                    const y = parseInt((e[1])-84)*-1;
                    const value_ = parseFloat(e[2]);
                    
                    var phi_ = (y)*Math.PI/180;
                    var theta_ = (x-180)*Math.PI/180;

                    var x_ = -(2) * Math.cos(phi_) * Math.cos(theta_);
                    var y_ = (2) * Math.sin(phi_);
                    var z_ = (2) * Math.cos(phi_) * Math.sin(theta_);
                    */
                    //ar.push([x_,y_,z_+"|"])
                    //temp1++;
                    //console.log(Math.abs(x_-oldVal),Math.abs(y_-oldVal2),y_,oldVal2)
                    //if(x_!==oldVal||y_!==oldVal2){
                    //if(Math.abs(x_-oldVal)>0.006 && Math.abs(y_-oldVal2)>0.00001){
                        //temp2++;    
                        //console.log(x_,y_+'----')
                            //console.log(e[0],e[1])
                        // calculate the position where we need to start the cube
                        //const position = latLongToVector3(y/100, x/100, 1, 1);

                        // create the cube
                        //var cubeMat = new THREE.MeshLambertMaterial({color: 0x000000,opacity:0.6, emissive:0x292929});
                        
                        const circ2=    new THREE.CircleGeometry(.013,12);
                        
                        //const cube = new THREE.Mesh(new THREE.CubeGeometry(.01,.01,.01,1,1,1,cubeMat));
                        const cube = new THREE.Mesh(circ2,materialPlanet);
                        //cube.scale.setScalar(0.13);
                        // position the cube correctly
                        
                        cube.position.set(e[0],e[1],e[2]);
    //                    cube.position.set(1.997264330987512, 0.028971452277212928, -0.1004780927264995);
                        
                        //console.log(position)
                        
                        cube.lookAt( new THREE.Vector3() );
                        scene.add(cube);
                    //}
                    //oldVal=x_;
                    //oldVal2=y_;
                    
        
                
                
                
                
                
                
/*                
                let lat,lng;
                lat=e[0];
                lng=e[1];
                
                if ( lat == 0 && lng == 0 ) return;
                let phi = ( 90 - lat ) * Math.PI / 180;
                let theta = ( 180 - lng ) * Math.PI / 180;
*/                
                //console.log(phi,theta)
                
                //console.log(200 * Math.sin( phi ) * Math.cos(theta),theta)
                /*planet.position.setX = 200 * Math.sin( phi ) * Math.cos(theta);
                planet.position.setY = 200 * Math.cos(phi);
                planet.position.setZ = 200 * Math.sin(phi) * Math.sin(theta);
                */
/*                planet.position.set(
                    Math.sin( phi ) * Math.cos(theta),
                    Math.cos(phi),
                    Math.sin(phi) * Math.sin(theta)
                )
                
                ///
                planet.scale.setScalar(0.013);
                planet.lookAt(new THREE.Vector3());
                //const pointsGeometry = new THREE.Geometry();
                //planet.geometry.merge( pointsGeometry, point )
                
            if(vvv>500){return}
                scene.add(planet);
                
                /*console.log(200 * Math.sin( phi ) * Math.cos(theta),
                    200 * Math.cos(phi),
                    200 * Math.sin(phi) * Math.sin(theta))*/
                 
                    
/*            }
            //if(vvv>500)throw('exit5');
*//*            vvv++;
            //if(vvv%3){}
            //const cube = new THREE.BoxGeometry( 1, 1, 1 );
                
*/            
		});
        
        /*let txt=document.createElement('textarea');
        txt.innerHTML=ar.splice("");
        document.body.append(txt);
        txt.setAttribute('style','position:fixed;z-index:999;top:0;left:0;widht:600px;height:600px')
	  throw('exit');*/
		/*const*/ /*planet = new THREE.Mesh(circ,materialPlanet);
		///
		/*var phi = ( 90 - lat ) * Math.PI / 180;
		var theta = ( 180 - lng ) * Math.PI / 180;
		planet.position.setX = 200 * Math.sin( phi ) * Math.cos( theta );
		planet.position.setY = 200 * Math.cos( phi );
		planet.position.setZ = 200 * Math.sin( phi ) * Math.sin( theta );
		///
		planet.scale.setScalar(0.06);
		planet.lookAt(new THREE.Vector3());
		scene.add(planet);
	*/
	
})

/*
///
var phi = ( 90 - lat ) * Math.PI / 180;
var theta = ( 180 - lng ) * Math.PI / 180;
planet.position.setX = 200 * Math.sin( phi ) * Math.cos( theta );
planet.position.setY = 200 * Math.cos( phi );
planet.position.setZ = 200 * Math.sin( phi ) * Math.sin( theta );
///

planet.scale.setScalar(0.06);
planet.lookAt(new THREE.Vector3());
scene.add(planet);
*/
/*! \ Planet */


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
