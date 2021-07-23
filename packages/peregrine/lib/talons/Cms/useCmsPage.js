import { useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';

import mergeOperations from '../../util/shallowMerge';
import { useAppContext } from '../../context/app';

import DEFAULT_OPERATIONS from './cmsPage.gql';

/**
 * Retrieves data necessary to render a CMS Page
 *
 * @param {object} props
 * @param {object} props.id - CMS Page ID
 * @param {object} props.identifier - CMS Page Identifier
 * @param {object} props.queries - Collection of GraphQL queries
 * @param {object} props.queries.getCmsPage - Query for getting a CMS Page
 * @returns {{shouldShowLoadingIndicator: *, hasContent: *, cmsPage: *, error: *}}
 */
export const useCmsPage = props => {
    const { id, identifier } = props;

    const checkType = () => {
        if (typeof id === 'number') {
            return {
                boolId: true,
                boolIdentifier: false,
                id: Number(id)
            };
        } else {
            return {
                boolId: false,
                boolIdentifier: true,
                identifier: String(identifier)
            };
        }
    };

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCMSPageQuery } = operations;

    const { loading, error, data } = useQuery(getCMSPageQuery, {
        variables: checkType(),
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    // To prevent loading indicator from getting stuck, unset on unmount.
    useEffect(() => {
        return () => {
            setPageLoading(false);
        };
    }, [setPageLoading]);

    // Ensure we mark the page as loading while we check the network for updates
    useEffect(() => {
        setPageLoading(loading);
    }, [loading, setPageLoading]);

    const shouldShowLoadingIndicator = loading && !data;

    const checkPage = () => {
        if (data.hasOwnProperty('cmsPageId')) return data.cmsPageId;
        if (data.hasOwnProperty('cmsPageIdentifier'))
            return data.cmsPageIdentifier;
    };

    const cmsPage = data ? checkPage() : null;
    const rootCategoryId = data ? data.storeConfig.root_category_id : null;

    // Only render <RichContent /> if the page isn't empty and doesn't contain
    // the default CMS Page text. We do this so there is at least a useable home
    // page by default, the category list component.
    const hasContent = useMemo(() => {
        return (
            cmsPage &&
            cmsPage.content &&
            cmsPage.content.length > 0 &&
            !cmsPage.content.includes('CMS homepage content goes here.')
        );
    }, [cmsPage]);

    return {
        cmsPage,
        error,
        hasContent,
        rootCategoryId,
        shouldShowLoadingIndicator
    };
};
