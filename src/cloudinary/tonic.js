// @ts-check
import { Cloudinary } from '@cloudinary/url-gen'
import { scale } from '@cloudinary/url-gen/actions/resize'
import Tonic from '@substrate-system/tonic'
import { CloudinarySrcset } from './srcset.js'

/**
 * Factory function.
 * where `Image` is a tonic component.
 * @param {{ cloudName:string }} config The cloudName for Cloudinary
 * @returns { { BlurredImage, ImageTag } } Tonic components
 */
export const CloudinaryTonic = function ({ cloudName }) {
    const cld = new Cloudinary({
        cloud: { cloudName },
        url: { secure: true }
    })

    /**
     * A `tonic` component for images.
     * Be sure to pass an `id` in HTML to the component. Also takes a prop
     * `blurPlaceholder`, which is a base64 string to use inline as src,
     * and a prop `filename` -- the filename to fetch
     * @returns {HTMLElement} HTML element created with `tonic`
     */
    class BlurredImage extends Tonic {
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
            const { filename, maxwidth, sizes } = this.props
            const { imgLarge } = this.state
            const { defaultSrcset } = CloudinarySrcset(cld)
            const srcset = defaultSrcset(filename)

            imgLarge.setAttribute('srcset', srcset)
            imgLarge.setAttribute('sizes', sizes)
            imgLarge.src = (cld.image(filename)
                .format('auto')
                .quality('auto')
                .resize(scale().width(maxwidth))
                .toURL())
        }

        render () {
            const { blurplaceholder, className } = this.props
            const _class = (this.props.class || className)

            if (this.state.blurry) {
                this.getImg()
            }

            return this.html`<div
                class=${('placeholder' + (_class ? ` ${_class}` : ''))}
            >
                <img class="blurry" src=${blurplaceholder} />
            </div>`
        }
    }

    class ImageTag extends Tonic {
        render () {
            const { sizes, className, filename, decoding,
                loading, fetchpriority } = this.props
            const _class = (this.props.class || className)
            const { defaultSrcset } = CloudinarySrcset(cld)
            const src = (cld.image(filename)
                .format('auto')
                .quality('auto')
                .toURL())

            const srcset = defaultSrcset(filename)

            return this.html`<div class=${'image' + (_class ? ` ${_class}` : '')}>
                <img
                    srcset="${srcset}"
                    sizes="${sizes}"
                    src=${src}
                    decoding="${decoding || 'auto'}"
                    loading="${loading || 'lazy'}"
                    fetchpriority="${fetchpriority || 'low'}"
                />
            </div>`
        }
    }

    return { BlurredImage, ImageTag }
}
