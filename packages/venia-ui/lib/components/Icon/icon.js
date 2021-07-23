import React from 'react';
import { elementType, number, shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import defaultClasses from './icon.css';

const Icon = props => {
    // destructure `propClasses` to exclude it from `restProps`
    const {
        attrs,
        classes: propClasses,
        size,
        src: Component,
        ...restProps
    } = props;
    const { width, ...restAttrs } = attrs || {};
    const classes = useStyle(defaultClasses, propClasses);

    return (
        <span className={classes.root} {...restProps}>
            <Component
                className={classes.icon}
                size={size || width}
                {...restAttrs}
            />
        </span>
    );
};

export default Icon;

Icon.propTypes = {
    attrs: shape({}),
    classes: shape({
        icon: string,
        root: string
    }),
    size: number,
    src: elementType.isRequired
};
