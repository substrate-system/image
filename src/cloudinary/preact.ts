import { Cloudinary } from '@cloudinary/url-gen'
import { scale } from '@cloudinary/url-gen/actions/resize'
import { h, type FunctionComponent } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { CloudinarySrcset } from './srcset.js'
import { type Props } from '../attributes.js'

interface BlurProps extends Props {
    blurPlaceholder:string,
    maxWidth:number,
}

interface Components {
    Image: FunctionComponent<Props>,
    BlurredImage: FunctionComponent<BlurProps>
}

/**
 * This is a factory function that returns an object like { Image, BlurredImage },
 * where `Image` and `BlurredImage` are preact components
 * @param config {{ cloudName:string }} The cloudName for Cloudinary
 * @returns { { Image:FunctionComponent } }
 */
export const CloudinaryImage = function (config:{ cloudName:string }):Components {
    const { cloudName } = config

    const cld = new Cloudinary({
        cloud: { cloudName },
        url: { secure: true }
    })

    const { defaultSrcset, getSrcset } = CloudinarySrcset(cld)

    const Image:FunctionComponent<Props> = function (props:Props) {
        const { decoding, filename, alt, loading, fetchpriority,
            className, srcset, sizes } = props

        return h('img', {
            class: props.class || className,
            alt,
            srcset: (srcset ?
                getSrcset(filename, srcset).join(', ') :
                defaultSrcset(filename)
            ),
            sizes: (sizes ? sizes.join(', ') : '100vw'),
            src: (cld.image(filename)
                .format('auto')
                .toURL()),
            loading: loading || 'lazy',
            decoding: decoding || 'auto',
            fetchpriority: fetchpriority || 'low'
        })
    }

    const BlurredImage:FunctionComponent<BlurProps> = function (props:BlurProps) {
        const { maxWidth, blurPlaceholder, filename, className, sizes,
            srcset } = props

        const placeholder = useRef<HTMLDivElement>(null)

        useEffect(() => {
            if (!placeholder.current) return

            // also start downloading the real image
            const imgLarge = new window.Image()

            const sources = (srcset ?
                getSrcset(filename, srcset).join(', ') :
                defaultSrcset(filename))

            imgLarge.onload = () => imgLarge.classList.add('loaded')
            imgLarge.setAttribute('sizes', sizes ? sizes.join(', ') : '100vw')
            //   srcset="elva-fairy-480w.jpg 480w, elva-fairy-800w.jpg 800w"
            imgLarge.setAttribute('srcset', sources)
            imgLarge.classList.add('sharp')
            imgLarge.src = (cld.image(filename)
                .format('auto')
                .quality('auto')
                .resize(scale().width(maxWidth))
                .toURL())

            placeholder.current.appendChild(imgLarge)
        }, [placeholder.current])

        const _class = props.class || className

        return h('div', {
            class: 'placeholder' + (_class ? ` ${_class}` : ''),
            ref: placeholder
        }, [
            h('img', {
                class: 'blurry loaded',
                src: blurPlaceholder
            })
        ])
    }

    return { Image, BlurredImage }
}

export default CloudinaryImage
