// @ts-check
import Tonic from '@substrate-system/tonic'
import { defaultSrcset, getSrcset } from './srcset.js'

/**
 * create an `img` component that uses locally hosted files
 */
export class ImageTag extends Tonic {
    render () {
        const {
            className,
            filename,
            decoding,
            loading,
            fetchpriority,
            sources
        } = this.props
        const sizes = this.props.sizes || ['100vw']
        const _class = (this.props.class || className)

        const srcset = sources ?
            getSrcset(filename, sources) :
            defaultSrcset(filename)

        return this.html`<div class=${'image' + (_class ? ` ${_class}` : '')}>
            <img
                srcset="${srcset}"
                sizes="${sizes}"
                src="${filename}"
                decoding="${decoding || 'auto'}"
                loading="${loading || 'lazy'}"
                fetchpriority="${fetchpriority || 'low'}"
            />
        </div>`
    }
}

/**
 * A `tonic` component for images.
 * Be sure to pass an `id` in HTML to the component. Also takes a prop
 * `blurPlaceholder`, which is a base64 string to use inline as src,
 * and a prop `filename` -- the filename to fetch
 * @returns {HTMLElement} HTML element created with `tonic`
 * @description HTML element takes these props:
 *   * srcset -- an array of numbers for widths
 *   * filename -- the filename for src attribute
 */
export class BlurredImage extends Tonic {
    constructor () {
        super()
        const imgLarge = new window.Image()
        imgLarge.classList.add('sharp')
        this.state = { blurry: true, imgLarge }

        imgLarge.onload = async () => {
            this.state.blurry = false
            await this.reRender()
            const placeholder = this.querySelector('.placeholder')
            imgLarge.classList.add('loaded')
            if (placeholder) placeholder.appendChild(imgLarge)
        }
    }

    getImg () {
        const { filename, sizes, sources } = this.props
        const { imgLarge } = this.state
        const srcset = sources ?
            getSrcset(filename, sources) :
            defaultSrcset(filename)

        imgLarge.setAttribute('srcset', srcset)
        imgLarge.setAttribute('sizes', sizes)
        imgLarge.src = filename
    }

    render () {
        const { blurplaceholder, className } = this.props
        const _class = (this.props.class || className)

        if (this.state.blurry) {
            this.getImg()
        }

        return this.html`<div
            class="${('image placeholder' + (_class ? ` ${_class}` : ''))}"
        >
            <img class="blurry" src=${blurplaceholder} />
        </div>`
    }
}
