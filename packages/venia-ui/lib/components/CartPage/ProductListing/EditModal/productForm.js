import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { gql } from '@apollo/client';
import { useProductForm } from '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useProductForm';

import { useStyle } from '../../../../classify';
import FormError from '../../../FormError';
import LoadingIndicator from '../../../LoadingIndicator';
import Options from '../../../ProductOptions';
import { QuantityFields } from '../quantity';
import defaultClasses from './productForm.css';
import { CartPageFragment } from '../../cartPageFragments.gql';
import { ProductFormFragment } from './productFormFragment.gql';
import Dialog from '../../../Dialog';
import ProductDetail from './productDetail';

const ProductForm = props => {
    const {
        item: cartItem,
        setIsCartUpdating,
        variantPrice,
        setVariantPrice,
        setActiveEditItem
    } = props;
    const { formatMessage } = useIntl();
    const talonProps = useProductForm({
        cartItem,
        getConfigurableOptionsQuery: GET_CONFIGURABLE_OPTIONS,
        setIsCartUpdating,
        setVariantPrice,
        updateConfigurableOptionsMutation: UPDATE_CONFIGURABLE_OPTIONS_MUTATION,
        updateQuantityMutation: UPDATE_QUANTITY_MUTATION,
        setActiveEditItem
    });
    const {
        configItem,
        errors,
        handleOptionSelection,
        handleSubmit,
        isLoading,
        isSaving,
        isDialogOpen,
        handleClose
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const dialogButtonsDisabled = isLoading;
    const dialogSubmitButtonDisabled = isSaving;
    const dialogFormProps = {
        initialValues: cartItem
    };

    const message = isLoading
        ? formatMessage({
              id: 'productForm.fetchingProductOptions',
              defaultMessage: 'Fetching Product Options...'
          })
            ? isSaving
            : formatMessage({
                  id: 'productForm.updatingCart',
                  defaultMessage: 'Updating Cart...'
              })
        : null;

    const maybeLoadingIndicator =
        isLoading || isSaving ? (
            <LoadingIndicator
                classes={{
                    root: classes.loading
                }}
            >
                {message}
            </LoadingIndicator>
        ) : null;

    if (cartItem && !isLoading && !configItem) {
        return (
            <span className={classes.dataError}>
                <FormattedMessage
                    id={'productForm.dataError'}
                    defaultMessage={
                        'Something went wrong. Please refresh and try again.'
                    }
                />
            </span>
        );
    }

    const dialogContent =
        cartItem && configItem ? (
            <div>
                <FormError
                    classes={{
                        root: classes.errorContainer
                    }}
                    errors={Array.from(errors.values())}
                    scrollOnError={false}
                />
                <ProductDetail item={cartItem} variantPrice={variantPrice} />
                <Options
                    classes={{
                        root: classes.optionRoot
                    }}
                    onSelectionChange={handleOptionSelection}
                    options={configItem.configurable_options}
                    selectedValues={cartItem.configurable_options}
                />
                <h3 className={classes.quantityLabel}>
                    <FormattedMessage
                        id={'productForm.quantity'}
                        defaultMessage={'Quantity'}
                    />
                </h3>
                <QuantityFields
                    classes={{
                        root: classes.quantityRoot
                    }}
                    initialValue={cartItem.quantity}
                    itemId={cartItem.id}
                />
            </div>
        ) : null;

    return (
        <Fragment>
            <Dialog
                classes={{
                    contents: classes.contents
                }}
                confirmText={'Update'}
                confirmTranslationId={'productForm.submit'}
                formProps={dialogFormProps}
                isOpen={isDialogOpen}
                onCancel={handleClose}
                onConfirm={handleSubmit}
                shouldDisableAllButtons={dialogButtonsDisabled}
                shouldDisableConfirmButton={dialogSubmitButtonDisabled}
                shouldUnmountOnHide={false}
                title={formatMessage({
                    id: 'editModal.headerText',
                    defaultMessage: 'Edit Item'
                })}
            >
                {maybeLoadingIndicator}
                {dialogContent}
            </Dialog>
        </Fragment>
    );
};

export default ProductForm;

export const GET_CONFIGURABLE_OPTIONS = gql`
    query productDetailBySku($sku: String) {
        products(filter: { sku: { eq: $sku } }) {
            items {
                id
                ...ProductFormFragment
            }
        }
    }
    ${ProductFormFragment}
`;

export const UPDATE_QUANTITY_MUTATION = gql`
    mutation UpdateCartItemQuantity(
        $cartId: String!
        $cartItemId: Int!
        $quantity: Float!
    ) {
        updateCartItems(
            input: {
                cart_id: $cartId
                cart_items: [{ cart_item_id: $cartItemId, quantity: $quantity }]
            }
        ) @connection(key: "updateCartItems") {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export const UPDATE_CONFIGURABLE_OPTIONS_MUTATION = gql`
    mutation UpdateConfigurableOptions(
        $cartId: String!
        $cartItemId: Int!
        $parentSku: String!
        $variantSku: String!
        $quantity: Float!
    ) {
        removeItemFromCart(
            input: { cart_id: $cartId, cart_item_id: $cartItemId }
        ) @connection(key: "removeItemFromCart") {
            cart {
                id
            }
        }

        addConfigurableProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [
                    {
                        data: { quantity: $quantity, sku: $variantSku }
                        parent_sku: $parentSku
                    }
                ]
            }
        ) @connection(key: "addConfigurableProductsToCart") {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;
