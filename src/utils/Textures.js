export default class Textures{
    constructor(THREE) {
        this.textureLoader = new THREE.TextureLoader();
        this.decalDiffuse = this.textureLoader.load( 'textures/decal/decal-diffuse2.png' );
        this.decalNormal = this.textureLoader.load( 'textures/decal/decal-normal.jpg' );
    }
}