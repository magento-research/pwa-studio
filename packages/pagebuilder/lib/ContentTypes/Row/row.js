import React, { useEffect, useRef, useState } from 'react';
import defaultClasses from './row.css';
import { verticalAlignmentToFlex } from '../../utils';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { arrayOf, oneOf, shape, bool, string, number } from 'prop-types';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useDetectScrollWidth } from '@magento/peregrine/lib/hooks/useDetectScrollWidth';

const { matchMedia } = globalThis;

/**
 * Page Builder Row component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Row
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Row which contains content.
 */
const Row = props => {
    const backgroundElement = useRef(null);
    const [bgImageStyle, setBgImageStyle] = useState(null);
    const classes = useStyle(defaultClasses, props.classes);
    const {
        appearance,
        verticalAlignment,
        minHeight,
        backgroundColor,
        desktopImage,
        mobileImage,
        backgroundSize,
        backgroundPosition,
        backgroundAttachment,
        backgroundRepeat,
        enableParallax,
        parallaxSpeed = 0.5,
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
        children,
        cssClasses = [],
        backgroundType,
        videoSrc,
        videoFallbackSrc,
        videoLoop,
        videoPlayOnlyVisible,
        videoLazyLoading,
        videoOverlayColor
    } = props;

    let image = desktopImage;
    if (mobileImage && matchMedia && matchMedia('(max-width: 768px)').matches) {
        image = mobileImage;
    }

    const dynamicStyles = {
        minHeight,
        backgroundColor,
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
        paddingLeft
    };

    const videoOverlayStyles = {
        backgroundColor: videoOverlayColor
    };

    if (image) {
        dynamicStyles.backgroundImage = bgImageStyle;
        dynamicStyles.backgroundSize = backgroundSize;
        dynamicStyles.backgroundPosition = backgroundPosition;
        dynamicStyles.backgroundAttachment = backgroundAttachment;
        dynamicStyles.backgroundRepeat = backgroundRepeat
            ? 'repeat'
            : 'no-repeat';
    }

    if (verticalAlignment) {
        dynamicStyles.display = 'flex';
        dynamicStyles.justifyContent = verticalAlignmentToFlex(
            verticalAlignment
        );
        dynamicStyles.flexDirection = 'column';
    }
    //
    useDetectScrollWidth();
    // Determine the containers width and optimize the image
    useEffect(() => {
        // Intelligently resize cover background images
        if (image && backgroundElement.current) {
            if (backgroundSize === 'cover') {
                let elementWidth = backgroundElement.current.offsetWidth;
                let elementHeight = backgroundElement.current.offsetHeight;
                // If parallax is enabled resize at a higher resolution, as the image will be zoomed
                if (enableParallax) {
                    elementWidth = Math.round(elementWidth * 1.25);
                    elementHeight = Math.round(elementHeight * 1.25);
                }
                setBgImageStyle(
                    `url(${resourceUrl(image, {
                        type: 'image-wysiwyg',
                        width: elementWidth,
                        height: elementHeight,
                        quality: 85,
                        crop: false,
                        fit: 'cover'
                    })})`
                );
            } else {
                setBgImageStyle(
                    `url(${resourceUrl(image, {
                        type: 'image-wysiwyg',
                        quality: 85
                    })})`
                );
            }
        }
    }, [backgroundSize, enableParallax, image, setBgImageStyle]);

    // Initiate jarallax for Parallax and background video
    useEffect(() => {
        let parallaxElement;
        let jarallax;
        let jarallaxVideo;

        if (enableParallax && bgImageStyle && backgroundType !== 'video') {
            ({ jarallax } = require('jarallax'));
            parallaxElement = backgroundElement.current;
            jarallax(parallaxElement, {
                speed: parallaxSpeed,
                imgSize: backgroundSize,
                imgPosition: backgroundPosition,
                imgRepeat: backgroundRepeat ? 'repeat' : 'no-repeat'
            });
        }

        if (backgroundType === 'video') {
            ({ jarallax } = require('jarallax'));
            ({ jarallaxVideo } = require('jarallax'));
            jarallaxVideo();
            parallaxElement = backgroundElement.current;
            jarallax(parallaxElement, {
                speed: enableParallax ? parallaxSpeed : 1,
                imgSrc: videoFallbackSrc
                    ? resourceUrl(videoFallbackSrc, {
                          type: 'image-wysiwyg',
                          quality: 85
                      })
                    : null,
                videoSrc,
                videoLoop,
                videoPlayOnlyVisible,
                videoLazyLoading
            });

            parallaxElement.jarallax.video &&
                parallaxElement.jarallax.video.on('started', () => {
                    const self = parallaxElement.jarallax;

                    // show video
                    if (self.$video) {
                        self.$video.style.visibility = 'visible';
                    }
                });
        }

        return () => {
            if (
                (enableParallax && parallaxElement && bgImageStyle) ||
                (parallaxElement && backgroundType === 'video')
            ) {
                jarallax(parallaxElement, 'destroy');
            }
        };
    }, [
        backgroundPosition,
        backgroundRepeat,
        backgroundSize,
        bgImageStyle,
        enableParallax,
        parallaxSpeed,
        backgroundType,
        videoSrc,
        videoFallbackSrc,
        videoLoop,
        videoPlayOnlyVisible,
        videoLazyLoading
    ]);

    const videoOverlay = videoOverlayColor ? (
        <div className={classes.videoOverlay} style={videoOverlayStyles} />
    ) : null;

    if (appearance === 'full-bleed') {
        return (
            <div
                ref={backgroundElement}
                style={{
                    ...dynamicStyles,
                    marginLeft: null,
                    marginRight: null,
                    '--pbRowMarginLeft': marginLeft,
                    '--pbRowMarginRight': marginRight
                }}
                className={[
                    classes.fullBleed,
                    classes.root,
                    ...cssClasses
                ].join(' ')}
            >
                {videoOverlay}
                {children}
            </div>
        );
    }

    if (appearance === 'full-width') {
        return (
            <div
                ref={backgroundElement}
                style={{
                    ...dynamicStyles,
                    marginLeft: null,
                    marginRight: null,
                    '--pbRowMarginLeft': marginLeft,
                    '--pbRowMarginRight': marginRight
                }}
                className={[
                    classes.fullBleed,
                    classes.root,
                    ...cssClasses
                ].join(' ')}
            >
                {videoOverlay}
                <div className={classes.contained}>{children}</div>
            </div>
        );
    }

    return (
        <div className={[classes.contained, ...cssClasses].join(' ')}>
            <div
                ref={backgroundElement}
                className={classes.inner}
                style={dynamicStyles}
            >
                {videoOverlay}
                {children}
            </div>
        </div>
    );
};

/**
 * Props for {@link Row}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Row
 * @property {String} classes.contained CSS class for the contained appearance element
 * @property {String} classes.inner CSS class for the inner appearance element
 * @property {String} classes.root CSS class for the row root element
 * @property {String} classes.videoOverlay CSS class for the videoOverlay element
 * @property {String} minHeight CSS minimum height property
 * @property {String} backgroundColor CSS background-color property
 * @property {String} desktopImage Background image URL to be displayed on desktop devices
 * @property {String} mobileImage Background image URL to be displayed on mobile devices
 * @property {String} backgroundSize CSS background-size property
 * @property {String} backgroundPosition CSS background-position property
 * @property {String} backgroundAttachment CSS background-attachment property
 * @property {Boolean} backgroundRepeat CSS background-repeat property
 * @property {Boolean} enableParallax Enable parallax on this row
 * @property {Number} parallaxSpeed The speed which Parallax should scroll, from -1.0 to 2.0
 * @property {String} textAlign Alignment of content within the row
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
 * @property {String} backgroundType Background type
 * @property {String} videoSrc URL to the video
 * @property {String} videoFallbackSrc URL to the image which will be displayed before video
 * @property {Boolean} videoLoop Play video in loop
 * @property {Boolean} videoPlayOnlyVisible Play video when it is visible
 * @property {Boolean} videoLazyLoading Load video when it is visible
 * @property {String} videoOverlayColor Color for video overlay
 */
Row.propTypes = {
    classes: shape({
        root: string,
        contained: string,
        fullBleed: string,
        inner: string,
        videoOverlay: string
    }),
    appearance: oneOf(['contained', 'full-width', 'full-bleed']),
    verticalAlignment: oneOf(['top', 'middle', 'bottom']),
    minHeight: string,
    backgroundColor: string,
    desktopImage: string,
    mobileImage: string,
    backgroundSize: string,
    backgroundPosition: string,
    backgroundAttachment: string,
    backgroundRepeat: bool,
    enableParallax: bool,
    parallaxSpeed: number,
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
    cssClasses: arrayOf(string),
    backgroundType: string,
    videoSrc: string,
    videoFallbackSrc: string,
    videoLoop: bool,
    videoPlayOnlyVisible: bool,
    videoLazyLoading: bool,
    videoOverlayColor: string
};

export default Row;
