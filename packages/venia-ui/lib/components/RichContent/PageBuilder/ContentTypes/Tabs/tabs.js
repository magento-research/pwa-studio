import React, {
    Children,
    useRef,
    useEffect,
    useCallback,
    useState
} from 'react';
import {
    Tabs as TabWrapper,
    TabList,
    Tab as TabHeader,
    TabPanel
} from 'react-tabs';
import defaultClasses from './tabs.css';
import { mergeClasses } from '../../../../../classify';
import { arrayOf, number, oneOf, shape, string } from 'prop-types';

/**
 * Page Builder Tabs component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Tabs
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a set of Tabs.
 */
const Tabs = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const navigationRef = useRef(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const [clientX, setClientX] = useState(0);
    const [scrollX, setScrollX] = useState(0);
    const [scrollElement, setScrollElement] = useState(null);
    const [navWrapperClass, setNavWrapperClass] = useState();
    const {
        tabNavigationAlignment = 'left',
        minHeight,
        defaultIndex = 0,
        headers = [],
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = [],
        children
    } = props;

    const onMouseDown = useCallback(
        event => {
            setIsScrolling(true);
            setClientX(event.clientX);
        },
        [setIsScrolling, setClientX]
    );

    const onMouseUp = useCallback(() => {
        setIsScrolling(false);
    }, [setIsScrolling]);

    const onMouseMove = useCallback(
        event => {
            if (isScrolling && scrollElement) {
                scrollElement.scrollLeft = scrollX + (clientX - event.clientX);
                setScrollX(scrollElement.scrollLeft);
                setClientX(event.clientX);
            }
        },
        [isScrolling, scrollElement, scrollX, clientX]
    );

    useEffect(() => {
        let navScrollElement;
        const navigationWrapper = navigationRef.current;
        const handleScroll = () => {
            if (navScrollElement.scrollLeft > 0) {
                // If we've scrolled to the end of the scrollable element we only display a left gradient
                if (
                    navScrollElement.scrollLeft +
                        navScrollElement.offsetWidth +
                        1 >=
                    navScrollElement.scrollWidth
                ) {
                    setNavWrapperClass(classes.navigationGradientLeft);
                } else {
                    // While scrolling we show gradients on both sides
                    setNavWrapperClass(classes.navigationGradientBoth);
                }
            } else {
                setNavWrapperClass(classes.navigationGradientRight);
            }
        };

        if (
            navigationWrapper &&
            navigationWrapper.childNodes[0].nodeName === 'UL'
        ) {
            navScrollElement = navigationWrapper.childNodes[0];
            setScrollElement(navScrollElement);
            // If there are additional tabs hidden by scroll we display a gradient on the right
            if (navScrollElement.scrollWidth > navScrollElement.offsetWidth) {
                setNavWrapperClass(classes.navigationGradientRight);
            }
            navScrollElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (navScrollElement) {
                navScrollElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, [
        classes.navigationGradientBoth,
        classes.navigationGradientLeft,
        classes.navigationGradientRight,
        navigationRef
    ]);

    if (!headers.length) {
        return null;
    }

    const wrapperStyles = {
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    const contentStyles = {
        minHeight,
        textAlign
    };

    const tabWrapperProps = {
        defaultIndex
    };

    if (border) {
        wrapperStyles['--tabs-border'] = border;
        wrapperStyles['--tabs-border-color'] = borderColor;
    }
    if (borderWidth) {
        wrapperStyles['--tabs-border-width'] = borderWidth;
    }
    if (borderRadius) {
        wrapperStyles['--tabs-border-radius'] = borderRadius;
    }

    const tabPanels = Children.map(children, (child, index) => {
        return (
            <TabPanel
                key={index}
                className={classes.panel}
                selectedClassName={classes.panelSelected}
            >
                {child}
            </TabPanel>
        );
    });

    const navigationClass =
        classes[
            `navigation${tabNavigationAlignment.charAt(0).toUpperCase() +
                tabNavigationAlignment.slice(1)}`
        ];

    const contentClass =
        classes[
            `content${tabNavigationAlignment.charAt(0).toUpperCase() +
                tabNavigationAlignment.slice(1)}`
        ];

    return (
        <TabWrapper
            style={wrapperStyles}
            className={[classes.root, ...cssClasses].join(' ')}
            disabledTabClassName={classes.disabled}
            selectedTabClassName={classes.selected}
            {...tabWrapperProps}
        >
            <div className={navWrapperClass} ref={navigationRef}>
                <TabList
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseUp}
                    className={navigationClass}
                >
                    {headers.map((header, i) => (
                        <TabHeader className={classes.header} key={i}>
                            {header}
                        </TabHeader>
                    ))}
                </TabList>
            </div>
            <div className={contentClass} style={contentStyles}>
                {tabPanels}
            </div>
        </TabWrapper>
    );
};

/**
 * Props for {@link Tabs}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Tabs
 * @property {String} classes.header Class names for the tab header
 * @property {String} classes.panelSelected Class names for the selected tab panel
 * @property {String} classes.panel Class names for the tab panel
 * @property {String} classes.contentLeft Class names for the tab content
 * @property {String} classes.contentCenter Class names for the tab content
 * @property {String} classes.contentRight Class names for the tab content
 * @property {String} classes.navigationLeft Class names for the tab navigation
 * @property {String} classes.navigationCenter Class names for the tab navigation
 * @property {String} classes.navigationRight Class names for the tab navigation
 * @property {String} classes.navigationGradientLeft Class names for the tab navigation gradient when scrolling
 * @property {String} classes.navigationGradientRight Class names for the tab navigation gradient when scrolling
 * @property {String} classes.navigationGradientBoth Class names for the tab navigation gradient when scrolling
 * @property {String} classes.disabled Class names for the disabled tabs
 * @property {String} classes.selected Class names for the selected tab
 * @property {String} classes.item Class names for the tab item
 * @property {String} tabNavigationAlignment Navigation alignment for tabs
 * @property {String} minHeight Minimum height of the tabs
 * @property {Number} defaultIndex Index of the tab to display by default
 * @property {Array} headers Array of tab headers
 * @property {String} textAlign Alignment of the Tabs within the parent container
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
Tabs.propTypes = {
    classes: shape({
        header: string,
        panelSelected: string,
        panel: string,
        contentLeft: string,
        contentCenter: string,
        contentRight: string,
        navigationLeft: string,
        navigationCenter: string,
        navigationRight: string,
        navigationGradientLeft: string,
        navigationGradientRight: string,
        navigationGradientBoth: string,
        disabled: string,
        selected: string,
        item: string
    }),
    tabNavigationAlignment: oneOf(['left', 'center', 'right']),
    minHeight: string,
    defaultIndex: number,
    headers: arrayOf(string),
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    paddingLeft: string,
    cssClasses: arrayOf(string)
};

export default Tabs;
