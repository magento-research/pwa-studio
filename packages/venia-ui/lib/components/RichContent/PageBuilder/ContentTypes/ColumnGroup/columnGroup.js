import React from 'react';
import defaultClasses from './columnGroup.css';
import { mergeClasses } from '../../../../../classify';
import { shape, string } from 'prop-types';

const ColumnGroup = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { display, children } = props;
    const dynamicStyles = {
        display
    };

    return (
        <div style={dynamicStyles} className={classes.pagebuilderColumnGroup}>
            {children}
        </div>
    );
};

ColumnGroup.propTypes = {
    classes: shape({
        pagebuilderColumnGroup: string
    }),
    display: string
};

export default ColumnGroup;
