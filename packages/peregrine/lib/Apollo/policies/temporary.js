/**
 * Custom type policies that allow us to have more granular control
 * over how ApolloClient reads from and writes to the cache.
 *
 * https://www.apollographql.com/docs/react/caching/cache-configuration/#typepolicy-fields
 * https://www.apollographql.com/docs/react/caching/cache-field-behavior/
 */
const temporaryTypePolicies = {
    StoreConfig: {
        fields: {
            // This field is available in Magento 2.4.2 we need to support older versions, so env var is used here
            configurable_thumbnail_source: {
                read() {
                    return process.env.CONFIGURABLE_THUMBNAIL_SOURCE;
                }
            }
        }
    },
    ConfigurableCartItem: {
        fields: {
            // This field is proposed in the https://github.com/magento/magento2/pull/30817
            configured_variant: {
                read(_, { readField, toReference }) {
                    const product = readField('product');
                    const configurableThumbnailSource = readField({
                        fieldName: 'configurable_thumbnail_source',
                        from: toReference({
                            __typename: 'StoreConfig',
                            id: 1
                        })
                    });

                    if (configurableThumbnailSource === 'parent') {
                        return product;
                    }

                    const optionUids = readField('configurable_options')
                        .map(option => {
                            const optionObject = JSON.parse(
                                option.__ref.substring(
                                    option.__ref.indexOf('{'),
                                    option.__ref.lastIndexOf('}') + 1
                                )
                            );
                            const string = `configurable/${optionObject.id}/${
                                optionObject.value_id
                            }`;
                            return new Buffer(string).toString('base64');
                        })
                        .sort()
                        .toString();

                    const variant = readField('variants', product)
                        .map(variant => {
                            const variantUids = variant.attributes
                                .map(attribute => attribute.uid)
                                .sort()
                                .toString();
                            return (
                                variantUids === optionUids && variant.product
                            );
                        })
                        .filter(Boolean)[0];

                    return variant;
                }
            }
        }
    }
};

export default temporaryTypePolicies;
