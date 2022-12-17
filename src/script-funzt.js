import * as THREE from 'three';
import './style.css';

import {GUI} from "dat.gui";

import Stats from "three/examples/jsm/libs/stats.module";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DecalGeometry} from "three/examples/jsm/geometries/DecalGeometry";

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

const textureLoader = new THREE.TextureLoader();
const decalDiffuse = textureLoader.load( 'textures/decal/decal-diffuse2.png' );
const decalNormal = textureLoader.load( 'textures/decal/decal-normal.jpg' );

const decalMaterial = new THREE.MeshPhongMaterial( {
    specular: 0x444444,
    map: decalDiffuse,
    normalMap: decalNormal,
    normalScale: new THREE.Vector2( 1, 1 ),
    shininess: 0,
    transparent: false,
    depthTest: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: - 4,
    wireframe: false
} );

let decals = null;
let mouseHelper;
const position = new THREE.Vector3();
const orientation = new THREE.Euler();
const size = new THREE.Vector3( 10, 10, 10 );

const params = {
    scale: 0.1,
    rotate: false,
    clear: function () {
        removeDecals();
    },
    move: function () {
        moveDecals();
    }
};

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

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 20;
    camera.position.y = 10;

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 20;
    controls.maxDistance = 25;

    scene.add( new THREE.AmbientLight( 0x443333 ) );

    const dirLight1 = new THREE.DirectionalLight( 0xffddcc, 1 );
    dirLight1.position.set( 1, 0.75, 0.5 );
    scene.add( dirLight1 );

    const dirLight2 = new THREE.DirectionalLight( 0xccccff, 1 );
    dirLight2.position.set( - 1, 0.75, - 0.5 );
    scene.add( dirLight2 );

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );

    line = new THREE.Line( geometry, new THREE.LineBasicMaterial() );
    scene.add( line );

    loadLeePerrySmith();

    raycaster = new THREE.Raycaster();

    mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
    mouseHelper.visible = false;
    scene.add( mouseHelper );

    const bgTexture = textureLoader.load('./room.jpg');
    scene.background = bgTexture;

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

            checkIntersection( event.clientX, event.clientY );

            if ( intersection.intersects ) shoot();

        }

    } );

    window.addEventListener( 'pointermove', onPointerMove );

    function onPointerMove( event ) {

        if ( event.isPrimary ) {

            checkIntersection( event.clientX, event.clientY );

        }

    }

    function checkIntersection( x, y ) {

        if ( mesh === undefined ) return;

        var rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
        mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );
        raycaster.intersectObject( mesh, false, intersects );

        if ( intersects.length > 0 ) {

            const p = intersects[ 0 ].point;
            mouseHelper.position.copy( p );
            intersection.point.copy( p );

            const n = intersects[ 0 ].face.normal.clone();
            n.transformDirection( mesh.matrixWorld );
            n.multiplyScalar( 10 );
            n.add( intersects[ 0 ].point );

            intersection.normal.copy( intersects[ 0 ].face.normal );
            //mouseHelper.lookAt( n );

            const positions = line.geometry.attributes.position;
            positions.setXYZ( 0, p.x, p.y, p.z );
            positions.setXYZ( 1, n.x, n.y, n.z );
            positions.needsUpdate = true;

            intersection.intersects = true;

            intersects.length = 0;

        } else {

            intersection.intersects = false;

        }

    }

    const gui = new GUI();

    gui.add( params, 'scale', 1, 30 );
    gui.add( params, 'rotate' );
    gui.add( params, 'clear' );
    gui.add( params, 'move' );
    gui.open();

    var testValue = 1;
    const button = document.getElementById('left');
    button.addEventListener('click', () => {
        moveDecals(1, 2, 3);
    });
}

function loadLeePerrySmith() {

    const loader = new GLTFLoader();

    loader.load( 'models/gltf/Shirt.glb', function ( gltf ) {

        mesh = gltf.scene.children[1];
        console.log(mesh)
        mesh.material = new THREE.MeshPhongMaterial( {
            specular: 0x111111,
            map: textureLoader.load( 'models/gltf/Shirt_UV.png' ),
            //specularMap: textureLoader.load( 'models/gltf/Map-SPEC.jpg' ),
            //normalMap: textureLoader.load( 'models/gltf/Infinite-Level_02_Tangent_SmoothUV.jpg' ),
            shininess: 25
        } );

        scene.add( mesh );

        mesh.scale.set( 100, 100, 100 );

    } );

}

function shoot() {

    removeDecals()
    position.copy( intersection.point );
    orientation.copy( mouseHelper.rotation );
    console.log(position)
    if ( params.rotate ) orientation.z = Math.random() * 2 * Math.PI;

    const scale = params.scale;
    size.set( scale, scale, scale );

    const material = decalMaterial.clone();
    //material.color.setHex( Math.random() * 0xffffff );

    decals = new THREE.Mesh( new DecalGeometry( mesh, position, orientation, size ), material );
console.log(decals)
    scene.add( decals );

    const test = new THREE.Mesh( new THREE.BoxGeometry( 5, 5, 5 ), new THREE.MeshStandardMaterial({color: 0xFFFF00} ));
    test.position.copy(intersection.point)
    test.position.x = intersection.point.x + 2;
    //camera.lookAt(test.position)
    //camera.position.z = camera.position.z - 50;
    //fitCameraToObject(test)

    scene.add(test)
    //Creating the actual bounding boxes
    const mesh1Bounds = new THREE.Box3().setFromObject( mesh );
    const mesh2Bounds = new THREE.Box3().setFromObject( test );

// Calculate side lengths of model1
    let lengthMesh1Bounds = {
        x: Math.abs(mesh1Bounds.max.x - mesh1Bounds.min.x),
        y: Math.abs(mesh1Bounds.max.y - mesh1Bounds.min.y),
        z: Math.abs(mesh1Bounds.max.z - mesh1Bounds.min.z),
    };

    let lengthMesh2Bounds = {
        x: Math.abs(mesh2Bounds.max.x - mesh2Bounds.min.x),
        y: Math.abs(mesh2Bounds.max.y - mesh2Bounds.min.y),
        z: Math.abs(mesh2Bounds.max.z - mesh2Bounds.min.z),
    };


    let lengthRatios = [
        (lengthMesh1Bounds.x / lengthMesh2Bounds.x),
        (lengthMesh1Bounds.y / lengthMesh2Bounds.y),
        (lengthMesh1Bounds.z / lengthMesh2Bounds.z),
    ];

// Select smallest ratio in order to contain the models within the scene
    let minRatio = Math.min(...lengthRatios);

    console.log(minRatio)

    test.scale.set(minRatio, minRatio, minRatio);



}

function removeDecals() {

    scene.remove(decals);

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

		