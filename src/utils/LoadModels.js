import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export default class LoadModels{
    constructor(THREE, textures, scene, loadingManager) {
        this.mesh = null;  // Initialize this.mesh to null
        this.loader = new GLTFLoader(loadingManager);
        this.scene = scene;
        this.THREE = THREE;
        this.textures = textures;
        this.position = null;
        this.loader.load( 'models/gltf/Hoodie.gltf', (gltf) => {  // Use an arrow function to preserve the value of `this`
            const mesh = gltf.scene.children[0];

            console.log(gltf.scene)

            mesh.material = new THREE.MeshPhongMaterial( {
                specular: 0x111111,
                map: textures.textureLoader.load( 'models/gltf/Shirt_UV.png' ),
                //specularMap: textureLoader.load( 'models/gltf/Map-SPEC.jpg' ),
                //normalMap: textureLoader.load( 'models/gltf/Infinite-Level_02_Tangent_SmoothUV.jpg' ),
                shininess: 25
            } );
            console.log(mesh)
            this.scene.add(mesh);
            mesh.scale.set( 0.1, 0.1, 0.1 );

            this.mesh = mesh;  // Assign the value of mesh to this.mesh
            this.position = mesh.position;
            console.log(this.scene)
        });
        this.loadEnvironment()
    }

    loadEnvironment()
    {
        this.loader.load( 'models/gltf/ContainerSzene3.gltf', (gltf) => {  // Use an arrow function to preserve the value of `this`
            const mesh = gltf.scene;
            console.log(mesh)
            this.scene.add(mesh);
            mesh.scale.set( 0.1, 0.1, 0.1 );

            this.position = mesh.position;
            console.log(this.scene)


        });
    }

    loadNewModel(name)
    {
        this.scene.remove(this.mesh)
        this.loader.load( 'models/gltf/' + name + '.glb', (gltf) => {  // Use an arrow function to preserve the value of `this`
            const mesh = gltf.scene.children[0];

            mesh.material = new this.THREE.MeshPhongMaterial( {
                specular: 0x111111,
                map: this.textures.textureLoader.load( 'models/gltf/Shirt_UV.png' ),
                //specularMap: textureLoader.load( 'models/gltf/Map-SPEC.jpg' ),
                //normalMap: textureLoader.load( 'models/gltf/Infinite-Level_02_Tangent_SmoothUV.jpg' ),
                shininess: 25
            } );
            console.log(mesh)
            this.scene.add(mesh);
            mesh.scale.set( 1, 1, 1 );
            mesh.position.copy(this.position)
            this.mesh = mesh;  // Assign the value of mesh to this.mesh
            console.log(this.scene)
        });
    }
}
