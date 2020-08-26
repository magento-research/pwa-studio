import React, { useMemo } from 'react';
import gql from 'graphql-tag';
import { Link, resourceUrl } from '@magento/venia-drivers';
import { useProduct } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProduct';
import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../../classify';
import Kebab from '../../LegacyMiniCart/kebab';
import ProductOptions from '../../LegacyMiniCart/productOptions';
import Quantity from './quantity';
import Section from '../../LegacyMiniCart/section';
import Image from '../../Image';
import defaultClasses from './product.css';
import { CartPageFragment } from '../cartPageFragments.gql';
import { AvailableShippingMethodsCartFragment } from '../PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql';
const IMAGE_SIZE = 100;

const Product = props => {
    const { item, setActiveEditItem, setIsCartUpdating } = props;
    const talonProps = useProduct({
        item,
        mutations: {
            removeItemMutation: REMOVE_ITEM_MUTATION,
            updateItemQuantityMutation: UPDATE_QUANTITY_MUTATION
        },
        setActiveEditItem,
        setIsCartUpdating
    });

    const {
        errorMessage,
        handleEditItem,
        handleRemoveFromCart,
        handleToggleFavorites,
        handleUpdateItemQuantity,
        isEditable,
        isFavorite,
        product
    } = talonProps;

    const {
        currency,
        image,
        name,
        options,
        quantity,
        stockStatus,
        unitPrice,
        urlKey,
        urlSuffix
    } = product;

    const classes = mergeClasses(defaultClasses, props.classes);

    const editItemSection = isEditable ? (
        <Section
            text="Edit item"
            onClick={handleEditItem}
            icon="Edit2"
            classes={{ text: classes.sectionText }}
        />
    ) : null;

    const itemLink = useMemo(() => resourceUrl(`/${urlKey}${urlSuffix}`), [
        urlKey,
        urlSuffix
    ]);

    const stockStatusMessage =
        stockStatus === 'OUT_OF_STOCK' ? 'Out-of-stock' : '';

    return (
        <li className={classes.root}>
            <span className={classes.errorText}>{errorMessage}</span>
            <div className={classes.item}>
                <Link to={itemLink} className={classes.imageContainer}>
                    <Image
                        alt={name}
                        classes={{
                            root: classes.imageRoot,
                            image: classes.image
                        }}
                        width={IMAGE_SIZE}
                        resource={image}
                    />
                </Link>
                <div className={classes.details}>
                    <Link to={itemLink} className={classes.name}>
                        {name}
                    </Link>
                    <ProductOptions
                        options={options}
                        classes={{
                            options: classes.options,
                            optionLabel: classes.optionLabel
                        }}
                    />
                    <span className={classes.price}>
                        <Price currencyCode={currency} value={unitPrice} />
                        {' ea.'}
                    </span>
                    <span className={classes.stockStatusMessage}>
                        {stockStatusMessage}
                    </span>
                    <div className={classes.quantity}>
                        <Quantity
                            itemId={item.id}
                            initialValue={quantity}
                            onChange={handleUpdateItemQuantity}
                        />
                    </div>
                </div>
                <Kebab classes={{ root: classes.kebab }} disabled={true}>
                    <Section
                        text={
                            isFavorite
                                ? 'Remove from favorites'
                                : 'Move to favorites'
                        }
                        onClick={handleToggleFavorites}
                        icon="Heart"
                        isFilled={isFavorite}
                        classes={{ text: classes.sectionText }}
                    />
                    {editItemSection}
                    <Section
                        text="Remove from cart"
                        onClick={handleRemoveFromCart}
                        icon="Trash"
                        classes={{ text: classes.sectionText }}
                    />
                </Kebab>
            </div>
        </li>
    );
};

export default Product;

export const REMOVE_ITEM_MUTATION = gql`
    mutation removeItem($cartId: String!, $itemId: Int!) {
        removeItemFromCart(input: { cart_id: $cartId, cart_item_id: $itemId })
            @connection(key: "removeItemFromCart") {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;

export const UPDATE_QUANTITY_MUTATION = gql`
    mutation updateItemQuantity(
        $cartId: String!
        $itemId: Int!
        $quantity: Float!
    ) {
        updateCartItems(
            input: {
                cart_id: $cartId
                cart_items: [{ cart_item_id: $itemId, quantity: $quantity }]
            }
        ) @connection(key: "updateCartItems") {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;
