const path = require('path');
const buildpackName = require('../../package.json').name;

/**
 * @typedef {function(TransformRequest)} addTransform
 * Add a request to transform a file in the build. This function is passed as
 * the first argument to an interceptor of the `transformModules` target.
 *
 * @param {TransformRequest} req - Instruction object for the requested
 * transform, including the transform to apply, the target source code, and
 * other options.
 *
 * @returns null
 */

/** @enum {string} */
const TransformType = {
    /**
     * Process the _source code_ of `fileToTransform` through the
     * `transformModule` as text. When applying a `source` TransformRequest,
     * Buildpack will use the `transformModule` as a [Webpack
     * loader](https://v4.webpack.js.org/api/loaders/), so it must implement
     * that interface. Any Webpack loader can be used as a `transformModule`
     * for `source` TransformRequests.
     *
     * `source` transforms are fast and can run on source code of any language,
     * but they aren't as precise and safe as AST-type transforms when modifying
     * code.
     */
    source: 'source',
    /**
     * Process the _abstract syntax tree_ of the ES module specified by
     * `fileToTransform` through the `transformModule` as a [Babel
     * AST](https://github.com/babel/babel/blob/master/packages/babel-parser/ast/spec.md).
     * When applying a `babel` TransformRequest, Buildpack will use the
     * `transformModule` as a [Babel
     * plugin](https://github.com/jamiebuilds/babel-handbook), so it must
     * implement that interface. Any Babel plugin can be used as a
     * `transformModule` for `babel` TransformRequests.
     *
     * `babel` transforms are powerful and versatile, giving the transformer
     * much more insight into the structure of the source code to modify.
     * However, they are slower than `source` transforms, and they can only
     * work on ES Modules.
     */
    babel: 'babel'
};

/**
 * @typedef {Object} TransformRequest
 * Instruction for configuring Webpack to apply custom transformations to one
 * particular file. The [`configureWebpack()` function]{@link /pwa-buildpack/reference/configure-webpack/}
 * gathers TransformRequests from all interceptors of the `transformModules`
 * target and turns them into a configuration of Webpack [module
 * rules](https://v4.webpack.js.org/configuration/module/#modulerules).
 *
 * @prop {TransformType} type - The type of transformation to apply.
 * @prop {string} fileToTransform - Resolvable path to the file to be transformed itself, the same path that you'd use in `import` or `require()`.
 * @prop {string} transformModule - Absolute path to the Node module that will actually be doing the transforming. This path may be resolved using different
 * rules at different times, so it's best for this path to always be absolute.
 * @prop {object} [options] - Config values to send to the transform function.
 *   _Note: Options should be serializable to JSON as Webpack loader options
 *   and/or Babel plugin options.._
 */

/**
 * Configuration builder for module transforms. Accepts TransformRequests
 * and emits loader config objects for Buildpack's custom transform loaders.
 *
 * Understands all transform types and normalizes them correctly. Mostly this
 * involves resolving the file paths using Webpack or Node resolution rules.
 *
 * For some special types of transform, ModuleTransformConfig has helpers to
 * apply the requested transforms itself. But `configureWebpack` consumes most
 * of the transforms by calling `transformConfig.collect()` on this object,
 * which yields a structured object that configureWebpack can use to set up
 * loader and plugin configuration.
 */
class ModuleTransformConfig {
    /**
     *
     * @static
     * @constructs
     * @param {MagentoResolver} resolver - Resolver to use when finding real paths of
     * modules requested.
     * @param {string} localProjectName - The name of the PWA project being built, taken from the package.json `name` field.
     */

    constructor(resolver, localProjectName) {
        this._resolver = resolver;
        this._localProjectName = localProjectName;
        // TODO: Currently nothing changes the resolver, but it will definitely
        // be necessary to deal with this in the future. Trust me, you want to
        // make sure successive transforms obey the rules that their predecessor
        // transforms have set up.
        this._resolverChanges = [];
        this._needsResolved = [];
    }
    /**
     * @borrows addTransform as add
     */
    add(request) {
        if (!TransformType.hasOwnProperty(request.type)) {
            throw this._traceableError(
                `Unknown request type '${
                    request.type
                }' in TransformRequest: ${JSON.stringify(request)}`
            );
        }
        this._needsResolved.push(this._resolveOrdinary(request));
    }
    /**
     * Resolve paths and emit as JSON.
     *
     * @returns {object} Configuration object
     */
    async toLoaderOptions() {
        const byType = Object.values(TransformType).reduce(
            (grouped, type) => ({
                ...grouped,
                [type]: {}
            }),
            {}
        );
        // Resolver still may need updating! Updates should be in order.
        for (const resolverUpdate of this._resolverChanges) {
            await resolverUpdate();
        }
        // Now the requests can be made using the finished resolver!
        await Promise.all(
            this._needsResolved.map(async doResolve => {
                const req = await doResolve();
                // Split them up by the transform module to use.
                // Several requests will share one transform instance.
                const { type, transformModule, fileToTransform } = req;
                const xformsForType = byType[type];
                const filesForXform =
                    xformsForType[transformModule] ||
                    (xformsForType[transformModule] = {});
                const requestsForFile =
                    filesForXform[fileToTransform] ||
                    (filesForXform[fileToTransform] = []);
                requestsForFile.push(req);
            })
        );
        return JSON.parse(JSON.stringify(byType));
    }
    /**
     * Prevent modules from transforming files from other modules.
     * Preserves encapsulation and maintainability.
     * @private
     */
    _assertAllowedToTransform({ requestor, fileToTransform }) {
        if (
            !this._isLocal(requestor) && // Local project can modify anything
            !this._isBuiltin(requestor) && // Buildpack itself can modify anything
            !this._isTrustedExtensionVendor(requestor) && // Trusted extension vendors can modify anything
            !fileToTransform.startsWith(requestor)
        ) {
            throw this._traceableError(
                `Invalid fileToTransform path "${fileToTransform}": Extensions are not allowed to provide fileToTransform paths outside their own codebase! This transform request from "${requestor}" must provide a path to one of its own modules, starting with "${requestor}".`
            );
        }
    }
    _isBuiltin(requestor) {
        return requestor === buildpackName;
    }
    _isLocal(requestor) {
        return requestor === this._localProjectName;
    }
    _isTrustedExtensionVendor(requestor) {
        const vendors = this._getTrustedExtensionVendors();
        const requestorVendor = requestor.split('/')[0];
        return requestorVendor.length > 0 && vendors.includes(requestorVendor);
    }
    _getTrustedExtensionVendors() {
        const env = process.env.TRUSTED_VENDORS;
        return env ? env.split(',') : [];
    }
    _traceableError(msg) {
        const capturedError = new Error(`ModuleTransformConfig: ${msg}`);
        Error.captureStackTrace(capturedError, ModuleTransformConfig);
        return new Error(capturedError.stack);
    }
    // Must throw a synchronous error so that .add() can throw early on a
    // disallowed module. So this is not an async function--instead it deals in
    // promise-returning function directly.
    _resolveOrdinary(request) {
        this._assertAllowedToTransform(request);
        const transformModule = this._resolveNode(request, 'transformModule');
        return () =>
            this._resolveWebpack(request, 'fileToTransform').then(
                fileToTransform => ({
                    ...request,
                    fileToTransform,
                    transformModule
                })
            );
    }
    async _resolveWebpack(request, prop) {
        const requestPath = request[prop];
        // make module-absolute if relative
        const toResolve = requestPath.startsWith('.')
            ? path.join(request.requestor, requestPath)
            : requestPath;
        // Capturing in the sync phase so that a resolve failure is traceable.
        const resolveError = this._traceableError(
            `could not resolve ${prop} "${toResolve}" from requestor ${
                request.requestor
            } using Webpack rules.`
        );
        try {
            const resolved = await this._resolver.resolve(toResolve);
            return resolved;
        } catch (e) {
            resolveError.originalErrors = [e];
            throw resolveError;
        }
    }
    _resolveNode(request, prop) {
        let nodeModule;
        try {
            nodeModule = require.resolve(request[prop]);
        } catch (e) {
            try {
                nodeModule = require.resolve(
                    path.join(request.requestor, request[prop])
                );
            } catch (innerE) {
                const resolveError = this._traceableError(
                    `could not resolve ${prop} ${
                        request[prop]
                    } from requestor ${request.requestor} using Node rules.`
                );
                resolveError.originalErrors = [e, innerE];
                throw resolveError;
            }
        }
        return nodeModule;
    }
}

module.exports = ModuleTransformConfig;
