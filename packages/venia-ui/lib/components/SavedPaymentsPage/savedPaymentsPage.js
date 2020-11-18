import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { useSavedPaymentsPage } from '@magento/peregrine/lib/talons/SavedPaymentsPage/useSavedPaymentsPage';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import { Title } from '../Head';
import PaymentCard from './paymentCard';

import { GET_SAVED_PAYMENTS_QUERY } from './savedPaymentsPage.gql';

import defaultClasses from './savedPaymentsPage.css';

const SavedPaymentsPage = props => {
    const talonProps = useSavedPaymentsPage({
        queries: {
            getSavedPaymentsQuery: GET_SAVED_PAYMENTS_QUERY
        }
    });

    const { savedPayments } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const savedPaymentElements = useMemo(
        () =>
            savedPayments.map(paymentDetails => (
                <PaymentCard
                    key={paymentDetails.public_hash}
                    {...paymentDetails}
                />
            )),
        [savedPayments]
    );

    const { formatMessage } = useIntl();

    // STORE_NAME is injected by Webpack at build time.
    const title = formatMessage(
        { id: 'savedPaymentsPage.title' },
        { store_name: STORE_NAME }
    );
    const subHeading = formatMessage({ id: 'savedPaymentsPage.subHeading' });

    return (
        <div className={classes.root}>
            <Title>{title}</Title>
            <h1 className={classes.heading}>{title}</h1>
            <h3 className={classes.subHeading}>{subHeading}</h3>
            <div className={classes.content}>{savedPaymentElements}</div>
        </div>
    );
};

export default SavedPaymentsPage;
