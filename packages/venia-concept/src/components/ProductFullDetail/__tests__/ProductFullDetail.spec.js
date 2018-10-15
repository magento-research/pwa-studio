import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProductFullDetail from '../ProductFullDetail';
import { mockStockData, productWithThreeOptions } from '../mockData';

configure({ adapter: new Adapter() });

jest.mock('src/components/MiniCart', () => {});

const classes = {
    edit: 'a'
};

test('shows `out of stock` message when current configuration is unavailable.', async () => {
    const product = mockStockData.data.productDetail.items[0];
    const mock = jest.fn;
    let wrapper = shallow(
        <ProductFullDetail
            product={product}
            addItemToCart={mock}
            addConfigurableItemToCart={mock}
            classes={classes}
        />
    ).dive();
    const firstOption = {
        size: wrapper.instance().props.product.configurable_options[0].values[1]
    };
    const secondaryOption = {
        color: wrapper.instance().props.product.configurable_options[1]
            .values[1]
    };
    wrapper.instance().onOptionChange(firstOption);
    wrapper.instance().onOptionChange(secondaryOption);
    const stockMessage = wrapper.instance().state.stockMessage;
    expect(!!stockMessage).toBe(false);
});

test('getCurrentConfiguration returns correct SKU', async () => {
    const product = productWithThreeOptions.data.productDetail.items[0];
    const newState = {};
    product.configurable_options.forEach(option => {
        newState[option.attribute_code] = {
            label: option.values[0].label,
            value_index: option.values[0].value_index
        };
    });
    const mock = jest.fn;
    let wrapper = shallow(
        <ProductFullDetail
            product={product}
            addItemToCart={mock}
            addConfigurableItemToCart={mock}
            classes={classes}
        />
    ).dive();
    const currentConfiguration = wrapper
        .instance()
        .getCurrentConfiguration(product, newState);
    expect(currentConfiguration.sku).toBe('MJ01-XS-Orange-Short');
});
