import React from 'react';
import { shape, string, bool, func } from 'prop-types';
import { RadioGroup } from 'informed';

import Radio from '../../RadioGroup/radio';
import CreditCardPaymentMethod from './creditCardPaymentMethod';
import { mergeClasses } from '../../../classify';

import defaultClasses from './paymentMethods.css';

const PaymentMethods = props => {
    const {
        classes: propClasses,
        reviewOrderButtonClicked,
        selectedPaymentMethod,
        onPaymentSuccess,
        onPaymentError,
        resetReviewOrderButtonClicked
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const creditCardPaymentMethod =
        selectedPaymentMethod === 'braintree' ? (
            <CreditCardPaymentMethod
                updateButtonClicked={reviewOrderButtonClicked}
                brainTreeDropinContainerId={
                    'checkout-page-braintree-dropin-container'
                }
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
                resetUpdateButtonClicked={resetReviewOrderButtonClicked}
            />
        ) : null;

    return (
        <div className={classes.root}>
            <RadioGroup field="selectedPaymentMethod">
                <div className={classes.payment_method}>
                    <Radio
                        key={'braintree'}
                        label={'Credit Card'}
                        value={'braintree'}
                        classes={{
                            label: classes.radio_label
                        }}
                        checked={selectedPaymentMethod === 'braintree'}
                    />
                    {creditCardPaymentMethod}
                </div>
            </RadioGroup>
        </div>
    );
};

export default PaymentMethods;

PaymentMethods.propTypes = {
    classes: shape({
        root: string,
        payment_method: string,
        radio_label: string
    }),
    reviewOrderButtonClicked: bool,
    selectedPaymentMethod: string,
    onPaymentSuccess: func,
    onPaymentError: func,
    resetReviewOrderButtonClicked: func
};
