import { useCallback, useRef, useState } from 'react';

import { useDocumentListener } from './useDocumentListener';

/**
 * A React Hook for adding dropdown-related logic.
 *
 * @kind function
 *
 * @return {ReturnedObject} An object containing functions and values to add dropdown logic
 */
export const useDropdown = () => {
    const elementRef = useRef(null);
    const [expanded, setExpanded] = useState(false);

    // collapse on mousedown outside of this element
    const maybeCollapse = useCallback(
        ({ target }) => {
            if (!elementRef.current.contains(target)) {
                setExpanded(false);
            }
        },
        [elementRef.current]
    );

    // add listener to document, as an effect
    useDocumentListener('mousedown', maybeCollapse);

    /**
     * The object returned contains the pieces needed to add the dropdown logic to your components
     * 
     * @typedef ReturnedObject
     * @type {Object}
     * @property {ref} elementRef - A [ref]{@link https://reactjs.org/docs/refs-and-the-dom.html} object for attaching to React elements
     * @property {bool} expanded - The value of the `expanded` state
     * @property {function} setExpanded - [State Hook]{@link https://reactjs.org/docs/hooks-state.html} function for setting the expanded state
     */
    return {
        elementRef,
        expanded,
        setExpanded
    };
};
