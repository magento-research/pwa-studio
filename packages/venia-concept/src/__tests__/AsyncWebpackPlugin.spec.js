/**
 * Node does not come with fetch but we are using node-fetch
 * which is a node implementation of fetch. jest-fetch-mock
 * is a mock of node-fetch that is inserted into global
 * object in scripts/fetch-mock.js.
 */

const AsyncWebpackPlugin = require('../AsyncWebpackPlugin');

const tapPromise = jest.fn();

const compiler = {
    hooks: {
        emit: {
            tapPromise
        }
    }
};

beforeEach(() => {
    process.env.MAGENTO_BACKEND_URL =
        'https://venia-cicd-lrov2hi-mfwmkrjfqvbjk.us-4.magentosite.cloud/';
    fetch.resetMocks();
});

test('The plugin prototype should have apply function in its Prototype', () => {
    expect(AsyncWebpackPlugin.prototype.hasOwnProperty('apply')).toBeTruthy();
});

test('tapPromise function should be called on compiler hooks', () => {
    const asyncPluginInstance = new AsyncWebpackPlugin(() => {});
    asyncPluginInstance.apply(compiler);

    expect(tapPromise.mock.calls[0][0]).toBe('AsyncWebpackPlugin');
    expect(tapPromise.mock.calls[0][1] instanceof Function).toBeTruthy();
});

test('If a callback is provided while creating the instance, it should be executed when the second parameter of tapPromise is executed', () => {
    const callback = jest.fn();
    const asyncPluginInstance = new AsyncWebpackPlugin(callback);
    asyncPluginInstance.apply(compiler);
    tapPromise.mock.calls[0][1].call();

    expect(callback).toHaveBeenCalledTimes(1);
});

test('If an invalid callback is provided while creating instance, instance creation should fail', () => {
    expect(() => new AsyncWebpackPlugin()).toThrow();
    expect(() => new AsyncWebpackPlugin(null)).toThrow();
});

test('If the callback throws error when executed, the plugin should not reject with error and resolve with nothing', () => {
    const callback = jest.fn(() => {
        throw new Error('Sample error');
    });
    const asyncPluginInstance = new AsyncWebpackPlugin(callback);
    asyncPluginInstance.apply(compiler);
    const returnValue = tapPromise.mock.calls[0][1].call();

    return returnValue.then(function() {
        expect(arguments).toHaveLength(1);
        expect(arguments[0]).toBe(undefined);
    });
});
