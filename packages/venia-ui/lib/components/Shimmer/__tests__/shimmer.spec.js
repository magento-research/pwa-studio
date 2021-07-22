import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Shimmer from '../shimmer';

jest.mock('../../../classify');
jest.mock('../../Button', () => () => <i />);

let inputProps = {};

const givenDefaultValues = () => {
    inputProps = {
        width: '100%'
    };
};

const givenWidth = () => {
    inputProps = {
        width: 200
    };
};

const givenHeight = () => {
    inputProps = {
        height: '200px'
    };
};

const givenButtonType = () => {
    inputProps = {
        type: 'button'
    };
};

const Component = () => {
    return <Shimmer {...inputProps} />;
};

describe('#Shimmer', () => {
    beforeEach(() => {
        givenDefaultValues();
    });

    it('renders default size', () => {
        const instance = createTestInstance(<Component />);

        expect(instance.toJSON()).toMatchSnapshot();
    });

    it('renders rectangle of given width', () => {
        givenWidth();
        const { root } = createTestInstance(<Component />);

        const styles = root.children[0].children[0].props.style;
        expect(styles).toHaveProperty('width', '200rem');
    });

    it('renders rectangle of given height', () => {
        givenHeight();
        const { root } = createTestInstance(<Component />);

        const styles = root.children[0].children[0].props.style;
        expect(styles).toHaveProperty('height', '200px');
    });

    it('renders Shimmer of given button type', () => {
        givenButtonType();
        const { root } = createTestInstance(<Component />);

        expect(root.children[0].children[0].props.className).toContain(
            '_button'
        );
    });
});
