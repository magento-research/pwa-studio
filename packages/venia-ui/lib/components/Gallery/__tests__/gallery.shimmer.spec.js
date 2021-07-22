import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { mockShimmer } from '../item.shimmer';
import ShimmerComponent from '../gallery.shimmer';

const mockItemClasses = {
    test: 'test-class'
};

const mockItems = Array.from({ length: 8 }).fill(null);

jest.mock('../item.shimmer', () => {
    const mockedShimmer = jest.fn(() => null);

    return {
        __esModule: true,
        default: mockedShimmer,
        mockShimmer: mockedShimmer
    };
});

jest.mock('../../../classify', () => ({
    useStyle: (...classes) => Object.assign({}, ...classes)
}));

let passedProps = {};

const givenDefaultProps = () => {
    passedProps = {};
};

const givenMultipleItems = () => {
    passedProps = {
        items: mockItems
    };
};

const givenClassesAndItems = () => {
    givenMultipleItems();

    passedProps = {
        ...passedProps,
        itemProps: {
            classes: mockItemClasses
        }
    };
};

describe('#Gallery Shimmer', () => {
    beforeEach(() => {
        mockShimmer.mockClear();

        givenDefaultProps();
    });

    test('renders Item Shimmer component for each item', () => {
        givenMultipleItems();
        createTestInstance(<ShimmerComponent {...passedProps} />);

        expect(mockItems.length).toBeGreaterThan(0);
        expect(mockShimmer).toHaveBeenCalledTimes(mockItems.length);
    });

    test('passes merged class to Shimmer component', () => {
        givenClassesAndItems();
        createTestInstance(<ShimmerComponent {...passedProps} />);

        expect(mockShimmer).toHaveBeenCalledWith(
            expect.objectContaining({
                classes: expect.objectContaining({ ...mockItemClasses })
            }),
            expect.any(Object)
        );
    });
});
