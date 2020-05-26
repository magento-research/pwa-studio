import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { useAppContext } from '../../../context/app';
import { useCartContext } from '../../../context/cart';
import { CHECKOUT_STEP } from '../useCheckoutPage';

/**
 *
 * @param {Function} props.onSave callback to be called when user clicks review order button
 * @param {Boolean} props.shouldSubmit property telling us to proceed to next step
 * @param {Function} props.resetShouldSubmit callback to reset the review order button flag
 * @param {DocumentNode} props.queries.getPaymentInformation query to fetch data to render this component
 *
 * @returns {
 *   doneEditing: Boolean,
 *   isEditModalActive: Boolean,
 *   showEditModal: Function,
 *   hideEditModal: Function,
 *   handlePaymentError: Function,
 *   handlePaymentSuccess: Function,
 *   checkoutStep: Number,
 *
 * }
 */
export const usePaymentInformation = props => {
    const {
        mutations,
        onSave,
        queries,
        resetShouldSubmit,
        setCheckoutStep,
        shouldSubmit
    } = props;
    const { setPaymentMethodMutation } = mutations;
    const { getPaymentInformation } = queries;

    /**
     * Definitions
     */

    const [doneEditing, setDoneEditing] = useState(false);
    const [{ drawer }, { toggleDrawer, closeDrawer }] = useAppContext();
    const isEditModalActive = drawer === 'edit.payment';
    const [{ cartId }] = useCartContext();

    /**
     * Helper Functions
     */

    const showEditModal = useCallback(() => {
        toggleDrawer('edit.payment');
    }, [toggleDrawer]);

    const hideEditModal = useCallback(() => {
        closeDrawer('edit.payment');
    }, [closeDrawer]);

    const handlePaymentSuccess = useCallback(() => {
        setDoneEditing(true);
        if (onSave) {
            onSave();
        }
    }, [onSave]);

    const handlePaymentError = useCallback(() => {
        resetShouldSubmit();
        setDoneEditing(false);
    }, [resetShouldSubmit]);

    /**
     * Queries
     */
    const {
        data: paymentInformationData,
        loading: paymentInformationLoading
    } = useQuery(getPaymentInformation, {
        variables: { cartId },
        fetchPolicy: 'cache-and-network'
    });
    const [
        setPaymentMethod,
        { loading: setPaymentMethodLoading }
    ] = useMutation(setPaymentMethodMutation);
    /**
     * Effects
     */

    const availablePaymentMethods = paymentInformationData
        ? paymentInformationData.cart.available_payment_methods
        : [];

    const selectedPaymentMethod =
        (paymentInformationData &&
            paymentInformationData.cart.selected_payment_method.code) ||
        null;

    // Whenever available methods change we should reset to the editing view
    // so that a user can see the newly available methods. Additionally, the
    // current pattern requires that the method components themselves
    // indicate their "done" state so we must leave it to them to revert
    // this effect downstream.
    useEffect(() => {
        if (
            !availablePaymentMethods.find(
                ({ code }) => code === selectedPaymentMethod
            )
        ) {
            resetShouldSubmit();
            setCheckoutStep(CHECKOUT_STEP.PAYMENT);
            setDoneEditing(false);
        }
    }, [
        availablePaymentMethods,
        resetShouldSubmit,
        selectedPaymentMethod,
        setCheckoutStep
    ]);

    // If free is ever available and not selected, automatically select it.
    useEffect(() => {
        const setFreeIfAvailable = async () => {
            const freeIsAvailable = !!availablePaymentMethods.find(
                ({ code }) => code === 'free'
            );
            if (freeIsAvailable) {
                if (selectedPaymentMethod !== 'free') {
                    await setPaymentMethod({
                        variables: {
                            cartId,
                            method: {
                                code: 'free'
                            }
                        }
                    });
                    setDoneEditing(true);
                } else {
                    setDoneEditing(true);
                }
            }
        };
        setFreeIfAvailable();
    }, [
        availablePaymentMethods,
        cartId,
        selectedPaymentMethod,
        setDoneEditing,
        setPaymentMethod
    ]);

    // When the "review order" button is clicked, if the selected method is free
    // and free is still available, proceed.
    useEffect(() => {
        if (
            shouldSubmit &&
            availablePaymentMethods.find(({ code }) => code === 'free') &&
            selectedPaymentMethod === 'free'
        ) {
            onSave();
        }
    });

    // We must wait for payment method to be set if this is the first time we
    // are hitting this component and the total is $0. If we don't wait then
    // the CC component will mount while the setPaymentMethod mutation is in flight.
    const isLoading = paymentInformationLoading || setPaymentMethodLoading;

    return {
        doneEditing,
        isEditModalActive,
        isLoading,
        handlePaymentError,
        handlePaymentSuccess,
        hideEditModal,
        showEditModal
    };
};
