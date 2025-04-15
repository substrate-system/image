// @ts-check
import { test } from '@substrate-system/tapzero'
import { Cloudinary } from '@cloudinary/url-gen'
import { CloudinaryImage } from '../dist/cloudinary/index.js'
import { CloudinarySrcset } from '../dist/cloudinary/srcset.js'
import { html } from '../dist/index.js'

const cld = new Cloudinary({
    cloud: { cloudName: 'nichoth' },
    url: { secure: true }
})

test('get srcset for cloudinary', t => {
    const { getSrcset } = CloudinarySrcset(cld)
    const srcs = getSrcset('test-file.jpg', [100, 200, 300])
    const srcsStr = srcs.join(', ')
    t.ok(srcsStr.includes('100w'))
    t.ok(srcsStr.includes('200w'))
    t.ok(srcsStr.includes('300w'))
})

test('create HTML strings with defaults, for locally hosted files', async t => {
    const markup = html({
        filename: '/aaa.jpg',
        alt: 'test picture'
    })

    t.ok(markup, 'Should create HTML')
    t.ok(markup.includes('class="image"'), 'should return the default class')
    t.ok(markup.includes('sizes="100vw"'), 'should create the default sizes')
    t.ok(markup.includes('srcset="/aaa-1024.jpg 1024w, /aaa-768.jpg 768w, /aaa-480.jpg 480w"'),
        'should return the default srcset')
    t.ok(markup.includes('src="/aaa.jpg"'), 'should create the src from filename')
    t.ok(markup.includes('decoding="auto"'), 'has the default "decoding" attribute')
    t.ok(markup.includes('loading="lazy"'), 'has "loading" attribute')
    t.ok(markup.includes('fetchpriority="low"'),
        'should have the default fetchpriority')
    t.ok(markup.includes('alt="test picture"'),
        'should have the given `alt` attribute')
})

test('create HTML string for cloudinary hosted images', async t => {
    const { Image } = CloudinaryImage('nichoth')

    const html = Image({
        filename: 'bbb.jpg',
        alt: 'testing'
    })

    t.ok(html.includes('class="image"'), 'has the default class name')
    t.ok(html.includes('alt="testing"'), 'should include the `alt` text')
    t.ok(html.includes('src="https://res.cloudinary.com/'),
        'includes the `src` attribute with a cloudinary URL')
    t.ok(html.includes('decoding="auto"'), 'has the default "decoding" attribute')
    t.ok(html.includes('loading="lazy"'), 'has "loading" attribute')
    t.ok(html.includes('fetchpriority="low"'),
        'should have the default fetchpriority')
})
