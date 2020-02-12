import React from 'react';
import { Form } from 'informed';
import { act } from 'react-test-renderer';
import { useLocation } from 'react-router-dom';
import { createTestInstance } from '@magento/peregrine';

import Trigger from '../../Trigger';
import SearchField from '../searchField';

jest.mock('../../../classify');
jest.mock('../../Trigger', () => () => null);
jest.mock('react-router-dom', () => ({
    useLocation: jest.fn()
}));

const onChange = jest.fn();
const onFocus = jest.fn();

useLocation.mockReturnValue({ pathname: '/' });

test('renders correctly', () => {
    const instance = createTestInstance(
        <Form initialValues={{ search_query: '' }}>
            <SearchField
                location={{ pathname: '/' }}
                onChange={onchange}
                onFocus={onFocus}
            />
        </Form>
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders no reset button if value is empty', () => {
    const { root } = createTestInstance(
        <Form initialValues={{ search_query: '' }}>
            <SearchField onChange={onChange} onFocus={onFocus} />
        </Form>
    );

    expect(root.findAllByType(Trigger)).toHaveLength(0);
});

test('renders a reset button', () => {
    let formApi;

    const { root } = createTestInstance(
        <Form
            getApi={api => {
                formApi = api;
            }}
        >
            <SearchField onChange={onChange} onFocus={onFocus} />
        </Form>
    );

    act(() => {
        formApi.setValue('search_query', 'a');
    });

    expect(root.findAllByType(Trigger)).toHaveLength(1);
});

test('reset button resets the form', () => {
    let formApi;

    const { root } = createTestInstance(
        <Form
            getApi={api => {
                formApi = api;
            }}
        >
            <SearchField onChange={onChange} onFocus={onFocus} />
        </Form>
    );

    act(() => {
        formApi.setValue('search_query', 'a');
    });

    const trigger = root.findByType(Trigger);
    const { action: resetForm } = trigger.props;

    act(() => {
        resetForm();
    });

    expect(formApi.getValue('search_query')).toBeUndefined();
});

test('sets value if location contains one', () => {
    let formApi;

    useLocation.mockReturnValueOnce({
        pathname: '/search.html',
        search: '?query=abc'
    });

    createTestInstance(
        <Form
            getApi={api => {
                formApi = api;
            }}
        >
            <SearchField
                location={location}
                onChange={onChange}
                onFocus={onFocus}
            />
        </Form>
    );

    expect(formApi.getValue('search_query')).toBe('abc');
});
