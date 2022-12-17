export default class MouseHelper{
    constructor(THREE) {
        this.mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
        this.mouseHelper.visible = false;
    }
}