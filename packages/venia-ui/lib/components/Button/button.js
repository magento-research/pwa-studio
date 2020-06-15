import React, { useLayoutEffect, useRef } from 'react';
import { oneOf, shape, string, bool } from 'prop-types';

import { mergeClasses } from '../../classify';
import defaultClasses from './button.css';

const getRootClassName = (priority, negative) =>
    `root_${priority}Priority${negative ? 'Negative' : ''}`;

/**
 * A component for buttons.
 *
 * @typedef Button
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a single button.
 */
const Button = props => {
    const {
        children,
        classes: propClasses,
        priority,
        type,
        negative,
        ...restProps
    } = props;
    const classes = mergeClasses(defaultClasses, propClasses);
    const rootClassName = classes[getRootClassName(priority, negative)];
    const ref = useRef();

    useLayoutEffect(() => {
        const { current } = ref;

        current.style.setProperty('--height', current.offsetHeight);
    });

    return (
        <button className={rootClassName} ref={ref} type={type} {...restProps}>
            <span className={classes.content}>{children}</span>
        </button>
    );
};

/**
 * Props for {@link Button}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the
 * Button component.
 * @property {string} classes.content classes for the button content
 * @property {string} classes.root classes for root container
 * @property {string} classes.root_highPriority classes for Button if
 * high priority.
 * @property {string} classes.root_lowPriority classes for Button if
 * low priority.
 * @property {string} classes.root_normalPriority classes for Button if
 * normal priority.
 * @property {string} priority the priority/importance of the Button
 * @property {string} type the type of the Button
 */
Button.propTypes = {
    classes: shape({
        content: string,
        root: string,
        root_highPriority: string,
        root_lowPriority: string,
        root_normalPriority: string
    }),
    priority: oneOf(['high', 'low', 'normal']).isRequired,
    type: oneOf(['button', 'reset', 'submit']).isRequired,
    negative: bool
};

Button.defaultProps = {
    priority: 'normal',
    type: 'button',
    negative: false
};

export default Button;
