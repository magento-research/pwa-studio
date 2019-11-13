import React, { Fragment, Suspense, useCallback, useState } from 'react';
import { shape, string } from 'prop-types';

import { useAppContext } from '@magento/peregrine/lib/context/app';

import { mergeClasses } from '../../classify';
import { Title } from '../../components/Head';
import Breadcrumbs from '../../components/Breadcrumbs';
import Gallery from '../../components/Gallery';
import Pagination from '../../components/Pagination';
import defaultClasses from './category.css';

const FilterModal = React.lazy(() => import('../../components/FilterModal'));

// TODO: This can be replaced by the value from `storeConfig when the PR,
// https://github.com/magento/graphql-ce/pull/650, is released.
const pageSize = 6;
const placeholderItems = Array.from({ length: pageSize }).fill(null);

const CategoryContent = props => {
    const { data, pageControl } = props;

    const [, { toggleDrawer }] = useAppContext();
    const [loadFilters, setLoadFilters] = useState(false);

    const handleOpenFilters = useCallback(() => {
        setLoadFilters(true);
        toggleDrawer('filter');
    }, [setLoadFilters, toggleDrawer]);

    const handleLoadFilters = useCallback(() => {
        setLoadFilters(true);
    }, [setLoadFilters]);

    const classes = mergeClasses(defaultClasses, props.classes);
    const filters = data ? data.products.filters : null;
    const items = data ? data.products.items : placeholderItems;
    const title = data ? data.category.name : null;
    const categoryId = data ? data.category.id : null;
    const titleContent = title ? `${title} - Venia` : 'Venia';

    const header = filters ? (
        <div className={classes.headerButtons}>
            <button
                className={classes.filterButton}
                onClick={handleOpenFilters}
                onFocus={handleLoadFilters}
                onMouseOver={handleLoadFilters}
                type="button"
            >
                {'Filter'}
            </button>
        </div>
    ) : null;

    const modal =
        filters && loadFilters ? <FilterModal filters={filters} /> : null;

    return (
        <Fragment>
            <Breadcrumbs categoryId={categoryId} />
            <Title>{titleContent}</Title>
            <article className={classes.root}>
                <h1 className={classes.title}>
                    <div className={classes.categoryTitle}>{title}</div>
                </h1>
                {header}
                <section className={classes.gallery}>
                    <Gallery items={items} />
                </section>
                <div className={classes.pagination}>
                    <Pagination pageControl={pageControl} />
                </div>
                <Suspense fallback={null}>{modal}</Suspense>
            </article>
        </Fragment>
    );
};

export default CategoryContent;

CategoryContent.propTypes = {
    classes: shape({
        filterContainer: string,
        gallery: string,
        headerButtons: string,
        pagination: string,
        root: string,
        title: string
    })
};
