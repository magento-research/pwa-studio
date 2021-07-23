import React, { Fragment } from 'react';
import { number, shape, string } from 'prop-types';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import { useCmsPage } from '@magento/peregrine/lib/talons/Cms/useCmsPage';
import RichContent from '../../components/RichContent';
import CategoryList from '../../components/CategoryList';
import { Meta, StoreTitle } from '../../components/Head';
import { useStyle } from '../../classify';
import { useIntl } from 'react-intl';

import defaultClasses from './cms.css';

const CMSPage = props => {
    const { id, identifier } = props;

    const talonProps = useCmsPage({ id, identifier });
    const {
        cmsPage,
        hasContent,
        rootCategoryId,
        shouldShowLoadingIndicator
    } = talonProps;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    if (shouldShowLoadingIndicator) {
        return fullPageLoadingIndicator;
    }

    if (hasContent) {
        const {
            content_heading,
            title,
            meta_title,
            meta_description,
            content
        } = cmsPage;

        const headingElement =
            content_heading !== '' ? (
                <h1 className={classes.heading}>{content_heading}</h1>
            ) : null;

        const pageTitle = meta_title || title;

        return (
            <Fragment>
                <StoreTitle>{pageTitle}</StoreTitle>
                <Meta name="title" content={pageTitle} />
                <Meta name="description" content={meta_description} />
                {headingElement}
                <RichContent html={content} />
            </Fragment>
        );
    }

    // Fallback to a category list if there is no cms content.
    return (
        <CategoryList
            title={formatMessage({
                id: 'cms.shopByCategory',
                defaultMessage: 'Shop by category'
            })}
            id={rootCategoryId}
        />
    );
};

CMSPage.propTypes = {
    id: number,
    identifier: string,
    classes: shape({
        heading: string
    })
};

export default CMSPage;
