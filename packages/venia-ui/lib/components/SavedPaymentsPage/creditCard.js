import React, { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Trash2 as DeleteIcon } from 'react-feather';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import Icon from '../Icon';

import defaultClasses from './creditCard.css';

/**
 * Enumerated list of supported credit card types from
 *
 * https://github.com/magento/magento2/blob/2.4-develop/app/code/Magento/Payment/view/base/web/js/model/credit-card-validation/credit-card-number-validator/credit-card-type.js
 */
const cardTypeMapper = {
    AE: 'American Express',
    AU: 'Aura',
    DI: 'Discover',
    DN: 'Diners',
    ELO: 'Elo',
    HC: 'Hipercard',
    JCB: 'JCB',
    MC: 'MasterCard',
    MD: 'Maestro Domestic',
    MI: 'Maestro International',
    UN: 'UnionPay',
    VI: 'Visa'
};

const CreditCard = props => {
    const { classes: propClasses, details, public_hash } = props;
    const classes = mergeClasses(defaultClasses, propClasses);

    const number = `**** ${details.maskedCC} \u00A0\u00A0 ${
        cardTypeMapper[details.type]
    }`;
    const cardExpiryDate = useMemo(() => {
        const [month, year] = details.expirationDate.split('/');
        const longMonth = new Date(+year, +month - 1).toLocaleString(
            'default',
            { month: 'short' }
        );

        return `${longMonth} ${year}`;
    }, [details.expirationDate]);

    // Should be moved to a talon in the future
    const handleDelete = useCallback(() => {}, []);
    const deleteButton = (
        <button className={classes.deleteButton} onClick={handleDelete}>
            <span className={classes.buttonContent}>
                <Icon
                    classes={{
                        icon: classes.deleteIcon
                    }}
                    size={16}
                    src={DeleteIcon}
                />
                <span className={classes.deleteText}>
                    <FormattedMessage
                        id={'storedPayments.delete'}
                        defaultMessage={'Delete'}
                    />
                </span>
            </span>
        </button>
    );

    return (
        <div className={classes.root} key={public_hash}>
            <div className={classes.title}>
                <FormattedMessage
                    id={'storedPayments.creditCard'}
                    defaultMessage={'Credit Card'}
                />
            </div>
            <div className={classes.number}>{number}</div>
            <div className={classes.expiry_date}>{cardExpiryDate}</div>
            <div className={classes.delete}>{deleteButton}</div>
        </div>
    );
};

export default CreditCard;
