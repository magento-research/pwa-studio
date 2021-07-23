import React from 'react';
import { act } from 'react-test-renderer';
import { Form } from 'informed';
import { createTestInstance, useToasts } from '@magento/peregrine';
import LoadingIndicator from '../../LoadingIndicator';
import Newsletter from '../newsletter';
import { useMutation } from '@apollo/client';
import { useNewsletter } from '@magento/peregrine/lib/talons/Newsletter/useNewsletter';

jest.mock('@apollo/client', () => ({
    gql: jest.fn(),
    useApolloClient: jest.fn().mockImplementation(() => {}),
    useMutation: jest.fn().mockImplementation(() => [
        jest.fn(),
        {
            error: null
        }
    ])
}));
jest.mock('../../../classify');
jest.mock('../../Button', () => () => <i />);
jest.mock('../../FormError/formError', () => 'FormError');
jest.mock('../../LoadingIndicator', () => () => <i />);

jest.mock('@magento/peregrine', () => {
    const actual = jest.requireActual('@magento/peregrine');
    const useToasts = jest.fn().mockReturnValue([{}, { addToast: jest.fn() }]);
    return {
        createTestInstance: actual.createTestInstance,
        useToasts
    };
});
jest.mock('@magento/peregrine/lib/talons/Newsletter/useNewsletter', () => {
    return {
        useNewsletter: jest.fn()
    };
});
jest.mock('@magento/peregrine/lib/hooks/useAwaitQuery', () => {
    const useAwaitQuery = jest
        .fn()
        .mockResolvedValue({ data: { subscribeEmailToNewsletter: {} } });

    return { useAwaitQuery };
});
const mockHandleSubmit = jest.fn();
const talonProps = {
    errors: [],
    handleSubmit: mockHandleSubmit,
    isBusy: false,
    setFormApi: jest.fn()
};
const props = {};

describe('Newsletter', () => {
    test('renders correctly', () => {
        useNewsletter.mockReturnValueOnce(talonProps);
        const component = createTestInstance(<Newsletter {...props} />);
        expect(component.toJSON()).toMatchSnapshot();
    });

    test('calls `handleSubmit` on submit', () => {
        useNewsletter.mockReturnValueOnce(talonProps);
        useMutation.mockReturnValueOnce([mockHandleSubmit, {}]);
        const values = { email: 'a' };
        const { root } = createTestInstance(<Newsletter {...props} />);

        act(() => {
            root.findByType(Form).props.onSubmit(values);
        });

        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
        expect(mockHandleSubmit).toHaveBeenNthCalledWith(1, {
            email: values.email
        });
    });

    test('renders the loading indicator when form is submitting', () => {
        useNewsletter.mockReturnValueOnce({
            ...talonProps,
            isBusy: true
        });
        const { root } = createTestInstance(<Newsletter {...props} />);
        act(() => {
            expect(root.findByType(LoadingIndicator)).toBeTruthy();
        });
    });

    test('displays an error message if the email already subscribed', () => {
        useMutation.mockReturnValueOnce([
            jest.fn(),
            {
                error: {
                    graphQLErrors: [
                        {
                            message: 'This email address is already subscribed.'
                        }
                    ]
                }
            }
        ]);

        useNewsletter.mockReturnValueOnce({
            ...talonProps,
            errors: ['This email address is already subscribed.']
        });
        const component = createTestInstance(<Newsletter {...props} />);
        expect(component.toJSON()).toMatchSnapshot();
    });

    test('throws a toast if there is response', () => {
        useNewsletter.mockReturnValueOnce({
            ...talonProps,
            newsLetterResponse: { status: 'SUBSCRIBED' }
        });
        const [, { addToast }] = useToasts();
        createTestInstance(<Newsletter {...props} />);
        expect(addToast).toHaveBeenCalled();
    });
});
