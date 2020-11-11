import React from 'react';
import { mergeClasses } from '../../classify';
import defaultClasses from './submenuColumn.css';
import { Link, resourceUrl } from '../../drivers';
import PropTypes from 'prop-types';

/**
 * The SubmenuColumn component displays columns with categories in submenu
 *
 * @param {MegaMenuCategory} props.category
 */
const SubmenuColumn = props => {
    const { category } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const categoryUrl = resourceUrl(
        `/${category.url_path}${category.url_suffix}`
    );
    let children = null;

    if (category.children.length) {
        const childrenItems = category.children.map((category, index) => {
            const categoryUrl = resourceUrl(
                `/${category.url_path}${category.url_suffix}`
            );

            return (
                <li key={index} className={classes.submenuChildItem}>
                    <Link
                        className={
                            category.isActive
                                ? classes.linkActive
                                : classes.link
                        }
                        to={categoryUrl}
                    >
                        {category.name}
                    </Link>
                </li>
            );
        });

        children = <ul className={classes.submenuChild}>{childrenItems}</ul>;
    }

    return (
        <div className={classes.submenuColumn}>
            <Link className={classes.link} to={categoryUrl}>
                <h3 className={classes.heading}>{category.name}</h3>
            </Link>
            {children}
        </div>
    );
};

export default SubmenuColumn;

SubmenuColumn.propTypes = {
    category: PropTypes.object.isRequired
};
