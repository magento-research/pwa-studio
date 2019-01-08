import actions from '../actions';

const payload = 'PAYLOAD';
const error = new Error('ERROR');

test('addItem.request.toString() returns the proper action type', () => {
    expect(actions.addItem.request.toString()).toBe('CART/ADD_ITEM/REQUEST');
});

test('addItem.request() returns a proper action object', () => {
    expect(actions.addItem.request(payload)).toEqual({
        type: 'CART/ADD_ITEM/REQUEST',
        payload
    });
});

test('addItem.receive.toString() returns the proper action type', () => {
    expect(actions.addItem.receive.toString()).toBe('CART/ADD_ITEM/RECEIVE');
});

test('addItem.receive() returns a proper action object', () => {
    expect(actions.addItem.receive(payload)).toEqual({
        type: 'CART/ADD_ITEM/RECEIVE',
        payload
    });
    expect(actions.addItem.receive(error)).toEqual({
        type: 'CART/ADD_ITEM/RECEIVE',
        payload: error,
        error: true
    });
});

test('removeItem.request.toString() returns the proper action type', () => {
    expect(actions.removeItem.request.toString()).toBe(
        'CART/REMOVE_ITEM/REQUEST'
    );
});

test('removeItem.request() returns a proper action object', () => {
    expect(actions.removeItem.request(payload)).toEqual({
        type: 'CART/REMOVE_ITEM/REQUEST',
        payload
    });
});

test('removeItem.receive.toString() returns the proper action type', () => {
    expect(actions.removeItem.receive.toString()).toBe(
        'CART/REMOVE_ITEM/RECEIVE'
    );
});

test('removeItem.receive() returns a proper action object', () => {
    expect(actions.removeItem.receive(payload)).toEqual({
        type: 'CART/REMOVE_ITEM/RECEIVE',
        payload
    });
    expect(actions.removeItem.receive(error)).toEqual({
        type: 'CART/REMOVE_ITEM/RECEIVE',
        payload: error,
        error: true
    });
});

test('getGuestCart.request.toString() returns the proper action type', () => {
    expect(actions.getGuestCart.request.toString()).toBe(
        'CART/GET_GUEST_CART/REQUEST'
    );
});

test('getGuestCart.request() returns a proper action object', () => {
    expect(actions.getGuestCart.request(payload)).toEqual({
        type: 'CART/GET_GUEST_CART/REQUEST',
        payload
    });
});

test('getGuestCart.receive.toString() returns the proper action type', () => {
    expect(actions.getGuestCart.receive.toString()).toBe(
        'CART/GET_GUEST_CART/RECEIVE'
    );
});

test('getGuestCart.receive() returns a proper action object', () => {
    expect(actions.getGuestCart.receive(payload)).toEqual({
        type: 'CART/GET_GUEST_CART/RECEIVE',
        payload
    });
    expect(actions.getGuestCart.receive(error)).toEqual({
        type: 'CART/GET_GUEST_CART/RECEIVE',
        payload: error,
        error: true
    });
});

test('getDetails.request.toString() returns the proper action type', () => {
    expect(actions.getDetails.request.toString()).toBe(
        'CART/GET_DETAILS/REQUEST'
    );
});

test('getDetails.request() returns a proper action object', () => {
    expect(actions.getDetails.request(payload)).toEqual({
        type: 'CART/GET_DETAILS/REQUEST',
        payload
    });
});

test('getDetails.receive.toString() returns the proper action type', () => {
    expect(actions.getDetails.receive.toString()).toBe(
        'CART/GET_DETAILS/RECEIVE'
    );
});

test('getDetails.receive() returns a proper action object', () => {
    expect(actions.getDetails.receive(payload)).toEqual({
        type: 'CART/GET_DETAILS/RECEIVE',
        payload
    });
    expect(actions.getDetails.receive(error)).toEqual({
        type: 'CART/GET_DETAILS/RECEIVE',
        payload: error,
        error: true
    });
});

test('updateItem.request.toString() returns the proper action type', () => {
    expect(actions.updateItem.request.toString()).toBe(
        'CART/UPDATE_ITEM/REQUEST'
    );
});

test('updateItem.request() returns a proper action object', () => {
    expect(actions.updateItem.request(payload)).toEqual({
        type: 'CART/UPDATE_ITEM/REQUEST',
        payload
    });
});

test('updateItem.receive.toString() returns the proper action type', () => {
    expect(actions.updateItem.receive.toString()).toBe(
        'CART/UPDATE_ITEM/RECEIVE'
    );
});

test('updateItem.receive() returns a proper action object', () => {
    expect(actions.updateItem.receive(payload)).toEqual({
        type: 'CART/UPDATE_ITEM/RECEIVE',
        payload
    });
    expect(actions.updateItem.receive(error)).toEqual({
        type: 'CART/UPDATE_ITEM/RECEIVE',
        payload: error,
        error: true
    });
});

test('openEditPanel.request.toString() returns the proper action type', () => {
    expect(actions.openEditPanel.request.toString()).toBe(
        'CART/OPEN_EDIT_PANEL/REQUEST'
    );
});

test('openEditPanel.request() returns a proper action object', () => {
    expect(actions.openEditPanel.request(payload)).toEqual({
        type: 'CART/OPEN_EDIT_PANEL/REQUEST',
        payload
    });
});

test('openEditPanel.receive.toString() returns the proper action type', () => {
    expect(actions.openEditPanel.receive.toString()).toBe(
        'CART/OPEN_EDIT_PANEL/RECEIVE'
    );
});

test('openEditPanel.receive() returns a proper action object', () => {
    expect(actions.openEditPanel.receive(payload)).toEqual({
        type: 'CART/OPEN_EDIT_PANEL/RECEIVE',
        payload
    });
    expect(actions.openEditPanel.receive(error)).toEqual({
        type: 'CART/OPEN_EDIT_PANEL/RECEIVE',
        payload: error,
        error: true
    });
});

test('hideEditPanel.request.toString() returns the proper action type', () => {
    expect(actions.hideEditPanel.request.toString()).toBe(
        'CART/HIDE_EDIT_PANEL/REQUEST'
    );
});

test('hideEditPanel.request() returns a proper action object', () => {
    expect(actions.hideEditPanel.request(payload)).toEqual({
        type: 'CART/HIDE_EDIT_PANEL/REQUEST',
        payload
    });
});

test('hideEditPanel.receive.toString() returns the proper action type', () => {
    expect(actions.hideEditPanel.receive.toString()).toBe(
        'CART/HIDE_EDIT_PANEL/RECEIVE'
    );
});

test('hideEditPanel.receive() returns a proper action object', () => {
    expect(actions.hideEditPanel.receive(payload)).toEqual({
        type: 'CART/HIDE_EDIT_PANEL/RECEIVE',
        payload
    });
    expect(actions.hideEditPanel.receive(error)).toEqual({
        type: 'CART/HIDE_EDIT_PANEL/RECEIVE',
        payload: error,
        error: true
    });
});
