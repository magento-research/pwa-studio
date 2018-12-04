import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { arrayOf, func, number, objectOf, shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './categoryLeaf.css';

const urlSuffix = '.html';

class Leaf extends Component {
    static propTypes = {
        children: func,
        classes: shape({
            root: string,
            text: string
        }),
        nodeId: number.isRequired,
        nodes: objectOf(
            shape({
                childrenData: arrayOf(number).isRequired,
                id: number.isRequired,
                name: string.isRequired,
                urlPath: string
            })
        ),
        onNavigate: func
    };

    handleClick = () => {
        const { onNavigate } = this.props;

        if (typeof onNavigate === 'function') {
            onNavigate();
        }
    };

    render() {
        const { classes, name, urlPath } = this.props;
        const text = name;

        return (
            <Link
                className={classes.root}
                to={`/${urlPath}${urlSuffix}`}
                onClick={this.handleClick}
            >
                <span className={classes.text}>{text}</span>
            </Link>
        );
    }
}

export default classify(defaultClasses)(Leaf);
