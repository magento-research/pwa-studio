/**
 * Implementation of our 'richContentTypes' target. This will gather
 * RichContentType declarations { importPath, contentType } from all
 * interceptors, and then tap `builtins.transformModules` to inject a module
 * transform into the build which is configured to generate an array of modules
 * to be imported and then exported.
 *
 * An instance of this class is made available when you use VeniaUI's
 * `richContentTypes` target.
 */
class RichContentTypeList {
    /** @hideconstructor */
    constructor(venia) {
        const registry = this;
        this._types = venia.esModuleArray({
            module: '@magento/venia-ui/lib/components/RichContent/richContentTypes.js',
            publish(targets) {
                targets.richContentTypes.call(registry);
            }
        });
    }
    /**
     * Add a rendering strategy to the RichContent component.
     *
     * @param {Object} strategy - Describes the rich content type to include
     * @param {string} strategy.importPath - Import path to the RichContentRenderer module. Should be package-absolute.
     * @param {string} strategy.contentType - Name that will be given to the imported renderer in generated code. This is used for debugging purposes.
     */
    add(type) {
        if (
            typeof type.contentType !== 'string' ||
            !type.contentType ||
            typeof type.importPath !== 'string' ||
            !type.importPath
        ) {
            throw new Error(
                `richContentTypes target: Argument is not a valid rich content type strategy.` +
                    ` A valid strategy must have a JSX element name as "contentType" and a resolvable path to the renderer module as "importPath".`
            );
        }
        const componentName = `${type.contentType}ContentType`;

        this._types.unshift(
            `import ${componentName} from '${type.importPath}';`
        );
    }
}

module.exports = RichContentTypeList;
