import { defaultSizes } from './attributes.js'

export function defaultSrcset (filename:string):string {
    const URIs:string = getSrcset(filename, defaultSizes)
    return URIs
}

export function getSrcset (filename:string, sizes:number[]):string {
    // return filenames like `file-480.jpg`
    return sizes.map(n => {
        return getSrcsetItem(filename, n)
    }).join(', ')
}

export function getSrcsetItem (filename:string, n:number):string {
    const fileParts = filename.split('.')
    const ext = fileParts.pop()
    const noExt = fileParts.join('.')

    return noExt + `-${n}.${ext} ${n}w`
}
