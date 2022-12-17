import * as THREE from 'three';
import './style.css';

import {GUI} from "dat.gui";

import Stats from "three/examples/jsm/libs/stats.module";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DecalGeometry} from "three/examples/jsm/geometries/DecalGeometry";
import Variables from "./Variables";
import Textures from "./utils/Textures";
import Materials from "./utils/Materials";
import Camera from "./utils/Camera";
import Lights from "./utils/Lights";
import LoadModels from "./utils/LoadModels";
import MouseHelper from "./utils/MouseHelper";
import Actions from "./utils/Actions";

const container = document.getElementById( 'container' );

let renderer, scene, camera, stats;
let mesh;
let raycaster;
let line;
var testValue = 1;

const intersection = {
    intersects: false,
    point: new THREE.Vector3(),
    normal: new THREE.Vector3()
};
const mouse = new THREE.Vector2();
const intersects = [];
const textures = new Textures(THREE);
const materials = new Materials(THREE, textures);
const params = new Variables(THREE).params;


init();
animate();

function init() {

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    stats = new Stats();
    container.appendChild( stats.dom );

    scene = new THREE.Scene();

    // LOad camera and lights
    camera = new Camera(THREE).camera;
    const lights = new Lights(THREE);
    scene.add( lights.ambientLight);
    scene.add( lights.dirLight1 );
    scene.add( lights.dirLight2 );

    // LOad controls
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 2;
    controls.maxDistance = 10;

    // Add raycasting line
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );
    line = new THREE.Line( geometry, new THREE.LineBasicMaterial() );
    scene.add( line );

    // Add model and actions

    const model = new LoadModels(THREE, textures, scene);
    let actions = null;
    setTimeout(() => {
        mesh = model.mesh;
        console.log(model.mesh);  // Access the mesh object
        actions = new Actions(THREE, scene, mesh, textures, materials, intersection, line, renderer, camera, params);
        var remove = actions.removeDecals;
        console.log(remove)
        var tester = {
            clear: function(){
                console.log('clear')
                console.log(actions)
                actions.removeDecals()
            }
        }


        const gui = new GUI();

        gui.add( params, 'scale', 0.1, 5 );
        gui.add( params, 'rotate' );
        gui.add( tester, 'clear' );
       // gui.add( params, 'move' );
        gui.open();
    }, 1000);

    // Add environment
    const bgTexture = textures.textureLoader.load('./room.jpg');
    scene.background = bgTexture;

    // MOuse Helper --> löschen?
    const mouseHelper = new MouseHelper(THREE).mouseHelper;
    scene.add( mouseHelper.mouseHelper );


    // Event Listener
    window.addEventListener( 'resize', onWindowResize );

    let moved = false;

    controls.addEventListener( 'change', function () {
        moved = true;
    } );

    window.addEventListener( 'pointerdown', function () {

        moved = false;

    } );

    window.addEventListener( 'pointerup', function ( event ) {

        if ( moved === false ) {

            actions.checkIntersection( event.clientX, event.clientY, event);

            if ( intersection.intersects ) {
                actions.shoot(params)
            };


        }

    } );

    window.addEventListener( 'pointermove', onPointerMove );

    function onPointerMove( event ) {

        if ( event.isPrimary ) {
           // console.log('move')

            actions.checkIntersection( event.clientX, event.clientY, event );

        }

    }

    var testValue = 1;
    const button = document.getElementById('left');
    button.addEventListener('click', () => {
        moveDecals(1, 2, 3);
    });
}


function moveDecals(value1, value2, value3) {
    console.log(decals)
    const decalsOld = decals;

    //removeDecals();

    console.log(decalsOld)

    decalsOld.forEach( function ( d ) {

        scene.add( d );

    } );

   // decals.length = 0;
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    renderer.render( scene, camera );

    stats.update();



}

