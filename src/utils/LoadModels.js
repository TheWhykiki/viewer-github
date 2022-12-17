import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export default class LoadModels{
    constructor(THREE, textures, scene) {
        this.mesh = null;  // Initialize this.mesh to null
        this.loader = new GLTFLoader();
        this.loader.load( 'models/gltf/Shirt.glb', (gltf) => {  // Use an arrow function to preserve the value of `this`
            const mesh = gltf.scene.children[1];

            mesh.material = new THREE.MeshPhongMaterial( {
                specular: 0x111111,
                map: textures.textureLoader.load( 'models/gltf/Shirt_UV.png' ),
                //specularMap: textureLoader.load( 'models/gltf/Map-SPEC.jpg' ),
                //normalMap: textureLoader.load( 'models/gltf/Infinite-Level_02_Tangent_SmoothUV.jpg' ),
                shininess: 25
            } );
            console.log(mesh)
            scene.add(mesh);
            mesh.scale.set( 100, 100, 100 );

            this.mesh = mesh;  // Assign the value of mesh to this.mesh
        });
    }
}
