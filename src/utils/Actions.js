import {DecalGeometry} from "three/examples/jsm/geometries/DecalGeometry";
import MouseHelper from "./MouseHelper";
import Variables from "../Variables";
import * as THREE from "three";
import {GUI} from "dat.gui";

export default class Actions{

    constructor(THREE,scene, mesh, textures, materials, intersection, line, renderer, camera, paramTest) {
        this.intersection = intersection;
        this.intersects = [];
        this.line = line;
        this.scene = scene;
        this.mesh = mesh;
        this.mouseHelper = new MouseHelper(THREE).mouseHelper;
        this.decals = [];
        this.position = new THREE.Vector3();
        const variables = new Variables(THREE);
        this.position = variables.position;
        this.size = variables.size;
        this.orientation = variables.orientation;
        this.params = variables.params;
        this.decalMaterial = materials.decalMaterial
        this.THREE = THREE;
        this.renderer = renderer;
        this.camera = camera;
        this.paramsTest = paramTest.params;
    }

    shoot(params) {
        const THREE = this.THREE;
        console.log('shoot')

        this.removeDecals()
        this.position.copy( this.intersection.point );
        this.orientation.copy( this.mouseHelper.rotation );

        if ( params.rotate ) this.orientation.z = Math.random() * 2 * Math.PI;

        const scale = params.scale;
        this.size.set( scale, scale, scale );


        const material = this.decalMaterial.clone();
        //material.color.setHex( Math.random() * 0xffffff );

        let decals = new THREE.Mesh( new DecalGeometry( this.mesh, this.position, this.orientation, this.size ), material );
        decals.name = 'Decals'
        this.scene.add( decals );
        this.decals = decals
    }


    checkIntersection( x, y, event) {
        const mouse = new THREE.Vector2();
        if ( this.mesh === undefined ) return;

        var rect = this.renderer.domElement.getBoundingClientRect();
        mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
        mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
        const raycaster = new this.THREE.Raycaster();
        raycaster.setFromCamera( mouse, this.camera );
        raycaster.intersectObject( this.mesh, false, this.intersects );

        //console.log(mesh)

        if ( this.intersects.length > 0 ) {

            const p = this.intersects[ 0 ].point;
            this.mouseHelper.position.copy( p );
            this.intersection.point.copy( p );

            const n = this.intersects[ 0 ].face.normal.clone();
            n.transformDirection( this.mesh.matrixWorld );
            n.multiplyScalar( 10 );
            n.add( this.intersects[ 0 ].point );

            this.intersection.normal.copy( this.intersects[ 0 ].face.normal );
            //mouseHelper.lookAt( n );

            const positions = this.line.geometry.attributes.position;
            positions.setXYZ( 0, p.x, p.y, p.z );
            positions.setXYZ( 1, n.x, n.y, n.z );
            positions.needsUpdate = true;

            this.intersection.intersects = true;

            this.intersects.length = 0;

        } else {

            this.intersection.intersects = false;

        }

    }

    removeDecals() {
        console.log(this.decals)
        this.scene.remove(this.decals);
        this.decals.length = 0;

    }
}