import Actions from "./utils/Actions";
export default class Variables{
    constructor(THREE) {
        this.position = new THREE.Vector3();
        this.orientation = new THREE.Euler();
        this.size = new THREE.Vector3( 10, 10, 10 );
        this.params = {
            scale: 0.1,
            rotate: false,
        };
    }
}