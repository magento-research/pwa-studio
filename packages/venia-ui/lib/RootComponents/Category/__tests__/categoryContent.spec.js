import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useCategoryContent } from '@magento/peregrine/lib/talons/RootComponents/Category';
import CategoryContent from '../categoryContent';

jest.mock('@magento/venia-ui/lib/classify');
jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {};
    const api = {
        toggleDrawer: jest.fn()
    };
    const useAppContext = jest.fn(() => [state, api]);
    return { useAppContext };
});

jest.mock('../../../components/Head', () => ({
    HeadProvider: ({ children }) => <div>{children}</div>,
    StoreTitle: () => 'Title'
}));

jest.mock('@magento/peregrine/lib/talons/RootComponents/Category', () => ({
    useCategoryContent: jest.fn()
}));

jest.mock('../../../components/Breadcrumbs', () => 'Breadcrumbs');
jest.mock('../../../components/Gallery', () => ({
    __esModule: true,
    default: 'Gallery',
    GalleryShimmer: 'GalleryShimmer'
}));
jest.mock('../../../components/Pagination', () => 'Pagination');
jest.mock('../../../components/Shimmer', () => 'Shimmer');
jest.mock('../../../components/ProductSort', () => ({
    __esModule: true,
    default: 'ProductSort',
    ProductSortShimmer: 'ProductSortShimmer'
}));
jest.mock('../../../components/SortedByContainer', () => ({
    __esModule: true,
    default: 'SortedByContainer',
    SortedByContainerShimmer: 'SortedByContainerShimmer'
}));
jest.mock('../../../components/FilterModalOpenButton', () => ({
    __esModule: true,
    default: 'FilterModalOpenButton',
    FilterModalOpenButtonShimmer: 'FilterModalOpenButtonShimmer'
}));
jest.mock('../../../components/FilterSidebar', () => ({
    __esModule: true,
    default: 'FilterSidebar',
    FilterSidebarShimmer: 'FilterSidebarShimmer'
}));
jest.mock('../NoProductsFound', () => 'NoProductsFound');

const defaultProps = {
    categoryId: 42,
    data: {
        products: {
            items: {
                id: 1
            }
        }
    },
    isLoading: false,
    pageControl: {},
    sortProps: [
        { sortDirection: '', sortAttribute: '', sortText: '' },
        jest.fn()
    ],
    pageSize: 6
};

const talonProps = {
    categoryName: 'Name',
    categoryDescription: 'test',
    filters: {},
    items: {
        id: 1
    },
    totalPagesFromData: 1
};

test('renders the correct tree', () => {
    useCategoryContent.mockReturnValueOnce(talonProps);
    const instance = createTestInstance(<CategoryContent {...defaultProps} />);

    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders empty page', () => {
    const props = {
        ...defaultProps,
        products: {
            items: null
        }
    };
    useCategoryContent.mockReturnValueOnce({
        ...talonProps,
        categoryName: 'Empty Name',
        totalPagesFromData: 0
    });
    const instance = createTestInstance(<CategoryContent {...props} />);

    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders loading indicator if no data and loading', () => {
    const props = {
        ...defaultProps,
        isLoading: true
    };
    useCategoryContent.mockReturnValueOnce({
        ...talonProps,
        totalPagesFromData: 0
    });
    const instance = createTestInstance(<CategoryContent {...props} />);

    expect(instance.toJSON()).toMatchSnapshot();
});

describe('filter button/modal', () => {
    test('does not render if there are no filters', () => {
        useCategoryContent.mockReturnValueOnce({
            ...talonProps,
            filters: []
        });
        const tree = createTestInstance(<CategoryContent {...defaultProps} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('renders when there are filters', () => {
        useCategoryContent.mockReturnValueOnce({
            ...talonProps,
            filters: [{}]
        });
        const tree = createTestInstance(<CategoryContent {...defaultProps} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });
});

describe('sort button/container', () => {
    test('does not render if there are no products', () => {
        useCategoryContent.mockReturnValueOnce({
            ...talonProps,
            totalPagesFromData: 0
        });
        const tree = createTestInstance(<CategoryContent {...defaultProps} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('renders when there are products', () => {
        useCategoryContent.mockReturnValueOnce({
            ...talonProps,
            totalPagesFromData: 1
        });
        const tree = createTestInstance(<CategoryContent {...defaultProps} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });
});
