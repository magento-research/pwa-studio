import React from 'react';
import { string, number, shape } from 'prop-types';
import { useAddToCartButton } from '@magento/peregrine/lib/talons/Gallery/useAddToCartButton';
import { mergeClasses } from '../../classify';
import defaultClasses from './addToCartButton.css';
import Button from '../Button';

const GalleryButton = props => {
    
    const talonProps = useAddToCartButton(props);
    const {
        isDisabled,
        handleAddToCart,
        isInStock
    } = talonProps;
    
    const classes = mergeClasses(defaultClasses, props.classes);
    const buttonText = isInStock ? "ADD TO CART" : "OUT OF STOCK"; 
    // show button only if its simple product, configurable must pick color and size
    return (
        <Button
            className={classes.root}
            type="button"
            priority="high"
            onClick={handleAddToCart}
            disabled ={isDisabled}
        >
           {buttonText}
        </Button>
    );
};

export default GalleryButton;

GalleryButton.propTypes = {
    classes: shape({
        root: string,
        root_selected: string
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
    })
};
