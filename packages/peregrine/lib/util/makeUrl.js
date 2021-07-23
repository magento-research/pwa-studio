import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

// If the root template supplies the backend URL at runtime, use it directly
const { documentElement: htmlElement } = globalThis.document || {};
const { imageOptimizingOrigin } = htmlElement ? htmlElement.dataset : {};
const alreadyOptimized = imageOptimizingOrigin === 'backend';

// Protect against potential falsy values for `mediaBackend`.
const storeCode = storage.getItem('store_view_code') || STORE_VIEW_CODE;
const storeSecureBaseMediaUrl = {};

// Fallback to global secure_base_media_url set at build time
AVAILABLE_STORE_VIEWS.forEach(store => {
    storeSecureBaseMediaUrl[store.code] = store.secure_base_media_url;
});

let mediaBackend =
    storage.getItem('store_view_secure_base_media_url') ||
    storeSecureBaseMediaUrl[storeCode];
if (!mediaBackend) {
    console.warn('A media backend URL should be defined in your config.');
    mediaBackend = 'https://backend.test/media/';
}

// Tests if a URL begins with `http:` or `https:` or `data:`
const absoluteUrl = /^(data|http|https)?:/i;

// Simple path joiner that guarantees one and only one slash between segments
const joinUrls = (base, url) =>
    (base.endsWith('/') ? base.slice(0, -1) : base) +
    '/' +
    (url && url.startsWith('/') ? url.slice(1) : url);

const mediaBases = new Map()
    .set('image-product', 'catalog/product/')
    .set('image-category', 'catalog/category/')
    .set('image-swatch', 'attribute/swatch/');

const getFileType = url => {
    const fileName = url.pathname.split('/').reverse()[0];
    const fileType = fileName.split('.').reverse()[0];

    return fileType;
};

/**
 * Creates an "optimized" url for a provided relative url based on
 * requested media type and width. Any image URLs (whose type begins with
 * "image-" will also be optimized.)
 *
 * If a `type` is provided the `path` will be joined with the associated media
 * base.
 *  - `catalog/product/path/to/img.jpg`
 *
 * If a `width` is provided, "resize parameters" are added to the URL for
 * middlewares (either onboard or backend) to return using the desired width
 * and original media url.
 *  - `catalog/product/path/to/img.jpg?width=500&auto=webp&format=pjpg
 *
 * If only `path` is provided it is returned unaltered.
 *
 * @param {string} path - absolute or relative url to resource.
 * @param {Object} props - properties describing desired optimizations
 * @param {string} props.type - "image-product" or "image-category"
 * @param {number} props.width - the desired resize width of the image
 * @param {number} props.height - the desired resize height of the image
 * @param {number} props.quality - the desired quality of the image
 * @param {bool} props.crop - should the image be cropped
 * @param {string} props.fit - how should the image be fit with the dimensions: bounds, cover, crop
 */
const makeOptimizedUrl = (path, { type, ...opts } = {}) => {
    // Immediate return if there's no image optimization to attempt
    if (!type || !type.startsWith('image-')) {
        return path;
    }

    const { origin } = globalThis.location || {};
    const isAbsolute = absoluteUrl.test(path);
    const magentoBackendURL = process.env.MAGENTO_BACKEND_URL;
    let baseURL = new URL(path, mediaBackend);

    // If URL is relative and has a supported type, prepend media base onto path
    if (!isAbsolute && mediaBases.has(type)) {
        const mediaBase = mediaBases.get(type);
        if (!baseURL.pathname.includes(mediaBase)) {
            baseURL = new URL(joinUrls(mediaBase, path), mediaBackend);
        }
    }

    if (baseURL.href.startsWith(magentoBackendURL) && !alreadyOptimized) {
        // Replace URL base so optimization middleware can handle request
        baseURL = new URL(baseURL.href.slice(magentoBackendURL.length), origin);
    }

    // Append image optimization parameters
    const params = new URLSearchParams(baseURL.search);
    params.set('auto', 'webp'); // Use the webp format if available

    const imageFileType = getFileType(baseURL);
    if (imageFileType === 'png') {
        params.set('format', 'png'); // use png if webp is not available
    } else {
        params.set('format', 'pjpg'); // Use progressive JPG if webp is not available
    }

    Object.entries(opts).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.set(key, value);
        }
    });
    baseURL.search = params.toString();
    if (baseURL.origin === origin) {
        return baseURL.href.slice(baseURL.origin.length);
    }
    return baseURL.href;
};

export default makeOptimizedUrl;
