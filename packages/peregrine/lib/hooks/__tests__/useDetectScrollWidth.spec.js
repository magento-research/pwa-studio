import { renderHook } from '@testing-library/react-hooks/dom';
import { useDetectScrollWidth } from '../useDetectScrollWidth';

const observeMock = jest.fn();

const resizeObserverMock = jest.fn().mockImplementation(() => ({
    observe: observeMock,
    disconnect: jest.fn()
}));

const elementOffsetWidth = jest.spyOn(
    HTMLElement.prototype,
    'offsetWidth',
    'get'
);
const elementClientWidth = jest.spyOn(
    HTMLElement.prototype,
    'clientWidth',
    'get'
);
globalThis.ResizeObserver = resizeObserverMock;

test('Resize Observer created one time', () => {
    elementOffsetWidth.mockReturnValueOnce(100).mockReturnValueOnce(110);
    elementClientWidth.mockReturnValueOnce(100);

    renderHook(() => useDetectScrollWidth());
    renderHook(() => useDetectScrollWidth());

    expect(resizeObserverMock).toHaveBeenCalledTimes(1);
    expect(observeMock).toHaveBeenNthCalledWith(1, document.body);
});

test('Resize Observer is not created when no scroll', () => {
    elementOffsetWidth.mockReturnValue(100);
    elementClientWidth.mockReturnValue(100);

    renderHook(() => useDetectScrollWidth());

    expect(resizeObserverMock).not.toHaveBeenCalled();
    expect(observeMock).not.toHaveBeenCalled();
});
