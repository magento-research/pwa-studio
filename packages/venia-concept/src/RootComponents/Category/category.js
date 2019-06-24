import React, { useEffect, useMemo, useState } from 'react';
import { number, shape, string } from 'prop-types';
import { usePagination, useQuery } from '@magento/peregrine';

import { toggleDrawer } from 'src/actions/app';
import catalogActions from 'src/actions/catalog';
import { mergeClasses } from 'src/classify';

import { fullPageLoadingIndicator } from 'src/components/LoadingIndicator';
import { connect, withRouter } from 'src/drivers';
import { compose } from 'redux';
import categoryQuery from 'src/queries/getCategory.graphql';
import isObjectEmpty from 'src/util/isObjectEmpty';
import { getFilterParams } from 'src/util/getFilterParamsFromUrl';
import CategoryContent from './categoryContent';
import defaultClasses from './category.css';
import getQueryParameterValue from 'src/util/getQueryParameterValue';

const Category = props => {
    const { filterClear, id, location, openDrawer, pageSize } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    // Check the query param for the initial page to provide to the pagination
    // hook. Without this we may load `page=4` but `usePagination` will init to
    // 1, so it'll fetch page 1 _and_ page 4 (bad!).
    const initialPage = useMemo(
        () =>
            Math.max(
                1,
                Math.floor(
                    ~~getQueryParameterValue({
                        location,
                        queryParameter: 'page'
                    })
                )
            ),
        [location]
    );

    const [paginationValues, paginationApi] = usePagination(initialPage);
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        updateTotalPages: setTotalPages,
        totalPages
    };

    const [queryResult, queryApi] = useQuery(categoryQuery);
    const { data, error, loading } = queryResult;
    const { runQuery, setLoading } = queryApi;

    // clear any stale filters
    useEffect(() => {
        if (isObjectEmpty(getFilterParams())) {
            filterClear();
        }
    }, [filterClear]);

    // run the category query
    useEffect(() => {
        setLoading(true);
        runQuery({
            variables: {
                currentPage: Number(currentPage),
                id: Number(id),
                idString: String(id),
                onServer: false,
                pageSize: Number(pageSize)
            }
        });

        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, [currentPage, id, pageSize, runQuery, setLoading]);

    const totalPagesFromData = data
        ? data.products.page_info.total_pages
        : null;

    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPagesFromData]);

    // Retry 3 times and then display the fallback error.
    const [errorCount, setErrorCount] = useState(0);
    if (error && errorCount <= 3) {
        setCurrentPage(1);
        setErrorCount(errorCount + 1);
    } else if (error) {
        return <div>Data Fetch Error</div>;
    }

    // show loading indicator until data has been fetched
    // and pagination state has been updated
    if (!totalPages) return fullPageLoadingIndicator;

    return (
        <CategoryContent
            classes={classes}
            data={loading ? null : data}
            filterClear={filterClear}
            openDrawer={openDrawer}
            pageControl={pageControl}
        />
    );
};

Category.propTypes = {
    classes: shape({
        gallery: string,
        root: string,
        title: string
    }),
    id: number,
    pageSize: number
};

Category.defaultProps = {
    id: 3,
    pageSize: 6
};

const mapDispatchToProps = dispatch => ({
    filterClear: () => dispatch(catalogActions.filterOption.clear()),
    openDrawer: () => dispatch(toggleDrawer('filter'))
});

export default compose(
    withRouter,
    connect(
        null,
        mapDispatchToProps
    )
)(Category);
