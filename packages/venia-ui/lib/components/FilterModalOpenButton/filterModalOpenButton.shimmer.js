import React from 'react';
import { shape, string } from 'prop-types';
import { useStyle } from '../../classify';

import Shimmer from '../Shimmer';
import defaultClasses from './filterModalOpenButton.shimmer.css';

const FilterModalOpenButtonShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <Shimmer
            classes={{ root_button: classes.filterButtonShimmer }}
            type="button"
            aria-live="polite"
            aria-busy="true"
        />
    );
};

FilterModalOpenButtonShimmer.propTypes = {
    classes: shape({
        filterButtonShimmer: string
    })
};

export default FilterModalOpenButtonShimmer;
