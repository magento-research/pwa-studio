import React from 'react';
import { shape, string } from 'prop-types';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { useStyle } from '../../classify';

import Shimmer from '../Shimmer';
import Image from '../Image';
import defaultClasses from './item.css';

const GalleryItemShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <Shimmer>
                <Image
                    alt="Placeholder for gallery item image"
                    classes={{
                        image: classes.image,
                        root: classes.imageContainer
                    }}
                    src={transparentPlaceholder}
                />
            </Shimmer>
            <Shimmer width="100%" />
            <Shimmer width={3} />
        </div>
    );
};

GalleryItemShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default GalleryItemShimmer;
