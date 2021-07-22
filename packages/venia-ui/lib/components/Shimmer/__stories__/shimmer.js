import React from 'react';
import { storiesOf } from '@storybook/react';

import Shimmer from '../shimmer';
import Image from '../../Image';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';

const stories = storiesOf('Components/Shimmer', module);

stories.add('Default', () => <Shimmer width="100%" />);

stories.add('Multiple Shimmer with different widths', () => {
    return (
        <div style={{ display: 'grid', gridGap: '0.5rem' }}>
            <Shimmer width="100%" />
            <Shimmer width="50%" />
            <Shimmer width="25%" />
        </div>
    );
});

stories.add('A Shimmer of an Image Component', () => {
    return (
        <Shimmer>
            <Image
                alt="Image Shimmer"
                src={transparentPlaceholder}
                width={200}
            />
        </Shimmer>
    );
});

stories.add('A Shimmer with fixed dimensions and border radius', () => {
    return <Shimmer borderRadius={3} height={3} width={3} />;
});

stories.add('A Shimmer of type button', () => <Shimmer type="button" />);

stories.add('A Shimmer of type textInput', () => <Shimmer type="textInput" />);

stories.add('A Shimmer of type textArea', () => <Shimmer type="textArea" />);

stories.add('A Shimmer of type radio', () => (
    <Shimmer animationSize="small" type="radio" />
));

stories.add('A Shimmer of type checkbox', () => (
    <Shimmer animationSize="small" type="checkbox" />
));

const loremContentText =
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias consectetur delectus enim est, excepturi fuga, in ipsam molestiae necessitatibus non nostrum quam rerum sequi voluptatem. Nemo neque perferendis quaerat.';
const buttonContentText = 'Flexible Shimmer Button with content';

stories.add('Multiple Shimmer with different types and content', () => {
    return (
        <div style={{ display: 'grid', gridGap: '0.5rem' }}>
            <Shimmer>
                <p>{loremContentText}</p>
            </Shimmer>
            <Shimmer width="25%" />
            <Shimmer width="50%" />
            <div style={{ display: 'flex' }}>
                <Shimmer style={{ marginRight: '0.5rem' }} type="button">
                    {buttonContentText}
                </Shimmer>
                <Shimmer type="button" />
            </div>
        </div>
    );
});
