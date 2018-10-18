import React, { Component } from 'react';
import { func, shape, string } from 'prop-types';
import classify from 'src/classify';
import Button, { darkThemeClasses } from 'src/components/Button';
import defaultClasses from './receipt.css';

export const CONTINUE_SHOPPING = 'Continue Shopping';
export const CREATE_AN_ACCOUNT = 'Create an Account';

class Receipt extends Component {
    static propTypes = {
        classes: shape({
            body: string,
            footer: string,
            root: string
        }),
        resetCheckout: func.isRequired,
        order: shape({
            id: string
        })
    };

    static defaultProps = {
        order: {}
    };

    componentWillUnmount() {
        this.props.reset();
    }

    render() {
        const {
            classes,
            resetCheckout,
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
                    <Button classes={darkThemeClasses} onClick={resetCheckout}>
                        {CONTINUE_SHOPPING}
                    </Button>
                    <div className={classes.textBlock}>
                        Track order status and earn rewards for your purchase by
                        creating and account.
                    </div>
                    <Button classes={darkThemeClasses}>
                        {CREATE_AN_ACCOUNT}
                    </Button>
                </div>
            </div>
        );
    }
}
export default classify(defaultClasses)(Receipt);
