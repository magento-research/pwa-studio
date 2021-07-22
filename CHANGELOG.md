# Release 11.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 11.0.0._
_For older release notes, see [PWA Studio releases][]._

## Table of contents

-   [What's new in 11.0.0](#whats-new-in-1100)
-   [Pull requests merged in this release](#pull-requests-merged-in-this-release)
-   [Known issues](#known-issues)
-   [Upgrading from a previous version](#upgrading-from-a-previous-version)

## What's new in 11.0.0

PWA Studio 11.0.0 contains new features, refactors, bug fixes, and various improvements.
This version is compatible with **Magento 2.4.3**.

### Wish List

Started in PWA Studio 9.0.0 with basic features and functionality, Wish List is feature complete in this release and implemented in the Venia storefront template.
This feature gives shoppers the ability to create and manage lists of items they may want to purchase in the future using Wish List specific components and logic.

The following Wish List features have been implemented in this release:

- Add an item to a wish list from the product page
- Add an item to a wish list from the category page
- Add an item to a wish list from the cart page
- Add an item to the cart from a wish list
- Support for multiple wish lists
- Edit the name and visibility of a wish list

#### Pull Requests

| Description                                                                                                | PR        |
| ---------------------------------------------------------------------------------------------------------- | --------- |
| Removed the use of mock data for Wish List and connected to real GraphQL data                              | [#3041][] |
| Implemented adding an item to a Wish List from the product page                                            | [#3048][] |
| Implemented the ability to edit a Wish List's name and visibility                                          | [#3049][] |
| Implemented adding an item to a Wish List from the category page                                           | [#3105][] |
| Fixed a Wish List bug that prevented you from removing a product if the Wish List had 2 or more products   | [#3121][] |
| Implemented adding an item to a Wish List from the cart                                                    | [#3130][] |
| Implemented adding an item to the cart from a Wish List                                                    | [#3170][] |
| Created a re-usable hook for Wish List logic for re-use in various components                              | [#3182][] |
| Fixed a Wish List bug that allowed users to collapse the Wish List section when it only had a single entry | [#3184][] |
| Implemented adding an item from the cart to multiple wishlists                                             | [#3207][] |
| Added message to display when the Wish List is empty                                                       | [#3228][] |
| Fixed a Wish List bug in the Create Wish List dialog that prevented users from creating a new Wish List    | [#3242][] |
| Cleaned up Multi Wish List code                                                                            | [#3246][] |
| Created a single Wish List button component to use throughout the application                              | [#3249][] |

[#3242]: https://github.com/magento/pwa-studio/pull/3242
[#3184]: https://github.com/magento/pwa-studio/pull/3184
[#3249]: https://github.com/magento/pwa-studio/pull/3249
[#3228]: https://github.com/magento/pwa-studio/pull/3228
[#3182]: https://github.com/magento/pwa-studio/pull/3182
[#3121]: https://github.com/magento/pwa-studio/pull/3121
[#3207]: https://github.com/magento/pwa-studio/pull/3207
[#3170]: https://github.com/magento/pwa-studio/pull/3170
[#3130]: https://github.com/magento/pwa-studio/pull/3130
[#3105]: https://github.com/magento/pwa-studio/pull/3105
[#3048]: https://github.com/magento/pwa-studio/pull/3048
[#3041]: https://github.com/magento/pwa-studio/pull/3041
[#3049]: https://github.com/magento/pwa-studio/pull/3049
[#3246]: https://github.com/magento/pwa-studio/pull/3246
### Virtual Product types

This release contains initial work to support Virtual Product types.
In this initial implementation, you can browse and view Virtual Product types in your storefront, but
you will not be able to add these types to the cart.

#### Pull Requests

| Description                                                   | PR        |
| ------------------------------------------------------------- | --------- |
| Implemented ability to browse and view Virtual Products types | [#3052][] |

[#3052]: https://github.com/magento/pwa-studio/pull/3052

### Extensible payment methods

Two new extensions points for the Venia UI package have been added in this release.
The [`editablePaymentTypes`][] target lets you add new editable payment methods to your storefronts, and
the [`summaryPagePaymentTypes`][] target lets you add a custom payment summary in the checkout summary page.

[`editablepaymenttypes`]: https://magento.github.io/pwa-studio/venia-ui/reference/targets/#editablepaymenttypes--tapablesynchook
[`summarypagepaymenttypes`]: https://magento.github.io/pwa-studio/venia-ui/reference/targets/#summarypagepaymenttypes--tapablesynchook

#### Pull Requests

| Description                                                 | PR        |
| ----------------------------------------------------------- | --------- |
| Refactored payment methods and created new extension points | [#3103][] |

[#3103]: https://github.com/magento/pwa-studio/pull/3103

### Accessibility

Keyboard focus and navigation now work as expected on the layered navigation UI feature.
With the Filter modal open, users can press the `Tab` key to navigate across filter items such as "Price" and "Color".
On filter items, the user can press `Space` to open and navigate through the options with `Tab`.
Options are toggled using the `Space` key.

| Description                                                     | PR        |
| --------------------------------------------------------------- | --------- |
| Added keyboard focus and adjusted the way tab order should work | [#3034][] |

[#3034]: https://github.com/magento/pwa-studio/pull/3034

### Layered Navigation

To help deliver a better customer experience, filtering products by their attributes on the product listing page has been optimized for desktop views.
The changes included in this release focuses on improving how the user interacts with the layered navigation feature when filtering products.
For example, filter options can be neatly collapsed and the product listing is automatically updated whenever the user selects a filter option.

#### Pull Requests

| Description                                                        | PR        |
| ------------------------------------------------------------------ | --------- |
| Optimized the layered navigation feature for the desktop           | [#3137][] |

[#3137]: https://github.com/magento/pwa-studio/pull/3137

### Performance and optimization updates

This release also contains a configuration change for UPWARD so that it can use the `gzip` content encoding for HTML requests.

#### Pull Requests

| Description                                                        | PR        |
| ------------------------------------------------------------------ | --------- |
| Configured UPWARD to use `gzip` content encoding for HTML requests | [#3255][] |

[#3255]: https://github.com/magento/pwa-studio/pull/3255

### Documentation updates

Since the last release, the documentation site has published new topics and updated an existing topic.

#### New topics

- [Upgrading versions](https://magento.github.io/pwa-studio/technologies/upgrading-versions/)
- [Change static assets directory](https://magento.github.io/pwa-studio/tutorials/intercept-a-target/change-static-assets-directory/)
- [Extension development](https://magento.github.io/pwa-studio/tutorials/extension-development/)
- [Modify code with Targetables](https://magento.github.io/pwa-studio/tutorials/targetables/)
- Targetable API reference
  - [`TargetableModule`](https://magento.github.io/pwa-studio/pwa-buildpack/reference/targetables/TargetableModule/)
  - [`TargetableESModule`](https://magento.github.io/pwa-studio/pwa-buildpack/reference/targetables/TargetableESModule/)
  - [`TargetableESModuleArray`](https://magento.github.io/pwa-studio/pwa-buildpack/reference/targetables/TargetableESModuleArray/)
  - [`TargetableESModuleObject`](https://magento.github.io/pwa-studio/pwa-buildpack/reference/targetables/TargetableESModuleObject/)
  - [`TargetableReactComponent`](https://magento.github.io/pwa-studio/pwa-buildpack/reference/targetables/TargetableReactComponent/)
  - [`TargetableSet`](https://magento.github.io/pwa-studio/pwa-buildpack/reference/targetables/TargetableSet/)
  - [`SingleImportStatement`](https://magento.github.io/pwa-studio/pwa-buildpack/reference/targetables/SingleImportStatement/)

#### Updated topics

- [PWA Studio Overview](https://magento.github.io/pwa-studio/technologies/overview/)

#### Pull Requests

| Description                                                                                                            | PR        |
| ---------------------------------------------------------------------------------------------------------------------- | --------- |
| Published a new topic that provides guidance and best practices for upgrading to new versions                          | [#3231][] |
| Published a new tutorial that shows how you can change the static assets directory used in your project                | [#3219][] |
| Reorganize and refactor the navigation for the Overview sections                                                       | [#2926][] |
| Published a new topic that provides general guidance for extension development                                         | [#2995][] |
| Published a new tutorial that provides general guidance for working with Targetables along with a set of API reference | [#2966][] |
| Updated the TargetableModule.spliceSource() example and added debugging tips                                           | [#3168][] |
| Fixed a code sample error on the TargetableReactComponent page                                                         | [#3202][] |

[#3231]: https://github.com/magento/pwa-studio/pull/3231
[#3219]: https://github.com/magento/pwa-studio/pull/3219
[#2926]: https://github.com/magento/pwa-studio/pull/2926
[#2995]: https://github.com/magento/pwa-studio/pull/2995
[#2966]: https://github.com/magento/pwa-studio/pull/2966
[#3202]: https://github.com/magento/pwa-studio/pull/3202
[#3168]: https://github.com/magento/pwa-studio/pull/3168

### Bug fixes

The following bugs have been fixed in 11.0.0.

| Description                                                                                                         | PR        |
| ------------------------------------------------------------------------------------------------------------------- | --------- |
| Braintree error related to the use of UK addresses                                                                  | [#3251][] |
| GraphQL bug related to line comments inside the query                                                               | [#3196][] |
| Bug in the filter modal where certain icons would not be visible                                                    | [#3171][] |
| Checkout bug that prevented you from changing your billing address when you pay with Check/Money Order              | [#3239][] |
| Project bug that prevented the installation of dependencies                                                         | [#3106][] |
| Scaffolding bug where the `DEBUG_PROJECT_CREATION` flag does not exclude optional extension packages                | [#3086][] |
| Checkout bug that prevented validation of region codes across different countries                                   | [#3133][] |
| Checkout bug that prevented you from placing another order after the initial order was declined                     | [#3091][] |
| Scaffolding bug that prevented the `yarn build:dev` command working                                                 | [#3047][] |
| Checkout bug where the mobile view of the checkout page would not scroll to the appropriate spot after each step    | [#3055][] |
| Checkout page bug where it would not pick up the region code provided in the cart page under specific circumstances | [#3093][] |
| Service worker bug related to URL origin for the service worker itself                                              | [#3191][] |
| Sidebar menu bug related to filtering                                                                               | [#3210][] |
| Routing bug when a user navigates to the `/undefined` route                                                         | [#3230][] |
| Carousel bug showing duplicate thumbnails                                                                           | [#3186][] |
| Toast component bug where it did not use the font-family token                                                      | [#3164][] |
| CMS page bug where stale content would never get updated                                                            | [#3131][] |
| Category sort bug where the default backend sort order would not be used                                            | [#3125][] |
| Search page bug where the browser back button would not work                                                        | [#3119][] |
| Babel JSX plugin dependency mismatch                                                                                | [#3098][] |
| Category page bug where the browser back button would not work                                                      | [#3078][] |
| Shipping Information form bug where guests would get stuck in the 'Loading Regions...' state                        | [#3142][] |

[#3251]: https://github.com/magento/pwa-studio/pull/3251
[#3196]: https://github.com/magento/pwa-studio/pull/3196
[#3171]: https://github.com/magento/pwa-studio/pull/3171
[#3239]: https://github.com/magento/pwa-studio/pull/3239
[#3106]: https://github.com/magento/pwa-studio/pull/3106
[#3086]: https://github.com/magento/pwa-studio/pull/3086
[#3133]: https://github.com/magento/pwa-studio/pull/3133
[#3091]: https://github.com/magento/pwa-studio/pull/3091
[#3047]: https://github.com/magento/pwa-studio/pull/3047
[#3055]: https://github.com/magento/pwa-studio/pull/3055
[#3093]: https://github.com/magento/pwa-studio/pull/3093
[#3191]: https://github.com/magento/pwa-studio/pull/3191
[#3210]: https://github.com/magento/pwa-studio/pull/3210
[#3230]: https://github.com/magento/pwa-studio/pull/3230
[#3186]: https://github.com/magento/pwa-studio/pull/3186
[#3164]: https://github.com/magento/pwa-studio/pull/3164
[#3131]: https://github.com/magento/pwa-studio/pull/3131
[#3125]: https://github.com/magento/pwa-studio/pull/3125
[#3119]: https://github.com/magento/pwa-studio/pull/3119
[#3098]: https://github.com/magento/pwa-studio/pull/3098
[#3078]: https://github.com/magento/pwa-studio/pull/3078
[#3142]: https://github.com/magento/pwa-studio/pull/3142

### Cypress tests

[Cypress](https://www.cypress.io/) is an end-to-end testing suite written in JavaScript.
This release adds this framework to the PWA Studio project to increase testing automation and reduce the time spent on manual testing.
This will enable the team to release new versions faster and more often.

Integration tests for PageBuilder and the new Wish List feature are included in this release.
These tests are part of Venia's integration tests.
If you want to use these tests in your own CICD pipeline, they can be found in [this directory][].

[this directory]: https://github.com/magento/pwa-studio/tree/v11.0.0/venia-integration-tests/src/tests/integrationTests/pageBuilder

#### Pull Requests

| Description                                   | PR        |
| --------------------------------------------- | --------- |
| Configured the project to use Cypress         | [#3082][] |
| Added the Cypress Visual Testing plugin       | [#3136][] |
| Added tests for the Wish List feature         | [#3146][] |
| Added tests for PageBuilder banner component  | [#3178][] |
| Added tests for PageBuilder buttons           | [#3194][] |
| Added tests for PageBuilder images            | [#3195][] |
| Added tests for multiple Wish Lists           | [#3218][] |
| Updated the Cypress tests directory structure | [#3253][] |

[#3082]: https://github.com/magento/pwa-studio/pull/3082
[#3136]: https://github.com/magento/pwa-studio/pull/3136
[#3146]: https://github.com/magento/pwa-studio/pull/3146
[#3178]: https://github.com/magento/pwa-studio/pull/3178
[#3194]: https://github.com/magento/pwa-studio/pull/3194
[#3218]: https://github.com/magento/pwa-studio/pull/3218
[#3253]: https://github.com/magento/pwa-studio/pull/3253
[#3195]: https://github.com/magento/pwa-studio/pull/3195

### Refactors

| Description                                                                            | PR                  |
| -------------------------------------------------------------------------------------- | ------------------- |
| Moved the `graphql-cli-validate-magento-pwa-queries` package into the `@magento` scope | [#3198]             |
| Remove `window` references from Venia                                                  | [#2991][] [#3087][] |
| Refactored the **Add to Cart** feature to use the generic `AddProductsToCart` mutation | [#3092]             |
| Removed the Adobe Client Data Layer by default for scaffolded projects                 | [#3215]             |

[#3198]: https://github.com/magento/pwa-studio/pull/3198
[#2991]: https://github.com/magento/pwa-studio/pull/2991
[#3087]: https://github.com/magento/pwa-studio/pull/3087
[#3092]: https://github.com/magento/pwa-studio/pull/3092
[#3215]: https://github.com/magento/pwa-studio/pull/3215

## Known issues

- The `yarn watch` process may run out of memory if left running for an extended amount of time.
  If an error occurs because of this, restart the watcher.

## Upgrading from a previous version

Use the steps outlined in this section to update your [scaffolded project][] from 10.0.0 to 11.0.0.
See [Upgrading versions][] for more information about upgrading between PWA Studio versions.

[scaffolded project]: https://magento.github.io/pwa-studio/tutorials/pwa-studio-fundamentals/project-setup/
[upgrading versions]: https://magento.github.io/pwa-studio/technologies/upgrading-versions/

### Update dependencies

Open your `package.json` file and update the PWA Studio package dependencies to the versions associated with this release.
The following table lists the latest versions of each package as of 11.0.0.
Versions that are in **bold** indicate a version change for this release.

**Note:**
Your project may not depend on some of the packages listed on this table.

| Package                         | Latest version |
| ------------------------------- | -------------- |
| `babel-preset-peregrine`        | 1.1.0          |
| `create-pwa`                    | **1.3.1**      |
| `upward-security-headers`       | **1.0.4**      |
| `venia-adobe-data-layer`        | **1.0.1**      |
| `venia-sample-backends`         | **0.0.4**      |
| `venia-sample-language-packs`   | **0.0.4**      |
| `venia-sample-payments-checkmo` | **0.0.2**      |
| `pagebuilder`                   | **6.0.0**      |
| `peregrine`                     | **11.0.0**     |
| `pwa-buildpack`                 | **10.0.0**     |
| `upward-js`                     | 5.1.0          |
| `upward-spec`                   | 5.0.0          |
| `venia-concept`                 | **11.0.0**     |
| `venia-ui`                      | **8.0.0**      |
| `magento2-upward-connector`     | 1.2.0          |
| `upward-php`                    | 1.1.5          |

### Update template files

The following template files contain updates in 11.0.0:

- [.eslintrc.js](https://github.com/magento/pwa-studio/blob/v11.0.0/packages/venia-concept/.eslintrc.js)
- [.gitignore](https://github.com/magento/pwa-studio/blob/v11.0.0/packages/venia-concept/.gitignore)
- [.graphqlconfig](https://github.com/magento/pwa-studio/blob/v11.0.0/packages/venia-concept/.grpahqlconfig)
- [package.json](https://github.com/magento/pwa-studio/blob/v11.0.0/packages/venia-concept/package.json)
- [src/.storybook/config.js](https://github.com/magento/pwa-studio/blob/v11.0.0/packages/venia-concept/src/.storybook/config.js)
- [src/.storybook/webpack.config.js](https://github.com/magento/pwa-studio/blob/v11.0.0/packages/venia-concept/src/.storybook/webpack.config.js)
- [src/ServiceWorker/registerRoutes.js](https://github.com/magento/pwa-studio/blob/v11.0.0/packages/venia-concept/src/ServiceWorker/registerRoutes.js)
- [src/drivers.js](https://github.com/magento/pwa-studio/blob/v11.0.0/packages/venia-concept/src/drivers.js)
- [src/index.js](https://github.com/magento/pwa-studio/blob/v11.0.0/packages/venia-concept/src/index.js)
- [src/registerSW.js](https://github.com/magento/pwa-studio/blob/v11.0.0/packages/venia-concept/src/registerSW.js)
- [webpack.config.js](https://github.com/magento/pwa-studio/blob/v11.0.0/packages/venia-concept/webpack.config.js)

If you did not make any modifications to these files, you can copy and paste the new content over your old template files in your project.
If you made modifications to these files in your project, you will have to manually apply the changes by using `git diff` on the PWA Studio repository or by using a [diff tool][].

[diff tool]: https://marketplace.visualstudio.com/search?term=diff&target=VSCode&category=All%20categories&sortBy=Relevance

### New environment variables

The following environment variable has been added in this release:

```json
{
    "name": "Default Country",
    "variables": [
        {
            "name": "DEFAULT_COUNTRY_CODE",
            "type": "str",
            "desc": "Specify the default country to be selected in forms containing country field such as address books and shipping information forms.",
            "default": "US"
        }
    ]
},
```

Update the environment variables in your development, staging, or production environments if the default value does not apply to your project.

[pwa studio releases]: https://github.com/magento/pwa-studio/releases
