export default class Camera{
    constructor(THREE) {
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
        this.camera.position.z = 2;
        this.camera.position.y = 10;
    }
}