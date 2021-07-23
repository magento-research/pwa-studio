import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useFormError } from '@magento/peregrine/lib/talons/FormError/useFormError';

import FormError from '../formError';

jest.mock('@magento/peregrine/lib/talons/FormError/useFormError');
jest.mock('../../../classify');

jest.mock('react-intl', () => ({
    useIntl: jest.fn().mockReturnValue({
        formatMessage: jest.fn().mockImplementation(options => options.id)
    })
}));

test('renders null without errors', () => {
    useFormError.mockReturnValueOnce({ errorMessage: null });

    const tree = createTestInstance(<FormError />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders error message - no scroll', () => {
    useFormError.mockReturnValueOnce({
        errorMessage: "This is not the error you're looking for."
    });

    const tree = createTestInstance(<FormError scrollOnError={false} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
