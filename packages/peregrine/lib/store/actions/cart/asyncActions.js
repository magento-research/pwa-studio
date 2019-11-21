import { Magento2 } from '../../../RestApi';
import BrowserPersistence from '../../../util/simplePersistence';
import { closeDrawer, toggleDrawer } from '../app';
import actions from './actions';

const { request } = Magento2;
const storage = new BrowserPersistence();

/**
 * Stores the cart id in local storage and the redux store. Then triggers a refresh of cart details.
 * @param {String} cartId
 */
export const setCartId = cartId =>
    async function thunk(dispatch) {
        // write to storage in the background
        saveCartId(cartId);
        await dispatch(actions.getCart.receive(cartId));
    };

export const addItemToCart = (payload = {}) => {
    const { item, quantity } = payload;
    const writingImageToCache = writeImageToCache(item);

    return async function thunk(dispatch, getState) {
        await writingImageToCache;
        dispatch(actions.addItem.request(payload));

        try {
            const { cart, user } = getState();
            const { isSignedIn } = user;
            let cartEndpoint;

            if (!isSignedIn) {
                const { cartId } = cart;

                if (!cartId) {
                    const missingCartIdError = new Error(
                        'Missing required information: cartId'
                    );
                    missingCartIdError.noCartId = true;
                    throw missingCartIdError;
                }

                cartEndpoint = `/rest/V1/guest-carts/${cartId}/items`;
            } else {
                cartEndpoint = '/rest/V1/carts/mine/items';
            }

            const quoteId = getQuoteIdForRest(cart, user);
            const cartItem = toRESTCartItem(quoteId, payload);
            const response = await request(cartEndpoint, {
                method: 'POST',
                body: JSON.stringify({ cartItem })
            });

            // 2019-02-07  Moved these dispatches to the success clause of
            // addItemToCart. The cart should only open on success.
            // In the catch clause, this action creator calls its own thunk,
            // so a successful retry will wind up here anyway.
            await dispatch(getCartDetails({ forceRefresh: true }));
            await dispatch(toggleDrawer('cart'));
            dispatch(
                actions.addItem.receive({ cartItem: response, item, quantity })
            );
        } catch (error) {
            const { response, noCartId } = error;

            dispatch(actions.addItem.receive(error));
            // Delete the cached ID from local storage and Redux.
            // In contrast to the save, make sure storage deletion is
            // complete before dispatching the error--you don't want an
            // upstream action to try and reuse the known-bad ID.
            await dispatch(removeCart());

            // check if the cart has expired
            if (noCartId || (response && response.status === 404)) {
                // then retry this operation
                return thunk(...arguments);
            }
        }
    };
};

export const updateItemInCart = (payload = {}, targetItemId) => {
    const { item, quantity } = payload;
    const writingImageToCache = writeImageToCache(item);

    return async function thunk(dispatch, getState) {
        await writingImageToCache;
        dispatch(actions.updateItem.request(payload));

        try {
            const { cart, user } = getState();
            const { isSignedIn } = user;
            let cartEndpoint;

            if (!isSignedIn) {
                const { cartId } = cart;

                if (!cartId) {
                    const missingCartIdError = new Error(
                        'Missing required information: cartId'
                    );
                    missingCartIdError.noCartId = true;
                    throw missingCartIdError;
                }

                cartEndpoint = `/rest/V1/guest-carts/${cartId}/items/${targetItemId}`;
            } else {
                cartEndpoint = `/rest/V1/carts/mine/items/${targetItemId}`;
            }

            const quoteId = getQuoteIdForRest(cart, user);
            const cartItem = toRESTCartItem(quoteId, payload);
            const response = await request(cartEndpoint, {
                method: 'PUT',
                body: JSON.stringify({ cartItem })
            });

            dispatch(
                actions.updateItem.receive({
                    cartItem: response,
                    item,
                    quantity
                })
            );
        } catch (error) {
            const { response, noCartId } = error;

            dispatch(actions.updateItem.receive(error));
            // Delete the cached ID from local storage and Redux.
            // In contrast to the save, make sure storage deletion is
            // complete before dispatching the error--you don't want an
            // upstream action to try and reuse the known-bad ID.
            await dispatch(removeCart());

            // check if the cart has expired
            if (noCartId || (response && response.status === 404)) {
                if (user.isSignedIn) {
                    // The user is signed in and we just received their cart.
                    // Retry this operation.
                    return thunk(...arguments);
                } else {
                    // The user is a guest and just received a brand new (empty) cart.
                    // Add the updated item to that cart.
                    await dispatch(addItemToCart(payload));
                }
            }
        }

        await dispatch(getCartDetails({ forceRefresh: true }));
    };
};

export const removeItemFromCart = payload => {
    const { item } = payload;

    return async function thunk(dispatch, getState) {
        dispatch(actions.removeItem.request(payload));

        const { cart, user } = getState();
        let isLastItem = false;

        try {
            const { cartId } = cart;
            const { isSignedIn } = user;
            let cartEndpoint;

            if (!isSignedIn) {
                if (!cartId) {
                    const missingCartIdError = new Error(
                        'Missing required information: cartId'
                    );
                    missingCartIdError.noCartId = true;
                    throw missingCartIdError;
                }
                cartEndpoint = `/rest/V1/guest-carts/${cartId}/items/${
                    item.item_id
                }`;
            } else {
                cartEndpoint = `/rest/V1/carts/mine/items/${item.item_id}`;
            }

            const response = await request(cartEndpoint, {
                method: 'DELETE'
            });

            const cartItemCount = cart.details ? cart.details.items_count : 0;
            if (cartItemCount === 1) {
                isLastItem = true;
            }

            dispatch(
                actions.removeItem.receive({
                    cartItem: response,
                    item,
                    cartItemCount
                })
            );
        } catch (error) {
            const { response, noCartId } = error;

            dispatch(actions.removeItem.receive(error));

            // Delete the cached ID from local storage.
            // The reducer handles clearing out the bad ID from Redux.
            // In contrast to the save, make sure storage deletion is
            // complete before dispatching the error--you don't want an
            // upstream action to try and reuse the known-bad ID.
            await dispatch(removeCart());

            // check if the cart has expired
            if (noCartId || (response && response.status === 404)) {
                if (user.isSignedIn) {
                    // The user is signed in and we just received their cart.
                    // Retry this operation.
                    return thunk(...arguments);
                }

                // Else the user is a guest and just received a brand new (empty) cart.
                // We don't retry because we'd be attempting to remove an item
                // from an empty cart.
            }
        }

        // When removing the last item in the cart, perform a reset of the Cart ID
        // and create a new cart to prevent a bug where the next item added to the
        // cart has a price of 0. Otherwise refresh cart details to get updated totals.
        if (isLastItem) {
            await dispatch(removeCart());
        } else {
            await dispatch(getCartDetails({ forceRefresh: true }));
        }
    };
};

export const getCartDetails = (payload = {}) => {
    const { forceRefresh } = payload;

    return async function thunk(dispatch, getState) {
        const { cart, user } = getState();
        const { cartId } = cart;
        const { isSignedIn } = user;

        // Once we have the cart id indicate that we are starting to make
        // async requests for the details.
        dispatch(actions.getDetails.request(cartId));

        try {
            if (!cartId) {
                throw new Error('Cannot fetch cart details without cartId.');
            }

            const [
                imageCache,
                details,
                paymentMethods,
                totals
            ] = await Promise.all([
                retrieveImageCache(),
                fetchCartPart({
                    cartId,
                    forceRefresh,
                    isSignedIn
                }),
                fetchCartPart({
                    cartId,
                    forceRefresh,
                    isSignedIn,
                    subResource: 'payment-methods'
                }),
                fetchCartPart({
                    cartId,
                    forceRefresh,
                    isSignedIn,
                    subResource: 'totals'
                })
            ]);

            const { items } = details;

            // for each item in the cart, look up its image in the cache
            // and merge it into the item object
            // then assign its options from the totals subResource
            // TODO: If we don't have the image in cache we should probably try
            // to find it some other way otherwise we have no image to display
            // in the cart and will have to fall back to a placeholder.
            if (imageCache && Array.isArray(items) && items.length) {
                const validTotals = totals && totals.items;
                items.forEach(item => {
                    item.image = item.image || imageCache[item.sku] || {};

                    let options = [];
                    if (validTotals) {
                        const matchingItem = totals.items.find(
                            t => t.item_id === item.item_id
                        );
                        if (matchingItem && matchingItem.options) {
                            options = JSON.parse(matchingItem.options);
                        }
                    }
                    item.options = options;
                });
            }

            dispatch(
                actions.getDetails.receive({ details, paymentMethods, totals })
            );
        } catch (error) {
            const { response } = error;

            dispatch(actions.getDetails.receive(error));
            // if so, then delete the cached ID from local storage.
            // The reducer handles clearing out the bad ID from Redux.
            // In contrast to the save, make sure storage deletion is
            // complete before dispatching the error--you don't want an
            // upstream action to try and reuse the known-bad ID.
            await dispatch(removeCart());

            // check if the cart has expired
            if (response && response.status === 404) {
                // then retry this operation
                return thunk(...arguments);
            }
        }
    };
};

export const toggleCart = () =>
    async function thunk(dispatch, getState) {
        const { app, cart } = getState();

        // ensure state slices are present
        if (!app || !cart) {
            return;
        }

        // if the cart drawer is open, close it
        if (app.drawer === 'cart') {
            return dispatch(closeDrawer());
        }

        // otherwise open the cart and load its contents
        await Promise.all([
            dispatch(toggleDrawer('cart')),
            dispatch(getCartDetails())
        ]);
    };

export const removeCart = () =>
    async function thunk(dispatch) {
        // Clear the cartId from local storage.
        await clearCartId();

        // Clear the cart info from the redux store.
        await dispatch(actions.reset());
    };

/* helpers */

async function fetchCartPart({
    cartId,
    forceRefresh,
    isSignedIn,
    subResource = ''
}) {
    const signedInEndpoint = `/rest/V1/carts/mine/${subResource}`;
    const guestEndpoint = `/rest/V1/guest-carts/${cartId}/${subResource}`;
    const endpoint = isSignedIn ? signedInEndpoint : guestEndpoint;

    const cache = forceRefresh ? 'reload' : 'default';

    return request(endpoint, { cache });
}

export async function retrieveCartId() {
    return storage.getItem('cartId');
}

export async function saveCartId(id) {
    return storage.setItem('cartId', id);
}

export async function clearCartId() {
    return storage.removeItem('cartId');
}

async function retrieveImageCache() {
    return storage.getItem('imagesBySku') || {};
}

async function saveImageCache(cache) {
    return storage.setItem('imagesBySku', cache);
}

/**
 * Transforms an item payload to a shape that the REST endpoints expect.
 * When GraphQL comes online we can drop this.
 */
function toRESTCartItem(cartId, payload) {
    const { item, productType, quantity } = payload;

    const cartItem = {
        qty: quantity,
        sku: item.sku,
        name: item.name,
        quote_id: cartId
    };

    if (productType === 'ConfigurableProduct') {
        const { options, parentSku } = payload;

        cartItem.sku = parentSku;
        cartItem.product_type = 'configurable';
        cartItem.product_option = {
            extension_attributes: {
                configurable_item_options: options
            }
        };
    }

    return cartItem;
}

export async function writeImageToCache(item = {}) {
    const { media_gallery_entries: media, sku } = item;

    if (sku) {
        const image = media && (media.find(m => m.position === 1) || media[0]);

        if (image) {
            const imageCache = await retrieveImageCache();

            // if there is an image and it differs from cache
            // write to cache and save in the background
            if (imageCache[sku] !== image) {
                imageCache[sku] = image;
                saveImageCache(imageCache);

                return image;
            }
        }
    }
}

/**
 * This function returns the correct quote id for use by the REST endpoint.
 * For authed users we have to use the "actual" id. For guest users we use the
 * "masked" id. When we fully convert cart requests to graphql we can do away
 * with this function.
 */
export function getQuoteIdForRest(cart, user) {
    if (user.isSignedIn) {
        if (!cart.details.id) {
            console.error(
                'No cartId for authed user found. Please refresh the page and try again.'
            );
            return cart.cartId;
        }
        return cart.details.id;
    } else {
        if (!cart.cartId) {
            console.error(
                'No cartId for guest user found. Please refresh the page and try again.'
            );
        }
        return cart.cartId;
    }
}
