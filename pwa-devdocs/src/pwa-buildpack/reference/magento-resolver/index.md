---
title: MagentoResolver
---

An adapter that configures Webpack to resolve assets using Magento PWA conventions.

This module generates a configuration object used in the [`resolve`] property of a Webpack config.
The configuration object tells Webpack how to traverse the filesystem structure for assets required in source files.

Currently, MagentoResolver does very little, but it's likely that the Magento development environment will require custom resolution rules in the future; this utility sets the precedent of the API for delivering those rules.

## API

### `configure(options)`

**Parameters:**

* `options:` - Configuration object that describes where the PWA storefront folders are located. Must have a `root` property set to the context (root directory) of the project.

**Return:**

A [Promise] configuration type for webpack.

{: .bs-callout .bs-callout-info}
**Note:**
`MagentoResolver.configure()` is asynchronous.

## Example

In `webpack.config.js`:

``` js
const buildpack = require('@magento/pwa-buildpack');
const MagentoResolver = buildpack.WebpackTools.MagentoResolver;

module.exports = async env => {
    const config {
        /* webpack entry, output, rules, etc */


        resolve: await MagentoResolver.configure({
            paths: {
                root: __dirname
            }
        })

    };

    return config;
}
```



{: .bs-callout .bs-callout-tip}
The special `__dirname` variable in Node always refers to the directory containing the currently executing script file.
This is different from the "working directory", which is the current directory of the shell when the current process was started.

{: .bs-callout .bs-callout-info}
**Note:**
The example provided uses the newer, cleaner `async/await` syntax instead of using Promises directly.


[`resolve`]: https://webpack.js.org/configuration/resolve/
[Promise]: https://webpack.js.org/configuration/configuration-types/#exporting-a-promise
