import React, { Fragment, useEffect } from 'react';
import { useProduct } from '@magento/peregrine/lib/talons/RootComponents/Product/useProduct';

import { Title } from '../../components/Head';
import ErrorView from '../../components/ErrorView';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import ProductFullDetail from '../../components/ProductFullDetail';
import getUrlKey from '../../util/getUrlKey';
import mapProduct from '../../util/mapProduct';

/*
 * As of this writing, there is no single Product query type in the M2.3 schema.
 * The recommended solution is to use filter criteria on a Products query.
 * However, the `id` argument is not supported. See
 * https://github.com/magento/graphql-ce/issues/86
 * TODO: Replace with a single product query when possible.
 */
import GET_PRODUCT_DETAIL from '../../queries/getProductDetail.graphql';
import PRODUCT_DETAILS_FRAGMENT from '../../fragments/productDetails.graphql';

const Product = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const talonProps = useProduct({
        fragment: PRODUCT_DETAILS_FRAGMENT,
        mapProduct,
        query: GET_PRODUCT_DETAIL,
        urlKey: getUrlKey()
    });

    const { error, loading, product } = talonProps;

    if (product) {
        // Note: STORE_NAME is injected by Webpack at build time.
        return (
            <Fragment>
                <Title>{`${product.name} - ${STORE_NAME}`}</Title>
                <ProductFullDetail product={product} />
            </Fragment>
        );
    }

    if (loading) return fullPageLoadingIndicator;
    if (error) return <div>Data Fetch Error</div>;

    return <ErrorView outOfStock={true} />;
};

export default Product;
