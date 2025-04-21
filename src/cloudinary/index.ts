import { Cloudinary } from '@cloudinary/url-gen'
import { type Props } from '../attributes.js'
import { CloudinarySrcset } from './srcset.js'

//
// create html strings for <img> elements
//

export function CloudinaryImage (cloudName) {
    const cld = new Cloudinary({
        cloud: { cloudName },
        url: { secure: true }
    })

    return { Image }

    // const { filename, alt, loading, fetchpriority, className } = props
    // return html for a local file
    function Image (props:Props):string {
        const { className, sizes, filename, decoding,
            loading, fetchpriority, alt, srcset } = props
        const _class = props.class || className

        const { defaultSrcset, getSrcset } = CloudinarySrcset(cld)

        return `<img
            alt="${alt}"
            srcset: ${(srcset ?
                getSrcset(filename, srcset).join(', ') :
                defaultSrcset(filename))
            }
            sizes="${sizes?.join(', ') || '100vw'}"
            src="${cld.image(filename).format('auto').quality('auto').toURL()}"
            decoding="${decoding || 'auto'}"
            loading="${loading || 'lazy'}"
            fetchpriority="${fetchpriority || 'low'}"
        >`
    }
}
