import React from 'react';
import { act } from 'react-test-renderer';
import { useQuery } from '@apollo/react-hooks';
import { useFieldApi, useFieldState } from 'informed';

import createTestInstance from '../../../util/createTestInstance';
import { useRegion } from '../useRegion';

jest.mock('informed', () => {
    const useFieldState = jest.fn().mockReturnValue({
        value: 'US'
    });
    const useFieldApi = jest.fn();

    return { useFieldApi, useFieldState };
});

jest.mock('@apollo/react-hooks', () => ({
    useQuery: jest.fn().mockReturnValue({
        data: {
            country: {
                available_regions: [
                    { code: 'NY', id: 1, name: 'New York' },
                    { code: 'TX', id: 2, name: 'Texas' }
                ]
            }
        },
        error: false,
        loading: false
    })
}));

const Component = props => {
    const talonProps = useRegion(props);
    return <i talonProps={talonProps} />;
};

const props = {
    queries: {}
};

test('returns formatted regions', () => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('returns formatted regions with id as the key', () => {
    const tree = createTestInstance(
        <Component {...props} optionValueKey={'id'} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('returns empty array if no available regions', () => {
    useQuery.mockReturnValueOnce({
        data: {
            country: {
                available_regions: null
            }
        },
        error: false,
        loading: false
    });

    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('resets value on country change', () => {
    const mockSetValue = jest.fn();

    useFieldState.mockReturnValueOnce({ value: 'FR' });
    useFieldApi.mockReturnValue({ setValue: mockSetValue });

    const tree = createTestInstance(<Component {...props} />);

    expect(mockSetValue).not.toHaveBeenCalled();

    act(() => {
        tree.update(<Component {...props} />);
    });

    expect(mockSetValue).toHaveBeenCalledWith();
});
