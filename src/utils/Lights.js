export default class Lights{
    constructor(THREE, scene) {
        this.ambientLight = new THREE.AmbientLight( 0xFFFFFF, 1 )

        this.dirLight1 = new THREE.DirectionalLight( 0xffddcc, 5 );
        this.dirLight1.position.set( 10, 100.75, 0 );
        this.dirLight1.castShadow = false;
        this.dirLight1Helper = new THREE.DirectionalLightHelper( this.dirLight1, 5 );

        this.dirLight2 = new THREE.DirectionalLight( 0xccccff, 1 );
        this.dirLight2.position.set( 0, 20.75, 0 );
        this.dirLight2.castShadow = false;

        scene.add( this.ambientLight);
        scene.add( this.dirLight1 );
        scene.add( this.dirLight1Helper );
      //  scene.add( this.dirLight2 );
    }
}