export var kratong_pics = [
        'fish1Texture.png',
        'fish2Texture.png',
        'fish3Texture.png',
        'fish4Texture.png',
    ]

export function get_kratong_pic(i : number){
    let i_temp = Math.min(kratong_pics.length-1, i)
    return kratong_pics[i_temp]
}