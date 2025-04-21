import { type Cloudinary } from '@cloudinary/url-gen'
import { scale } from '@cloudinary/url-gen/actions/resize'

export function CloudinarySrcset (
    cld:Cloudinary,
):{
    defaultSrcset: (filename:string) => string,
    getSrcset: (filename:string, widths:number[]) => string[]
} {
    function defaultSrcset (filename:string):string {
        const URIs:string[] = ([(cld.image(filename)
            .format('auto')
            .quality('auto')
            .toURL() + ' 1025w'
        )]).concat(getSrcset(filename, [1024, 768, 480]))

        return URIs.join(', ')
    }

    function getSrcset (filename:string, widths:number[]):string[] {
        return widths.map(n => {
            return (cld.image(filename)
                .format('auto')
                .quality('auto')
                .resize(scale().width(n))
                .toURL()) + (` ${n}w`)
        })
    }

    return { defaultSrcset, getSrcset }
}
