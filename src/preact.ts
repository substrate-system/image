import { h, type FunctionComponent } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { type Props } from './attributes.js'
import { defaultSrcset, getSrcset } from './srcset.js'

//
// create an `img` component that uses locally hosted files
//

// 100.jpg is 750 × 600

export const Image:FunctionComponent<Props> = function (config:Props) {
    const {
        decoding,
        filename,
        alt,
        loading,
        fetchpriority,
        className,
        srcset
    } = config
    const sizes = config.sizes || ['100vw']

    // const defaultSizes = [1024, 768, 480]

    // @ts-expect-error ???
    return h('img', {
        class: config.class || className,
        srcset: (srcset ?
            (`${filename} 1025w, ` + getSrcset(filename, srcset)) :
            (`${filename} 1025w, ` + defaultSrcset(filename))
        ),
        sizes: sizes.join(', '),
        decoding: decoding || 'auto',
        src: filename,
        alt,
        loading: (loading || 'lazy'),
        fetchpriority: fetchpriority || 'low'
    })
}

interface BlurProps extends Props {
    blurPlaceholder:string
}

export const BlurredImage:FunctionComponent<BlurProps> = function (props:BlurProps) {
    const { blurPlaceholder, filename, className, alt, loading,
        fetchpriority, decoding, sizes, srcset } = props

    const placeholder = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!placeholder.current) return

        // also start downloading the real image
        const imgLarge = new window.Image()
        imgLarge.classList.add('sharp')
        imgLarge.classList.add(props.class || className || '')
        imgLarge.setAttribute('decoding', decoding || 'async')
        imgLarge.setAttribute('alt', alt)
        imgLarge.setAttribute('loading', loading || 'lazy')
        imgLarge.setAttribute('fetchpriority', fetchpriority || 'low')
        imgLarge.setAttribute('sizes', sizes ? sizes.join(', ') : '100vw')
        imgLarge.setAttribute('srcset', (srcset ?
            `${filename} 1025w, ` + getSrcset(filename, srcset) :
            `${filename} 1025w, ` + defaultSrcset(filename)
        ))
        imgLarge.src = filename

        placeholder.current.appendChild(imgLarge)
        imgLarge.onload = () => imgLarge.classList.add('loaded')
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
