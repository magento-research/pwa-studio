import { useCallback, useState, useMemo } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { appendOptionsToPayload } from '@magento/peregrine/lib/util/appendOptionsToPayload';
import { findMatchingVariant } from '@magento/peregrine/lib/util/findMatchingProductVariant';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';

const INITIAL_OPTION_CODES = new Map();
const INITIAL_OPTION_SELECTIONS = new Map();
const INITIAL_QUANTITY = 1;

const deriveOptionCodesFromProduct = product => {
    // If this is a simple product it has no option codes.
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_CODES;
    }

    // Initialize optionCodes based on the options of the product.
    const initialOptionCodes = new Map();
    for (const {
        attribute_id,
        attribute_code
    } of product.configurable_options) {
        initialOptionCodes.set(attribute_id, attribute_code);
    }

    return initialOptionCodes;
};

// Similar to deriving the initial codes for each option.
const deriveOptionSelectionsFromProduct = product => {
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_SELECTIONS;
    }

    const initialOptionSelections = new Map();
    for (const { attribute_id } of product.configurable_options) {
        initialOptionSelections.set(attribute_id, undefined);
    }

    return initialOptionSelections;
};

const getIsMissingOptions = (product, optionSelections) => {
    // Non-configurable products can't be missing options.
    if (!isProductConfigurable(product)) {
        return false;
    }

    // Configurable products are missing options if we have fewer
    // option selections than the product has options.
    const { configurable_options } = product;
    const numProductOptions = configurable_options.length;
    const numProductSelections = Array.from(optionSelections.values()).filter(
        value => !!value
    ).length;

    return numProductSelections < numProductOptions;
};

const getMediaGalleryEntries = (product, optionCodes, optionSelections) => {
    let value = [];

    const { media_gallery_entries, variants } = product;
    const isConfigurable = isProductConfigurable(product);

    // Selections are initialized to "code => undefined". Once we select a value, like color, the selections change. This filters out unselected options.
    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (!isConfigurable || !optionsSelected) {
        value = media_gallery_entries;
    } else {
        // If any of the possible variants matches the selection add that
        // variant's image to the media gallery. NOTE: This _can_, and does,
        // include variants such as size. If Magento is configured to display
        // an image for a size attribute, it will render that image.
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = item
            ? [...item.product.media_gallery_entries, ...media_gallery_entries]
            : media_gallery_entries;
    }

    return value;
};

// We only want to display breadcrumbs for one category on a PDP even if a
// product has multiple related categories. This function filters and selects
// one category id for that purpose.
const getBreadcrumbCategoryId = categories => {
    const breadcrumbSet = new Set();
    categories.forEach(({ breadcrumbs }) => {
        // breadcrumbs can be `null`...
        (breadcrumbs || []).forEach(({ category_id }) =>
            breadcrumbSet.add(category_id)
        );
    });

    // Until we can get the single canonical breadcrumb path to a product we
    // will just return the first category id of the potential leaf categories.
    const leafCategory = categories.find(
        category => !breadcrumbSet.has(category.id)
    );

    // If we couldn't find a leaf category then just use the first category
    // in the list for this product.
    return leafCategory.id || categories[0].id;
};

export const useProductFullDetail = props => {
    const { product } = props;
    
    const { variants } = product;
    
    const [{ isAddingItem }, { addItemToCart }] = useCartContext();

    const [quantity, setQuantity] = useState(INITIAL_QUANTITY);

    const breadcrumbCategoryId = useMemo(
        () => getBreadcrumbCategoryId(product.categories),
        [product.categories]
    );

    const derivedOptionSelections = useMemo(
        () => deriveOptionSelectionsFromProduct(product),
        [product]
    );

    const [optionSelections, setOptionSelections] = useState(
        derivedOptionSelections
    );

    const derivedOptionCodes = useMemo(
        () => deriveOptionCodesFromProduct(product),
        [product]
    );
    const [optionCodes] = useState(derivedOptionCodes);

    const isMissingOptions = useMemo(
        () => getIsMissingOptions(product, optionSelections),
        [product, optionSelections]
    );
    const mediaGalleryEntries = useMemo(
        () => getMediaGalleryEntries(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    const handleAddToCart = useCallback(() => {
        const payload = {
            item: product,
            productType: product.__typename,
            quantity
        };

        if (isProductConfigurable(product)) {
            appendOptionsToPayload(payload, optionSelections, optionCodes);
        }

        addItemToCart(payload);
    }, [addItemToCart, optionCodes, optionSelections, product, quantity]);

    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            // We must create a new Map here so that React knows that the value
            // of optionSelections has changed.
            const nextOptionSelections = new Map([...optionSelections]);
            nextOptionSelections.set(optionId, selection);
            setOptionSelections(nextOptionSelections);
        },
        [optionSelections]
    );

    const handleSetQuantity = useCallback(
        value => {
            setQuantity(value);
        },
        [setQuantity]
    );
    
    const isConfigurable = isProductConfigurable(product);
    let productPrice = product.price.regularPrice.amount;
    if (isConfigurable) {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        productPrice = item.product.price.regularPrice.amount;
    }

    // Normalization object for product details we need for rendering.
    const productDetails = {
        description: product.description,
        name: product.name,
        price: productPrice,
        sku: product.sku
    };

    return {
        breadcrumbCategoryId,
        handleAddToCart,
        handleSelectionChange,
        handleSetQuantity,
        isAddToCartDisabled: isAddingItem || isMissingOptions,
        mediaGalleryEntries,
        productDetails,
        quantity
    };
};
