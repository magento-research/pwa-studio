import React from 'react';
import { shape, string } from 'prop-types';
import { useStyle } from '../../classify';

import Shimmer from '../Shimmer';
import defaultClasses from './breadcrumbs.css';

const BreadcrumbsShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <Shimmer width={5} />
        </div>
    );
};

BreadcrumbsShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default BreadcrumbsShimmer;
