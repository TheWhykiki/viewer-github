export default class Lights{
    constructor(THREE) {
        this.ambientLight = new THREE.AmbientLight( 0x443333 )

        this.dirLight1 = new THREE.DirectionalLight( 0xffddcc, 1 );
        this.dirLight1.position.set( 1, 0.75, 0.5 );

        this.dirLight2 = new THREE.DirectionalLight( 0xccccff, 1 );
        this.dirLight2.position.set( - 1, 0.75, - 0.5 );
    }
}