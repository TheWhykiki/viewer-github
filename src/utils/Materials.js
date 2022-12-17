export default class Materials{
    constructor(THREE, textures) {

        this.decalMaterial = new THREE.MeshPhongMaterial({
            specular: 0x444444,
            map: textures.decalDiffuse,
            normalMap: textures.decalNormal,
            normalScale: new THREE.Vector2( 1, 1 ),
            shininess: 0,
            transparent: false,
            depthTest: true,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: - 4,
            wireframe: false
        });
    }
}