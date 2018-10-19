import React, { Component } from 'react';
import { func, shape, string } from 'prop-types';
import classify from 'src/classify';
import Button, { darkThemeClasses } from 'src/components/Button';
import defaultCssClasses from './receipt.css';

const defaultClasses = {
    ...defaultCssClasses,
    resetCheckoutButtonClasses: darkThemeClasses,
    createAccountButtonClasses: darkThemeClasses
};

class Receipt extends Component {
    static propTypes = {
        classes: shape({
            body: string,
            footer: string,
            root: string
        }),
        resetCheckout: func,
        order: shape({
            id: string
        }),
        handleCreateAccount: func
    };

    static defaultProps = {
        order: {},
        resetCheckout: () => {},
        handleCreateAccount: () => {}
    };

    componentWillUnmount() {
        this.props.reset();
    }

    render() {
        const {
            classes,
            resetCheckout,
            handleCreateAccount,
            order: { id }
        } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.body}>
                    <h2 className={classes.header}>
                        Thank you for your purchase!
                    </h2>
                    <div className={classes.textBlock}>
                        Your order # is{' '}
                        <span className={classes.orderId}>{id}</span>
                        <br />
                        We'll email you an order confirmation with details and
                        tracking info
                    </div>
                    <Button
                        classes={classes.resetCheckoutButtonClasses}
                        onClick={resetCheckout}
                    >
                        Continue Shopping
                    </Button>
                    <div className={classes.textBlock}>
                        Track order status and earn rewards for your purchase by
                        creating and account.
                    </div>
                    <Button
                        classes={classes.createAccountButtonClasses}
                        onClick={handleCreateAccount}
                    >
                        Create an Account
                    </Button>
                </div>
            </div>
        );
    }
}
export default classify(defaultClasses)(Receipt);
