import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

// To keep track of the most recent action taken.
const actions = {
    APPLY: 'apply',
    CHECK_BALANCE: 'check',
    REMOVE: 'remove'
};

/**
 * Handles the logic for a component that renders a list of gift cards.
 * It performs effects and returns the prop data necessary for rendering
 * the component.
 *
 * @function
 *
 * @param {Object} props
 * @param {function} props.setIsCartUpdating Callback function for setting the update state for the cart.
 * @param {GiftCardsMutations} props.mutations GraphQL mutations for Gift Cards
 * @param {GiftCardsQueries} props.queries GraphQL queries for Gift Cards
 *
 * @returns {GiftCardsProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useGiftCards } from '@magento/peregrine/lib/talons/CartPage/GiftCards'
 */
export const useGiftCards = props => {
    const {
        setIsCartUpdating,
        mutations: { applyCardMutation, removeCardMutation },
        queries: { appliedCardsQuery, cardBalanceQuery }
    } = props;

    // We need the cartId for all of our queries and mutations.
    const [{ cartId }] = useCartContext();

    /*
     * Apollo hooks.
     *
     * Immediately execute the cart query and set up the other graphql actions.
     */
    const [getAppliedCards, appliedCardsResult] = useLazyQuery(
        appliedCardsQuery
    );
    const [checkCardBalance, balanceResult] = useLazyQuery(cardBalanceQuery);
    const [applyCard, applyCardResult] = useMutation(applyCardMutation);
    const [removeCard, removeCardResult] = useMutation(removeCardMutation);

    /*
     *  useState hooks.
     */
    const [formApi, setFormApi] = useState();
    const [mostRecentAction, setMostRecentAction] = useState(null);

    /*
     *  useEffect hooks.
     */
    // Fire the getAppliedCards query immediately and whenever cartId changes.
    useEffect(() => {
        if (cartId) {
            getAppliedCards({
                fetchPolicy: 'cache-and-network',
                variables: { cartId }
            });
        }
    }, [cartId, getAppliedCards]);

    /*
     * useCallback hooks.
     */
    const applyGiftCard = useCallback(async () => {
        setMostRecentAction(actions.APPLY);

        const giftCardCode = formApi.getValue('card');

        await applyCard({
            variables: {
                cartId,
                giftCardCode
            }
        });

        // Clear the input form after successful apply.
        formApi.reset();
    }, [formApi, applyCard, cartId]);

    const checkGiftCardBalance = useCallback(() => {
        setMostRecentAction(actions.CHECK_BALANCE);

        const giftCardCode = formApi.getValue('card');

        checkCardBalance({
            // Don't cache this one because the card can be used elsewhere
            // before it is used again here.
            fetchPolicy: 'no-cache',
            variables: { giftCardCode }
        });
    }, [formApi, checkCardBalance]);

    const removeGiftCard = useCallback(
        async giftCardCode => {
            setMostRecentAction(actions.REMOVE);

            try {
                await removeCard({
                    variables: {
                        cartId,
                        giftCardCode
                    }
                });
            } catch (err) {
                // do nothing
            }
        },
        [cartId, removeCard]
    );

    const {
        called: applyCardCalled,
        loading: applyCardLoading
    } = applyCardResult;
    const {
        called: removeCardCalled,
        loading: removeCardLoading
    } = removeCardResult;

    useEffect(() => {
        if (applyCardCalled || removeCardCalled) {
            // If a gift card mutation is in flight, tell the cart.
            setIsCartUpdating(applyCardLoading || removeCardLoading);
        }
    }, [
        applyCardCalled,
        applyCardLoading,
        removeCardCalled,
        removeCardLoading,
        setIsCartUpdating
    ]);

    const shouldDisplayCardBalance =
        mostRecentAction === actions.CHECK_BALANCE &&
        Boolean(balanceResult.data);

    // We should only display the last card error if the most recent action was apply or check and they had an error
    const shouldDisplayCardError =
        (mostRecentAction === actions.APPLY && applyCardResult.error) ||
        (mostRecentAction === actions.CHECK_BALANCE && balanceResult.error);

    return {
        applyGiftCard,
        checkBalanceData:
            balanceResult.data && balanceResult.data.giftCardAccount,
        checkGiftCardBalance,
        errorLoadingGiftCards: Boolean(appliedCardsResult.error),
        errorRemovingCard: Boolean(removeCardResult.error),
        giftCardsData:
            (appliedCardsResult.data &&
                appliedCardsResult.data.cart.applied_gift_cards) ||
            [],
        isLoadingGiftCards: appliedCardsResult.loading,
        isApplyingCard: applyCardLoading,
        isCheckingBalance: balanceResult.loading,
        isRemovingCard: removeCardLoading,
        removeGiftCard,
        setFormApi,
        shouldDisplayCardBalance,
        shouldDisplayCardError
    };
};

/** JSDoc type definitions */

/**
 * GraphQL mutations for Gift Cards.
 *
 * @typedef {Object} GiftCardsMutations
 *
 * @property {GraphQLAST} applyCardMutation The mutation used to apply a gift card to the cart.
 * @property {GraphQLAST} removeCardMutation The mutation used to remove a gift card from the cart.
 *
 * @see [`giftCardQueries.js`]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/GiftCards/giftCardQueries.js}
 * for queries used in Venia
 */

/**
 * GraphQL queries for Gift Cards.
 *
 * @typedef {Object} GiftCardsQueries
 *
 * @property {GraphQLAST} appliedCardsQuery The query used to get the gift cards currently applied to the cart.
 * @property {GraphQLAST} cardBalanceQuery The query used to get the gift cards currently applied to the cart.
 *
 * @see [`giftCardQueries.js`]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/GiftCards/giftCardQueries.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering a list of gift cards.
 *
 * @typedef {Object} GiftCardsProps
 *
 * @property {function}  applyGiftCard - A callback to apply a gift card to the cart.
 * @property {Object}    checkBalanceData - The giftCardAccount object of the most recent successful check balance GraphQL query.
 * @property {function}  checkGiftCardBalance - A callback to check the balance of a gift card.
 * @property {boolean}   errorLoadingGiftCards - Whether there was an error loading the cart's gift cards.
 * @property {boolean}   errorApplyingCard - Whether there was an error applying the gift card.
 * @property {boolean}   errorCheckingBalance - Whether there was an error checking the balance of the gift card.
 * @property {boolean}   errorRemovingCard - Whether there was an error removing the gift card.
 * @property {Array}     giftCardsData - The applied_gift_cards object of the cart query.
 * @property {boolean}   isLoadingGiftCards - Whether the cart's gift card data is loading.
 * @property {boolean}   isApplyingCard - Whether the apply gift card operation is in progress.
 * @property {boolean}   isCheckingBalance - Whether the check gift card balance operation is in progress.
 * @property {boolean}   isRemovingCard - Whether the remove gift card operation is in progress.
 * @property {function}  removeGiftCard - A callback to remove a gift card from the cart.
 * @property {boolean}   shouldDisplayCardBalance - Whether to display the gift card balance to the user
 * @property {boolean}   shouldDisplayCardError - Whether to display an error message under the card input field.
 */
