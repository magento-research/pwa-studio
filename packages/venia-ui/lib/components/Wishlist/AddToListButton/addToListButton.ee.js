import React, { Fragment } from 'react';
import { element, func, shape, string } from 'prop-types';
import { Heart } from 'react-feather';
import { useAddToListButton } from '@magento/peregrine/lib/talons/Wishlist/AddToListButton/useAddToListButton';

import { mergeClasses } from '../../../classify';
import Icon from '../../Icon';
import WishlistDialog from '../WishlistDialog';
import defaultClasses from './addToListButton.css';
import { useCommonToasts } from './useCommonToasts';

const HeartIcon = <Icon size={20} src={Heart} />;

const AddToListButton = props => {
    const talonProps = useAddToListButton(props);
    const {
        buttonProps,
        buttonText,
        errorToastProps,
        isSelected,
        loginToastProps,
        modalProps,
        successToastProps
    } = talonProps;

    useCommonToasts({ errorToastProps, loginToastProps, successToastProps });

    const multipleWishlistDialog = modalProps ? (
        <WishlistDialog {...modalProps} />
    ) : null;

    const classes = mergeClasses(defaultClasses, props.classes);
    const buttonClass = isSelected ? classes.root_selected : classes.root;

    return (
        <Fragment>
            <button className={buttonClass} {...buttonProps}>
                {props.icon} {buttonText}
            </button>
            {multipleWishlistDialog}
        </Fragment>
    );
};

export default AddToListButton;

AddToListButton.defaultProps = {
    icon: HeartIcon
};

AddToListButton.propTypes = {
    afterAdd: func,
    beforeAdd: func,
    classes: shape({
        root: string,
        root_selected: string
    }),
    icon: element
};
