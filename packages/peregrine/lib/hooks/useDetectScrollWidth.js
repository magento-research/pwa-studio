import { useLayoutEffect } from 'react';
import { makeVar } from '@apollo/client';

/**
 * A hook that will detect if there is a scrollbar will be added to the viewport and
 * will add its width value as a `--global-scrollbar-width` custom property to the body element,
 * which can be used to calculate the full width of the viewport.
 */

// Check if the browser will add a scrollbar to the viewport
const getScrollBarWidth = () => {
    const innerElement = document.createElement('div');
    innerElement.style.cssText = 'width:100%;height:200px';

    const outerElement = document.createElement('div');
    outerElement.style.cssText =
        'position:absolute;top:-50px;left:0px;visibility:hidden;width:50px;height:50px;overflow:hidden';
    outerElement.appendChild(innerElement);
    document.body.appendChild(outerElement);
    const widthWithoutScroll = innerElement.offsetWidth;
    outerElement.style.overflow = 'scroll';
    let widthWithScroll = innerElement.offsetWidth;
    if (widthWithoutScroll === widthWithScroll)
        widthWithScroll = innerElement.clientWidth;

    document.body.removeChild(outerElement);

    return widthWithoutScroll - widthWithScroll;
};

// Watching for body height changes, and setting custom property with scrollbar width, when scrollbar is present.
const createObserver = scrollBarWidth => {
    return new globalThis.ResizeObserver(entries => {
        for (const entry of entries) {
            if (entry.target.scrollHeight > globalThis.innerHeight) {
                entry.target.style.setProperty(
                    '--global-scrollbar-width',
                    `${scrollBarWidth}px`
                );
            } else {
                entry.target.style.setProperty(
                    '--global-scrollbar-width',
                    '0px'
                );
            }
        }
    });
};
// Using Apollo reactive var to store observer status, in order to add observer only once.
const isObserverActive = makeVar(false);

export const useDetectScrollWidth = () => {
    useLayoutEffect(() => {
        if (isObserverActive()) {
            return;
        }
        const scrollBarWidth = getScrollBarWidth();
        const observer =
            typeof globalThis.ResizeObserver !== 'undefined' &&
            scrollBarWidth !== 0
                ? createObserver(scrollBarWidth)
                : null;

        if (observer) {
            observer.observe(document.body);
            isObserverActive(true);
        }

        return () => {
            if (observer) {
                observer.disconnect();
                document.body.style.removeProperty('--global-scrollbar-width');
                isObserverActive(false);
            }
        };
    }, []);
};
