import React, { Fragment, useEffect } from 'react';
import { Form } from 'informed';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string } from 'prop-types';
import defaultClasses from './newsletter.css';
import FormError from '@magento/venia-ui/lib/components/FormError/formError';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { useNewsletter } from '@magento/peregrine/lib/talons/Newsletter/useNewsletter';
import { SUBSCRIBE_TO_NEWSLETTER } from './newsletter.gql';
import { useToasts } from '@magento/peregrine';
const Newsletter = props => {
    const { formatMessage } = useIntl();
    const classes = mergeClasses(defaultClasses, props.classes);
    const talonProps = useNewsletter({
        subscribeMutation: SUBSCRIBE_TO_NEWSLETTER
    });
    const [, { addToast }] = useToasts();
    const {
        errors,
        handleSubmit,
        isBusy,
        setFormApi,
        newsLetterResponse
    } = talonProps;
    useEffect(() => {
        if (newsLetterResponse && newsLetterResponse.status) {
            addToast({
                type: 'info',
                message: formatMessage({
                    id: 'newsletter.subscribeMessage',
                    defaultMessage: 'The email address is subscribed.'
                }),
                timeout: 5000
            });
        }
    }, [addToast, formatMessage, newsLetterResponse]);
    if (isBusy) {
        return (
            <div className={classes.modal_active}>
                <LoadingIndicator>
                    <FormattedMessage
                        id={'newsletter.loadingText'}
                        defaultMessage={'Subscribing'}
                    />
                </LoadingIndicator>
            </div>
        );
    }
    return (
        <Fragment>
            <div className={classes.root}>
                <h2 className={classes.title}>
                    <FormattedMessage
                        id={'newsletter.titleText'}
                        defaultMessage={'Subscribe to your Newsletter'}
                    />
                </h2>
                <FormError errors={Array.from(errors.values())} />
                <Form
                    getApi={setFormApi}
                    className={classes.form}
                    onSubmit={handleSubmit}
                >
                    <TextInput
                        autoComplete="email"
                        field="email"
                        validate={isRequired}
                    />
                    <div className={classes.buttonsContainer}>
                        <Button priority="high" type="submit">
                            <FormattedMessage
                                id={'newsletter.subscribeText'}
                                defaultMessage={'Subscribe'}
                            />
                        </Button>
                    </div>
                </Form>
            </div>
        </Fragment>
    );
};

Newsletter.propTypes = {
    classes: shape({
        modal_active: string,
        root: string,
        title: string,
        form: string,
        buttonsContainer: string
    })
};

export default Newsletter;
