import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { mockShimmer } from '../breadcrumbs.shimmer';
import { useBreadcrumbs } from '@magento/peregrine/lib/talons/Breadcrumbs/useBreadcrumbs';

import Breadcrumbs from '../breadcrumbs';

jest.mock('react-router-dom', () => ({
    Link: ({ children }) => children
}));
jest.mock('@magento/peregrine/lib/util/makeUrl', () =>
    jest.fn(url => `${url}.html`)
);
jest.mock('../../../classify');
jest.mock('@magento/peregrine/lib/talons/Breadcrumbs/useBreadcrumbs');

jest.mock('../breadcrumbs.shimmer', () => {
    const mockedShimmer = jest.fn(() => null);

    return {
        __esModule: true,
        default: mockedShimmer,
        mockShimmer: mockedShimmer
    };
});

const defaultProps = {
    categoryId: 'category1'
};
test('renders the breadcrumb shimmer if breadcrumbs are loading', () => {
    useBreadcrumbs.mockReturnValueOnce({
        isLoading: true,
        normalizedData: []
    });

    const instance = createTestInstance(<Breadcrumbs {...defaultProps} />);
    expect(mockShimmer).toHaveBeenCalled();
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders an empty div if there was an error fetching breadcrumbs', () => {
    useBreadcrumbs.mockReturnValueOnce({
        hasError: true,
        normalizedData: []
    });

    const instance = createTestInstance(<Breadcrumbs {...defaultProps} />);
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders breadcrumbs for a product view', () => {
    const props = {
        ...defaultProps,
        currentProduct: 'ACME Product'
    };

    useBreadcrumbs.mockReturnValueOnce({
        currentCategory: 'ACME Category',
        currentCategoryPath: '/acmeCategory',
        normalizedData: []
    });

    const instance = createTestInstance(<Breadcrumbs {...props} />);
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders breadcrumbs for a category view', () => {
    useBreadcrumbs.mockReturnValueOnce({
        currentCategory: 'ACME Category',
        currentCategoryPath: '/acmeCategory',
        normalizedData: []
    });

    const instance = createTestInstance(<Breadcrumbs {...defaultProps} />);
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders breadcrumbs for intermediate links', () => {
    useBreadcrumbs.mockReturnValueOnce({
        currentCategory: 'ACME Category',
        currentCategoryPath: '/acmeCategory',
        normalizedData: [
            {
                text: 'Intermediate Category',
                path: 'intermediateCategory'
            }
        ]
    });

    const instance = createTestInstance(<Breadcrumbs {...defaultProps} />);
    expect(instance.toJSON()).toMatchSnapshot();
});
