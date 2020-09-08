import React from 'react';
import ErrorView from '../ErrorView';
import {
    INTERNAL_ERROR,
    NOT_FOUND,
    useMagentoRoute
} from '@magento/peregrine/lib/talons/MagentoRoute';
const { BrowserPersistence } = Util;

import { fullPageLoadingIndicator } from '../LoadingIndicator';
import { Util } from '@magento/peregrine';
import { useIntl } from 'react-intl';

const MESSAGES = new Map()
    .set(NOT_FOUND, 'That page could not be found. Please try again.')
    .set(INTERNAL_ERROR, 'Something went wrong. Please try again.');

const MagentoRoute = () => {
    const { formatMessage } = useIntl();
    const magentoRouteProps = {};
    // If we have a specific store view code configured pass it into the url resolver
    const storage = new BrowserPersistence();

    if (storage.getItem('store_view')) {
        magentoRouteProps.store = storage.getItem('store_view').code;
    }
    const talonProps = useMagentoRoute(magentoRouteProps);
    const {
        component: RootComponent,
        id,
        isLoading,
        isRedirect,
        routeError
    } = talonProps;

    if (isLoading || isRedirect) {
        return fullPageLoadingIndicator;
    } else if (RootComponent) {
        return <RootComponent id={id} />;
    } else if (routeError === NOT_FOUND) {
        return (
            <ErrorView>
                <h1>{formatMessage({ id: MESSAGES.get(routeError) })}</h1>
            </ErrorView>
        );
    }

    return (
        <ErrorView>
            <h1>{formatMessage({ id: MESSAGES.get(INTERNAL_ERROR) })}</h1>
        </ErrorView>
    );
};

export default MagentoRoute;
