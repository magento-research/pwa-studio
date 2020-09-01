import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useCategoryTile } from '../useCategoryTile';

const props = {
    categoryUrlSuffix: '.html',
    item: {
        productImagePreview: {
            items: [
                {
                    id: 1,
                    small_image: '/pub/media/1.png'
                },
                {
                    id: 2,
                    small_image: '/pub/media/2.png'
                }
            ]
        },
        name: 'Tiki',
        url_key: 'tiki',
        image: '/pub/media/1-large.png'
    }
};

const log = jest.fn();

const Component = props => {
    const talonProps = useCategoryTile(props);
    log(talonProps);

    return <i />;
};

test('returns the correct shape', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const talonProps = log.mock.calls[0][0];
    const expectedProperties = ['image', 'item'];
    const actualProperties = Object.keys(talonProps);
    expect(actualProperties.sort()).toEqual(expectedProperties.sort());
});
