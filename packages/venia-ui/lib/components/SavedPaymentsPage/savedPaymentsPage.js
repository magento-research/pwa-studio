import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { useSavedPaymentsPage } from '@magento/peregrine/lib/talons/SavedPaymentsPage/useSavedPaymentsPage';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import { TitleWithStore } from '../Head';
import PaymentCard from './paymentCard';
import { fullPageLoadingIndicator } from '../LoadingIndicator';

import defaultClasses from './savedPaymentsPage.css';

const SavedPaymentsPage = props => {
    const talonProps = useSavedPaymentsPage();

    const { isLoading, savedPayments } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const { formatMessage } = useIntl();

    const savedPaymentElements = useMemo(() => {
        if (savedPayments.length) {
            return savedPayments.map(paymentDetails => (
                <PaymentCard
                    key={paymentDetails.public_hash}
                    {...paymentDetails}
                />
            ));
        } else {
            return null;
        }
    }, [savedPayments]);

    const noSavedPayments = useMemo(() => {
        if (!savedPayments.length) {
            return formatMessage({
                id: 'savedPaymentsPage.noSavedPayments',
                defaultMessage: 'You have no saved payments.'
            });
        } else {
            return null;
        }
    }, [savedPayments, formatMessage]);

    const title = formatMessage({
        id: 'savedPaymentsPage.title',
        defaultMessage: 'Saved Payments'
    });

    if (isLoading) {
        return fullPageLoadingIndicator;
    }

    return (
        <div className={classes.root}>
            <TitleWithStore>{title}</TitleWithStore>
            <h1 className={classes.heading}>{title}</h1>
            <div className={classes.content}>{savedPaymentElements}</div>
            <div className={classes.noPayments}>{noSavedPayments}</div>
        </div>
    );
};

export default SavedPaymentsPage;
