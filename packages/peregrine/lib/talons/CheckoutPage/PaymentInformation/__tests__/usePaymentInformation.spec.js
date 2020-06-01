import React from 'react';

import { usePaymentInformation } from '../usePaymentInformation';
import createTestInstance from '../../../../util/createTestInstance';
import { useAppContext } from '../../../../context/app';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CHECKOUT_STEP } from '../../useCheckoutPage';

jest.mock('../../../../context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '123' }])
}));

jest.mock('../../../../context/app', () => ({
    useAppContext: jest
        .fn()
        .mockReturnValue([
            {},
            { toggleDrawer: () => {}, closeDrawer: () => {} }
        ])
}));

jest.mock('@apollo/react-hooks', () => {
    return {
        useQuery: jest.fn().mockReturnValue({
            data: {
                cart: {
                    available_payment_methods: [{ code: 'braintree' }],
                    selected_payment_method: {},
                    shipping_addresses: [
                        {
                            firstname: 'I',
                            lastname: 'love',
                            street: ['graphql'],
                            city: 'it',
                            region: {
                                code: 'is'
                            },
                            postcode: 90210,
                            country: {
                                code: 'great'
                            },
                            telephone: 1234567890
                        }
                    ]
                }
            },
            loading: false
        }),
        useMutation: jest.fn().mockReturnValue([jest.fn(), { loading: false }])
    };
});

jest.mock('informed', () => {
    return {
        useFieldState: jest.fn().mockReturnValue({ value: 'braintree' })
    };
});

const defaultTalonProps = {
    mutations: {
        setFreePaymentMethodMutation: 'setFreePaymentMethodMutation',
        setBillingAddressMutation: 'setBillingAddressMutation'
    },
    onSave: jest.fn(),
    queries: {
        getPaymentDetailsQuery: 'getPaymentDetailsQuery'
    },
    resetShouldSubmit: jest.fn(),
    setCheckoutStep: jest.fn(),
    shouldSubmit: false
};

const Component = props => {
    const talonProps = usePaymentInformation(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { talonProps } = tree.root.findByType('i').props;

    const update = newProps => {
        tree.update(<Component {...{ ...props, ...newProps }} />);

        return tree.root.findByType('i').props;
    };

    return { talonProps, tree, update };
};

test('Should return correct shape', () => {
    const { talonProps } = getTalonProps({ ...defaultTalonProps });

    expect(talonProps).toMatchSnapshot();
});

test('hideEditModal should call closeDrawer from app context', () => {
    const closeDrawer = jest.fn();
    useAppContext.mockReturnValueOnce([
        {},
        { toggleDrawer: () => {}, closeDrawer }
    ]);

    const { talonProps } = getTalonProps({ ...defaultTalonProps });

    talonProps.hideEditModal();

    expect(closeDrawer).toHaveBeenCalledWith('edit.payment');
});

test('showEditModal should call toggleDrawer from app context', () => {
    const toggleDrawer = jest.fn();
    useAppContext.mockReturnValueOnce([
        {},
        { closeDrawer: () => {}, toggleDrawer }
    ]);

    const { talonProps } = getTalonProps({ ...defaultTalonProps });

    talonProps.showEditModal();

    expect(toggleDrawer).toHaveBeenCalledWith('edit.payment');
});

test('resets to payment step when selected method is not available', () => {
    useQuery.mockReturnValueOnce({
        data: {
            cart: {
                available_payment_methods: [{ code: 'braintree' }],
                selected_payment_method: { code: 'free' },
                shipping_addresses: {}
            }
        },
        loading: false
    });

    createTestInstance(<Component {...defaultTalonProps} />);

    expect(defaultTalonProps.resetShouldSubmit).toHaveBeenCalled();
    expect(defaultTalonProps.setCheckoutStep).toHaveBeenCalledWith(
        CHECKOUT_STEP.PAYMENT
    );
});

test('selects the free payment method if available and not selected', () => {
    const runMutation = jest.fn();

    useMutation.mockReturnValueOnce([
        runMutation,
        {
            loading: false
        }
    ]);

    useQuery.mockReturnValueOnce({
        data: {
            cart: {
                available_payment_methods: [{ code: 'free' }],
                selected_payment_method: { code: 'braintree' },
                shipping_addresses: {}
            }
        },
        loading: false
    });

    createTestInstance(<Component {...defaultTalonProps} />);

    expect(runMutation).toHaveBeenCalled();
});

test('sets shipping address as billing address whenever "free" is selected', () => {
    const setFreePaymentMethod = jest.fn();
    const setBillingAddress = jest.fn();

    useMutation
        .mockReturnValueOnce([
            setFreePaymentMethod,
            {
                loading: false
            }
        ])
        .mockReturnValueOnce([setBillingAddress]);

    useQuery.mockReturnValueOnce({
        data: {
            cart: {
                available_payment_methods: [{ code: 'free' }],
                prices: {
                    grand_total: {
                        value: 10
                    }
                },
                selected_payment_method: { code: 'free' },
                shipping_addresses: [
                    {
                        firstname: 'I',
                        lastname: 'love',
                        street: ['graphql'],
                        city: 'it',
                        region: {
                            code: 'is'
                        },
                        postcode: 90210,
                        country: {
                            code: 'great'
                        },
                        telephone: 1234567890
                    }
                ]
            }
        },
        loading: false
    });

    createTestInstance(<Component {...defaultTalonProps} />);

    expect(setBillingAddress).toHaveBeenCalled();
});

test('calls onSave if free is selected and available and shouldSubmit is true', () => {
    useQuery.mockReturnValueOnce({
        data: {
            cart: {
                available_payment_methods: [{ code: 'free' }],
                selected_payment_method: { code: 'free' },
                shipping_addresses: {}
            }
        },
        loading: false
    });

    const newProps = {
        ...defaultTalonProps,
        shouldSubmit: true
    };

    createTestInstance(<Component {...newProps} />);

    expect(defaultTalonProps.onSave).toHaveBeenCalled();
});
