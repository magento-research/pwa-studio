import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';

import { Link } from '@magento/venia-drivers';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './accountMenuItems.css';

const MENU_ITEMS = [
    { name: 'Order History', url: '' },
    { name: 'Store Credit & Gift Cards', url: '' },
    { name: 'Favorites Lists', url: '' },
    { name: 'Address Book', url: '' },
    { name: 'Saved Payments', url: '' },
    { name: 'Communications', url: '' },
    { name: 'Account Information', url: '' },
    { name: 'Sign Out', url: '' }
];

const AccountMenuItems = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const menuItems = MENU_ITEMS.map(item => {
        return (
            <Link className={classes.link} to={item.url} key={item.name}>
                {item.name}
            </Link>
        );
    });

    return <Fragment>{menuItems}</Fragment>;
};

export default AccountMenuItems;

AccountMenuItems.propTypes = {
    classes: shape({
        link: string
    })
};
