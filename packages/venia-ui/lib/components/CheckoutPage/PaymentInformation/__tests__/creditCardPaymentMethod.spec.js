import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useCreditCard } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useCreditCard';

import CreditCardPaymentMethod from '../creditCardPaymentMethod';

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useCreditCard',
    () => {
        return {
            useCreditCard: jest.fn().mockReturnValue({
                onPaymentError: jest.fn(),
                onPaymentSuccess: jest.fn(),
                onPaymentReady: jest.fn(),
                isBillingAddressSame: false,
                countries: {},
                isDropinLoading: false
            })
        };
    }
);

jest.mock('../brainTreeDropIn', () => {
    return () => <div>Braintree Dropin Component</div>;
});

jest.mock('../../../LoadingIndicator', () => {
    return () => <div>Loading Indicator Component</div>;
});

jest.mock('../../../Checkbox', () => {
    return () => <div>Checkbox Component</div>;
});

jest.mock('../../../Field', () => {
    return () => <div>Field Component</div>;
});

jest.mock('../../../TextInput', () => {
    return () => <div>Text Input Component</div>;
});

test('Snapshot test', () => {
    const tree = createTestInstance(<CreditCardPaymentMethod />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('Should render billing address fields if isBillingAddressSame is false', () => {
    useCreditCard.mockReturnValueOnce({
        onPaymentError: jest.fn(),
        onPaymentSuccess: jest.fn(),
        onPaymentReady: jest.fn(),
        isBillingAddressSame: false,
        countries: {},
        isDropinLoading: false
    });

    const tree = createTestInstance(<CreditCardPaymentMethod />);

    expect(
        tree.root.findByProps({ id: 'billingAddressFields' })
    ).not.toBeNull();
});

test('Should not render billing address fields if isBillingAddressSame is true', () => {
    useCreditCard.mockReturnValueOnce({
        onPaymentError: jest.fn(),
        onPaymentSuccess: jest.fn(),
        onPaymentReady: jest.fn(),
        isBillingAddressSame: true,
        countries: {},
        isDropinLoading: false
    });

    const tree = createTestInstance(<CreditCardPaymentMethod />);

    expect(() => {
        tree.root.findByProps({ id: 'billingAddressFields' });
    }).toThrow();
});
