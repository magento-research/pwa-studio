import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string, bool, func } from 'prop-types';
import { useCheckmo } from '@magento/venia-sample-payments-checkmo/talons/useCheckmo';
import defaultClasses from './checkmo.css';
import { FormattedMessage } from 'react-intl';
import BillingAddress from './BillingAddress';
import checkmoOperations from './checkmo.gql';

const CheckMo = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const payableToDefault = 'Venia Inc';
    const mailingAddresDefault =
        'Venia Inc\r\nc/o Payment\r\nPO 122334\r\nAustin Texas"';
    const { resetShouldSubmit, onPaymentSuccess } = props;
    const addressTemplate = str => (
        <span key={str}>
            {str} <br />
        </span>
    );

    const { setPaymentMethodOnCartMutation } = checkmoOperations;

    const {
        payableTo,
        mailingAddress,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    } = useCheckmo({
        setPaymentMethodOnCartMutation,
        resetShouldSubmit,
        onPaymentSuccess
    });
    const formatAddress = mailingAddress
        ? mailingAddress.split('\n').map(str => addressTemplate(str))
        : mailingAddresDefault.split('\n').map(str => addressTemplate(str));

    return (
        <div className={classes.root}>
            <p className={classes.title}>
                <FormattedMessage
                    id={'checkMo.payableToTitle'}
                    defaultMessage={'Make Check payable to:'}
                />
            </p>
            <p className={classes.formatAddress}>
                {payableTo ? payableTo : payableToDefault}
            </p>
            <p className={classes.mailingAddressTitle}>
                <FormattedMessage
                    id={'checkMo.mailingAddressTitle'}
                    defaultMessage={'Send Check to:'}
                />
            </p>
            <p className={classes.formatAddress}>{formatAddress}</p>
            <BillingAddress
                shouldSubmit={props.shouldSubmit}
                onBillingAddressChangedError={onBillingAddressChangedError}
                onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
            />
        </div>
    );
};

CheckMo.propTypes = {
    classes: shape({ root: string }),
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onDropinReady: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};
CheckMo.defaultProps = {};
export default CheckMo;
