import React from 'react';
import { string, number, shape } from 'prop-types';
import { Link } from 'react-router-dom';
import Price from '@magento/venia-ui/lib/components/Price';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import { useGalleryItem } from '@magento/peregrine/lib/talons/Gallery/useGalleryItem';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '../../classify';
import Image from '../Image';
import GalleryItemShimmer from './item.shimmer';
import defaultClasses from './item.css';
import WishlistGalleryButton from '../Wishlist/AddToListButton';

// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map()
    .set(640, IMAGE_WIDTH)
    .set(UNCONSTRAINED_SIZE_KEY, 840);

const GalleryItem = props => {
    const { handleLinkClick, item, wishlistButtonProps } = useGalleryItem(
        props
    );

    const classes = useStyle(defaultClasses, props.classes);

    if (!item) {
        return <GalleryItemShimmer classes={classes} />;
    }

    const { name, price, small_image, url_key, url_suffix } = item;
    const { url: smallImageURL } = small_image;
    const productLink = resourceUrl(`/${url_key}${url_suffix || ''}`);

    const wishlistButton = wishlistButtonProps ? (
        <WishlistGalleryButton {...wishlistButtonProps} />
    ) : null;

    return (
        <div className={classes.root} aria-live="polite" aria-busy="false">
            <Link
                onClick={handleLinkClick}
                to={productLink}
                className={classes.images}
            >
                <Image
                    alt={name}
                    classes={{
                        image: classes.image,
                        loaded: classes.imageLoaded,
                        notLoaded: classes.imageNotLoaded,
                        root: classes.imageContainer
                    }}
                    height={IMAGE_HEIGHT}
                    resource={smallImageURL}
                    widths={IMAGE_WIDTHS}
                />
            </Link>
            <Link
                onClick={handleLinkClick}
                to={productLink}
                className={classes.name}
            >
                <span>{name}</span>
            </Link>
            <div className={classes.price}>
                <Price
                    value={price.regularPrice.amount.value}
                    currencyCode={price.regularPrice.amount.currency}
                />
            </div>
            <div className={classes.actionsContainer}>{wishlistButton}</div>
        </div>
    );
};

GalleryItem.propTypes = {
    classes: shape({
        image: string,
        imageLoaded: string,
        imageNotLoaded: string,
        imageContainer: string,
        images: string,
        name: string,
        price: string,
        root: string
    }),
    item: shape({
        id: number.isRequired,
        name: string.isRequired,
        small_image: shape({
            url: string.isRequired
        }),
        url_key: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired
            }).isRequired
        }).isRequired
    }),
    storeConfig: shape({
        magento_wishlist_general_is_enabled: string.isRequired
    })
};

export default GalleryItem;
