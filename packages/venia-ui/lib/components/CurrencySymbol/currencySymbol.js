import React from 'react';
import { string, shape } from 'prop-types';
import { useIntl } from 'react-intl';
import patches from '@magento/peregrine/lib/util/intlPatches';

/**
 * The CurrencySymbol component is used to extract currency symbol from Intl.NumberFormat.
 *
 * Formatting of prices and currency symbol selection is handled entirely by the ECMAScript Internationalization API available in modern browsers.
 *
 * A [polyfill][] is required for any JavaScript runtime that does not have [Intl.NumberFormat.prototype.formatToParts][].
 *
 * [polyfill]: https://www.npmjs.com/package/intl
 * [Intl.NumberFormat.prototype.formatToParts]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts
 */

const isNarrowSymbolSupported = (() => {
    try {
        new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'narrowSymbol'
        });

        return true;
    } catch (e) {
        if (e.constructor !== RangeError) {
            console.warn(e);
        }

        return false;
    }
})();

const symbolsFallback = {
    UAH: '₴'
};

const CurrencySymbol = props => {
    const { locale } = useIntl();
    const { currencyCode, classes, currencyDisplay } = props;

    // Safari does not support 'narrowSymbol' as 'currencyDisplay' option
    // English locale and 'symbol' is used in this case
    const localeFallback = isNarrowSymbolSupported ? locale : 'en';
    const currencyDisplayFallback = isNarrowSymbolSupported
        ? currencyDisplay
        : 'symbol';

    // symbolsFallback can be used to provide symbol in case currency code is returned
    if (!isNarrowSymbolSupported && currencyCode in symbolsFallback) {
        return (
            <span className={classes.currency}>
                {symbolsFallback[currencyCode]}
            </span>
        );
    }

    const parts = patches.toParts.call(
        new Intl.NumberFormat(localeFallback, {
            style: 'currency',
            currencyDisplay: currencyDisplayFallback,
            currency: currencyCode
        }),
        0
    );

    const symbol = parts.find(part => part.type === 'currency');

    return <span className={classes.currency}>{symbol.value}</span>;
};

CurrencySymbol.propTypes = {
    /**
     * Class names to use when styling this component
     */
    classes: shape({
        currency: string
    }),
    /**
     * A string with any of the currency code supported by Intl.NumberFormat
     */
    currencyCode: string.isRequired,
    /**
     * Currency display types supported by Intl.NumberFormat
     */
    currencyDisplay: string
};

CurrencySymbol.defaultProps = {
    classes: {},
    currencyDisplay: 'symbol'
};

export default CurrencySymbol;
