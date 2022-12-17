export function scaleTexture(event, scale, key, material) {

        scale.x *= 1.2;
        scale.y *= 1.2;
        console.log(event.type)
        console.log(key)
        material.map.repeat.copy(scale);
        console.log('Verkliern')
        console.log('scale')
        console.log(material)
        material.map.needsUpdate = true;

}


export function offsetTexture(event, offset, key, texture, material) {
    if (key == 'Alt') {
        console.log(event)
        console.log(key)
        texture.offset.y = texture.offset.y + 0.5;
        console.log('offset')
        console.log(texture.offset)
    }

    //material.map.needsUpdate = true;
}
