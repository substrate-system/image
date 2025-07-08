export interface Props {
    class?:string,
    filename:string,
    alt:string,
    loading?:'eager'|'lazy',
    fetchpriority?:'high'|'low'|'auto',
    className?:string,
    decoding?:'sync'|'async',
    sizes?:string[],
    srcset?: number[]
}

export const defaultSizes = [1024, 768, 480]

/**
 * Given a list of numbers,
 * return a `sizes` attribute
 */
export function sizes (sizes?:number[]) {
    // __sizes__
    // 1. A media condition -- (max-width:600px)
    // 2. The width of the slot the image will fill when the media condition
    //    is true (480px)
    const _sizes = '(max-width: 480px) (max-width:600px), 800px'

    // sizes="${sizes?.join(', ') || '100vw'}"
    return (sizes || defaultSizes).join(', ')
}
