export default class Camera{
    constructor(THREE) {
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
        this.camera.position.x = -4.017689826163139;
        this.camera.position.y = 10.99143077742072;
        this.camera.position.z = -21.314137601958976;
    }
}