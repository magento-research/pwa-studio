import React from 'react';
import { shape, string } from 'prop-types';
import { useStyle } from '../../classify';

import Shimmer from '../Shimmer';
import defaultClasses from './productSort.shimmer.css';

const ProductSortShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <Shimmer
                classes={{ root_button: classes.sortButtonShimmer }}
                type="button"
            />
        </div>
    );
};

ProductSortShimmer.propTypes = {
    classes: shape({
        root: string,
        sortButtonShimmer: string
    })
};

export default ProductSortShimmer;
