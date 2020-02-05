import { useCallback, useMemo, useState } from 'react';
import { useFieldState, useFieldApi } from 'informed';
import debounce from 'lodash.debounce';

/**
 *  Quantity Component talon.
 *
 * @param {Number}      props.initialValue the initial quantity value
 * @param {min}         props.min the minimum allowed quantity value
 * @param {Function}    props.onChange change handler to invoke when quantity value changes
 */
export const useQuantity = props => {
    const { initialValue, min, onChange } = props;

    const [prevQuantity, setPrevQuantity] = useState(initialValue);

    const quantityFieldApi = useFieldApi('quantity');
    const { value: quantity } = useFieldState('quantity');

    const isIncrementDisabled = useMemo(() => !quantity, [quantity]);

    // "min: 0" lets a user delete the value and enter a new one, but "1" is
    // actually the minimum value we allow to be set through decrement button.
    const isDecrementDisabled = useMemo(() => !quantity || quantity <= 1, [
        quantity
    ]);

    const debouncedOnChange = useMemo(() => debounce(onChange, 100), [
        onChange
    ]);

    const handleDecrement = useCallback(() => {
        const newQuantity = quantity - 1;
        quantityFieldApi.setValue(newQuantity);
        debouncedOnChange(newQuantity);
        setPrevQuantity(newQuantity);
    }, [debouncedOnChange, quantity, quantityFieldApi]);

    const handleIncrement = useCallback(() => {
        const newQuantity = quantity + 1;
        quantityFieldApi.setValue(newQuantity);
        debouncedOnChange(newQuantity);
        setPrevQuantity(newQuantity);
    }, [debouncedOnChange, quantity, quantityFieldApi]);

    const handleBlur = useCallback(() => {
        // Only submit the value change if it has changed.
        if (typeof quantity === 'number' && quantity != prevQuantity) {
            debouncedOnChange(quantity);
            setPrevQuantity(quantity);
        }
    }, [debouncedOnChange, prevQuantity, quantity]);

    const maskInput = useCallback(
        value => {
            if (value < min) return min;
            else return value;
        },
        [min]
    );

    return {
        isDecrementDisabled,
        isIncrementDisabled,
        handleBlur,
        handleDecrement,
        handleIncrement,
        maskInput
    };
};
