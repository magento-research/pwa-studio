import React, { Fragment, useEffect } from 'react';

import CreateAccount from './createAccount';
import ItemsReview from '../ItemsReview';
import { mergeClasses } from '../../../classify';

import defaultClasses from './orderConfirmationPage.css';
import { useOrderConfirmationPage } from '@magento/peregrine/lib/talons/CheckoutPage/OrderConfirmationPage/useOrderConfirmationPage';

const OrderConfirmationPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { data, orderNumber } = props;

    const talonProps = useOrderConfirmationPage({
        data
    });

    const { flatData, isSignedIn } = talonProps;

    const {
        city,
        country,
        email,
        firstname,
        lastname,
        postcode,
        region,
        shippingMethod,
        street
    } = flatData;

    const streetRows = street.map((row, index) => {
        return (
            <span key={index} className={classes.addressStreet}>
                {row}
            </span>
        );
    });

    useEffect(() => {
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const createAccount = !isSignedIn ? (
        <CreateAccount
            firstname={firstname}
            lastname={lastname}
            email={email}
        />
    ) : null;

    return (
        <Fragment>
            <div className={classes.mainContainer}>
                <h2 className={classes.heading}>
                    {'Thank you for your order!'}
                </h2>
                <div
                    className={classes.orderNumber}
                >{`Order Number: ${orderNumber}`}</div>
                <div className={classes.shippingInfoHeading}>
                    Shipping Information
                </div>
                <div className={classes.shippingInfo}>
                    <span className={classes.email}>{email}</span>
                    <span
                        className={classes.name}
                    >{`${firstname} ${lastname}`}</span>
                    {streetRows}
                    <span
                        className={classes.addressAdditional}
                    >{`${city}, ${region} ${postcode} ${country}`}</span>
                </div>
                <div className={classes.shippingMethodHeading}>
                    Shipping Method
                </div>
                <div className={classes.shippingMethod}>{shippingMethod}</div>
                <div className={classes.itemsReview}>
                    <ItemsReview data={data} />
                </div>
                <div className={classes.additionalText}>
                    You will also receive an email with the details and we will
                    let you know when your order has shipped.
                </div>
            </div>
            <div className={classes.sidebarContainer}>{createAccount}</div>
        </Fragment>
    );
};

export default OrderConfirmationPage;
