import React, { Fragment, Suspense, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { array, number, shape, string } from 'prop-types';
import { useCategoryContent } from '@magento/peregrine/lib/talons/RootComponents/Category';

import { useStyle } from '../../classify';
import Breadcrumbs from '../../components/Breadcrumbs';
import FilterModalOpenButton, {
    FilterModalOpenButtonShimmer
} from '../../components/FilterModalOpenButton';
import { FilterSidebarShimmer } from '../../components/FilterSidebar';
import Gallery, { GalleryShimmer } from '../../components/Gallery';
import { StoreTitle } from '../../components/Head';
import Pagination from '../../components/Pagination';
import ProductSort, { ProductSortShimmer } from '../../components/ProductSort';
import RichContent from '../../components/RichContent';
import Shimmer from '../../components/Shimmer';
import SortedByContainer, {
    SortedByContainerShimmer
} from '../../components/SortedByContainer';
import defaultClasses from './category.css';
import NoProductsFound from './NoProductsFound';

const FilterModal = React.lazy(() => import('../../components/FilterModal'));
const FilterSidebar = React.lazy(() =>
    import('../../components/FilterSidebar')
);

const CategoryContent = props => {
    const {
        categoryId,
        data,
        isLoading,
        pageControl,
        sortProps,
        pageSize
    } = props;
    const [currentSort] = sortProps;

    const talonProps = useCategoryContent({
        categoryId,
        data,
        pageSize
    });

    const {
        categoryName,
        categoryDescription,
        filters,
        items,
        totalCount,
        totalPagesFromData
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const shouldShowFilterButtons = filters && filters.length;
    const shouldShowFilterShimmer = filters === null;

    // If there are no products we can hide the sort button.
    const shouldShowSortButtons = totalPagesFromData;
    const shouldShowSortShimmer = !totalPagesFromData && isLoading;

    const maybeFilterButtons = shouldShowFilterButtons ? (
        <FilterModalOpenButton filters={filters} />
    ) : shouldShowFilterShimmer ? (
        <FilterModalOpenButtonShimmer />
    ) : null;

    const filtersModal = shouldShowFilterButtons ? (
        <FilterModal filters={filters} />
    ) : null;

    const sidebar = shouldShowFilterButtons ? (
        <FilterSidebar filters={filters} />
    ) : shouldShowFilterShimmer ? (
        <FilterSidebarShimmer />
    ) : null;

    const maybeSortButton = shouldShowSortButtons ? (
        <ProductSort sortProps={sortProps} />
    ) : shouldShowSortShimmer ? (
        <ProductSortShimmer />
    ) : null;

    const maybeSortContainer = shouldShowSortButtons ? (
        <SortedByContainer currentSort={currentSort} />
    ) : shouldShowSortShimmer ? (
        <SortedByContainerShimmer />
    ) : null;

    const categoryResultsHeading =
        totalCount > 0 ? (
            <FormattedMessage
                id={'categoryContent.resultCount'}
                values={{
                    count: totalCount
                }}
                defaultMessage={'{count} Results'}
            />
        ) : isLoading ? (
            <Shimmer width={5} />
        ) : null;

    const categoryDescriptionElement = categoryDescription ? (
        <RichContent html={categoryDescription} />
    ) : null;

    const content = useMemo(() => {
        if (!totalPagesFromData && !isLoading) {
            return <NoProductsFound categoryId={categoryId} />;
        }

        const gallery = totalPagesFromData ? (
            <Gallery items={items} />
        ) : (
            <GalleryShimmer items={items} />
        );

        const pagination = totalPagesFromData ? (
            <Pagination pageControl={pageControl} />
        ) : null;

        return (
            <Fragment>
                <section className={classes.gallery}>{gallery}</section>
                <div className={classes.pagination}>{pagination}</div>
            </Fragment>
        );
    }, [
        categoryId,
        classes.gallery,
        classes.pagination,
        isLoading,
        items,
        pageControl,
        totalPagesFromData
    ]);

    const categoryTitle = categoryName ? categoryName : <Shimmer width={5} />;

    return (
        <Fragment>
            <Breadcrumbs categoryId={categoryId} />
            <StoreTitle>{categoryName}</StoreTitle>
            <article className={classes.root}>
                <div className={classes.categoryHeader}>
                    <h1 className={classes.title}>
                        <div className={classes.categoryTitle}>
                            {categoryTitle}
                        </div>
                    </h1>
                    {categoryDescriptionElement}
                </div>
                <div className={classes.sidebar}>
                    <Suspense fallback={<FilterSidebarShimmer />}>
                        {sidebar}
                    </Suspense>
                </div>
                <div className={classes.categoryContent}>
                    <div className={classes.heading}>
                        <div className={classes.categoryInfo}>
                            {categoryResultsHeading}
                        </div>
                        <div className={classes.headerButtons}>
                            {maybeFilterButtons}
                            {maybeSortButton}
                        </div>
                        {maybeSortContainer}
                    </div>
                    {content}
                    <Suspense fallback={null}>{filtersModal}</Suspense>
                </div>
            </article>
        </Fragment>
    );
};

export default CategoryContent;

CategoryContent.propTypes = {
    classes: shape({
        filterContainer: string,
        sortContainer: string,
        gallery: string,
        headerButtons: string,
        filterButton: string,
        pagination: string,
        root: string,
        title: string
    }),
    // sortProps contains the following structure:
    // [{sortDirection: string, sortAttribute: string, sortText: string},
    // React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}]
    sortProps: array,
    pageSize: number
};
