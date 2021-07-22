import React, { useMemo } from 'react';
import { node, number, oneOf, oneOfType, shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import defaultClasses from './shimmer.css';

const Shimmer = props => {
    const {
        borderRadius,
        height,
        width,
        style: customStyles,
        type,
        children,
        ...restProps
    } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const style = useMemo(() => {
        const combinedStyles = {
            ...customStyles
        };

        Object.entries({ borderRadius, height, width }).forEach(
            ([type, value]) => {
                if (typeof value !== 'undefined') {
                    combinedStyles[type] =
                        typeof value === 'number' ? `${value}rem` : value;
                }
            }
        );

        return combinedStyles;
    }, [customStyles, borderRadius, height, width]);

    const rootClass = `root_${type}`;

    return (
        <div className={classes[rootClass]} style={style} {...restProps}>
            <span className={classes.content}>{children}</span>
        </div>
    );
};

/**
 * Props for {@link Shimmer}
 *
 * @typedef props
 *
 * @property {Object} classes is an object containing the class names for the
 * Shimmer component.
 * @property {string} classes.root is the class for the container
 * @property {string} classes.content is the class for the content
 * @property {number | string} borderRadius is the border radius of the Shimmer
 * @property {number | string} height is the height of the Shimmer
 * @property {number | string} width is the width of the Shimmer
 * @property {Object} style is an object of inline styles
 * @property {string} type is the type of the Shimmer
 * @property {node} children are the children of the Shimmer
 */
Shimmer.propTypes = {
    classes: shape({
        root: string,
        content: string
    }),
    borderRadius: oneOfType([number, string]),
    height: oneOfType([number, string]),
    width: oneOfType([number, string]),
    style: shape({}),
    type: oneOf([
        'rectangle',
        'button',
        'checkbox',
        'radio',
        'textArea',
        'textInput'
    ]),
    children: node
};

Shimmer.defaultProps = {
    style: {},
    type: 'rectangle'
};

export default Shimmer;
