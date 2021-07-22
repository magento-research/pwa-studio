import React from 'react';
import { shape, string, array, object } from 'prop-types';
import { useStyle } from '../../classify';

import GalleryItemShimmer from './item.shimmer';
import defaultClasses from './gallery.css';

const GalleryShimmer = props => {
    const { items, itemProps } = props;
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <div className={classes.items}>
                {items.map((item, index) => (
                    <GalleryItemShimmer key={index} {...itemProps} />
                ))}
            </div>
        </div>
    );
};

GalleryShimmer.defaultProps = {
    items: [],
    itemProps: {}
};

GalleryShimmer.propTypes = {
    classes: shape({
        root: string,
        items: string
    }),
    items: array,
    itemProps: shape({
        classes: object
    })
};

export default GalleryShimmer;
