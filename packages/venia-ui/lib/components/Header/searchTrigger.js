import React from 'react';
import { shape, string } from 'prop-types';
import { Search as SearchIcon } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import Icon from '../Icon';

import { mergeClasses } from '../../classify';
import defaultClasses from './searchTrigger.css';
import { useSearchTrigger } from '@magento/peregrine/lib/talons/Header/useSearchTrigger';

const SearchTrigger = React.forwardRef((props, ref) => {
    const { active, onClick } = props;

    const talonProps = useSearchTrigger({
        onClick
    });
    const { handleClick } = talonProps;
    const { formatMessage } = useIntl();

    const classes = mergeClasses(defaultClasses, props.classes);
    const searchClass = active ? classes.open : classes.root;

    return (
        <button
            className={searchClass}
            aria-label={formatMessage({
                id: 'searchTrigger.ariaLabel',
                defaultMessage: 'Search'
            })}
            onClick={handleClick}
            ref={ref}
        >
            <Icon src={SearchIcon} />
            <span className={classes.label}>
                <FormattedMessage id={'Search'} />
            </span>
        </button>
    );
});

SearchTrigger.propTypes = {
    classes: shape({
        root: string,
        open: string
    })
};

export default SearchTrigger;
