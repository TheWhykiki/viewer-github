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
    renderer.physicallyCorrectLights = true;
    container.appendChild( renderer.domElement );

    stats = new Stats();
    container.appendChild( stats.dom );

    scene = new THREE.Scene();

    const loadingManager = new THREE.LoadingManager( () => {

        const loadingScreen = document.getElementById( 'loading-screen' );
        loadingScreen.classList.add( 'fade-out' );

        // optional: remove loader from DOM via event listener
        loadingScreen.addEventListener( 'transitionend', onTransitionEnd );

    } );

    // LOad camera and lights
    camera = new Camera(THREE).camera;
    const lights = new Lights(THREE, scene);

    const lightHelper1 = new THREE.DirectionalLightHelper( lights.dirLight1, 5 );
    scene.add( lightHelper1 );


    // LOad controls
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 2;
    controls.maxDistance = 1000;

    // Add raycasting line
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );
    line = new THREE.Line( geometry, new THREE.LineBasicMaterial() );
    scene.add( line );

    // Add model and actions

    const model = new LoadModels(THREE, textures, scene, loadingManager);
    let actions = null;
    setTimeout(() => {
        mesh = model.mesh;
        console.log(model.mesh);  // Access the mesh object
        actions = new Actions(THREE, scene, mesh, textures, materials, intersection, line, renderer, camera, params);
        var remove = actions.removeDecals;
        console.log(remove)
        var tester = {
            clear: function(){
                actions.removeDecals()
            },
            change: function(){
                model.loadNewModel('LeePerrySmith')
            }
        }


        const gui = new GUI();

        gui.add( params, 'scale', 0.1, 5 );
        gui.add( params, 'rotate' );
        gui.add( tester, 'clear' );
        gui.add( tester, 'change' );
       // gui.add( params, 'move' );
        gui.open();
    }, 1000);

    // Add environment
    //const bgTexture = textures.textureLoader.load('./room.jpg');
    //scene.background = bgTexture;

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        '/textures/cubeMaps/map1/px.png',
        '/textures/cubeMaps/map1/nx.png',
        '/textures/cubeMaps/map1/py.png',
        '/textures/cubeMaps/map1/ny.png',
        '/textures/cubeMaps/map1/pz.png',
        '/textures/cubeMaps/map1/nz.png',
    ]);
    scene.background = texture;

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

    console.log(camera.position)
    stats.update();

}

function onTransitionEnd( event ) {

    event.target.remove();

}

