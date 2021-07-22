import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { mockShimmer } from '../../Shimmer';
import ShimmerComponent from '../sortedByContainer.shimmer';

jest.mock('../../Shimmer', () => {
    const mockedShimmer = jest.fn(() => null);

    return {
        __esModule: true,
        default: mockedShimmer,
        mockShimmer: mockedShimmer
    };
});

jest.mock('../../../classify');

let passedProps = {};

const givenDefaultProps = () => {
    passedProps = {};
};

describe('#sortedByContainer Shimmer', () => {
    beforeEach(() => {
        mockShimmer.mockClear();

        givenDefaultProps();
    });

    test('renders Shimmer component', () => {
        createTestInstance(<ShimmerComponent {...passedProps} />);

        expect(mockShimmer).toHaveBeenCalled();
    });
});
