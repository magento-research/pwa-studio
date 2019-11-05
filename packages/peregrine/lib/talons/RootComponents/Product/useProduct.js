import { useEffect, useMemo } from 'react';
import { useApolloClient, useLazyQuery } from '@apollo/react-hooks';

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that
 * controls the logic for the Product Root Component.
 *
 * @kind function
 *
 * @param {object}      props
 * @param {GraphQLAST}  props.fragment - The GraphQL fragment to match against a cache entry.
 * @param {Function}    props.mapProduct - A function for updating products to the proper shape.
 * @param {GraphQLAST}  props.query - The query to fetch a product.
 * @param {String}      props.urlKey - The url_key of this product.
 *
 * @returns {object}    result
 * @returns {Bool}      result.error - Indicates a network error occurred.
 * @returns {Bool}      result.loading - Indicates the query is in flight.
 * @returns {Bool}      result.product - The product's details.
 */
export const useProduct = props => {
    const { fragment, mapProduct, query, urlKey } = props;

    const onServer = false;

    const fragmentVariables = useMemo(() => {
        return { onServer };
    }, [onServer]);

    const queryVariables = useMemo(() => {
        return {
            onServer,
            urlKey
        };
    }, [onServer, urlKey]);

    const [runQuery, { loading, error, data }] = useLazyQuery(query, {
        // We're manually checking the cache here, so useLazyQuery can skip that.
        fetchPolicy: 'network-only',
        variables: queryVariables
    });

    const apolloClient = useApolloClient();

    const productFromCache = useMemo(() => {
        /*
         * Look up the product in cache first.
         *
         * We may have it from a previous query, but we have to manually tell Apollo cache where to find it.
         * A single product query (as described by https://github.com/magento/graphql-ce/issues/86)
         * will alleviate the need to do this manual work.
         *
         * If the object with the specified `id` is not in the cache, we get `null`.
         * If the object is in the cache but doesn't have all the fields we need, an error is thrown.
         *
         * @see https://www.apollographql.com/docs/react/caching/cache-interaction/#readfragment.
         */
        try {
            return apolloClient.readFragment({
                // This `id` must match the result of `cacheKeyFromType` in `venia-ui/lib/util/apolloCache.js`.
                id: `ProductInterface:${urlKey}`,
                fragment,
                variables: fragmentVariables
            });
        } catch (e) {
            // The product is in the cache but it is missing some fields the fragment needs.
            // We don't have to do anything here.
            return null;
        }
    }, [apolloClient, fragment, fragmentVariables, urlKey]);

    const product = useMemo(() => {
        if (productFromCache) {
            return mapProduct(productFromCache);
        }

        if (data) {
            const productFromNetwork = data.productDetail.items[0];
            return mapProduct(productFromNetwork);
        }

        // The product isn't in the cache and we don't have a response from GraphQL yet.
        return null;
    }, [data, mapProduct, productFromCache]);

    useEffect(() => {
        // Fetch the product from the network.
        // Note that this always fires, regardless of whether we have a cached product or not:
        // If we do not have a cached product, we need to go fetch it from the network.
        // If we do have a cached product, we want to ensure its cache entry doesn't get stale.
        // In both cases, Apollo will update the cache with the latest data when this returns.
        runQuery({
            variables: queryVariables
        });
    }, [queryVariables, runQuery]);

    return {
        error,
        loading,
        product
    };
};
