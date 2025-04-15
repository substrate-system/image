import { type Props } from './attributes.js'
import { getSrcset, defaultSizes } from './srcset.js'

export function html (props:Props):string {
    const { className, sizes, filename, decoding,
        loading, fetchpriority, alt } = props

    const _class = props.class || className

    return `<div class="${'image' + (_class ? ` ${_class}` : '')}">
        <img
            alt="${alt}"
            srcset="${getSrcset(filename, defaultSizes)}"
            sizes="${sizes?.join(', ') || '100vw'}"
            src="${filename}"
            decoding="${decoding || 'auto'}"
            loading="${loading || 'lazy'}"
            fetchpriority="${fetchpriority || 'low'}"
        >
    </div>`
}

export default html
