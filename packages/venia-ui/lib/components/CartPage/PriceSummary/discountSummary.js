import React from 'react';
import gql from 'fraql';
import { Price } from '@magento/peregrine';

const DEFAULT_AMOUNT = {
    currency: 'USD',
    value: 0
};

/**
 * Reduces discounts array into a single amount.
 *
 * @param {Array} discounts
 */
const getDiscount = (discounts = []) => {
    if (!discounts || !discounts.length) {
        return DEFAULT_AMOUNT;
    } else {
        return {
            currency: discounts[0].amount.currency,
            value: discounts.reduce(
                (acc, discount) => acc + discount.amount.value,
                0
            )
        };
    }
};

/**
 * A component that renders the discount summary line item.
 *
 * @param {Object} props.classes
 * @param {Object} props.data query response data
 */
const DiscountSummary = props => {
    const { classes } = props;
    const discount = getDiscount(props.data.cart.prices.discounts);

    return discount.value ? (
        <>
            <span className={classes.lineItemLabel}>{'Discounts applied'}</span>
            <span className={classes.price}>
                {'(-'}
                <Price
                    value={discount.value}
                    currencyCode={discount.currency}
                />
                {')'}
            </span>
        </>
    ) : null;
};

DiscountSummary.fragment = gql`
    fragment _ on CartPrices {
        discounts {
            amount {
                currency
                value
            }
            label
        }
    }
`;

export default DiscountSummary;
