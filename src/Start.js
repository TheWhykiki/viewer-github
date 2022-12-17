import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GUI} from "dat.gui";

export default class Start{
    constructor() {
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

            const bgTexture = textures.textureLoader.load('./room.jpg');
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

}