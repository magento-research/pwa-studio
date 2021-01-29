/**
 * Custom type policies that allow us to have more granular control
 * over how ApolloClient reads from and writes to the cache.
 *
 * https://www.apollographql.com/docs/react/caching/cache-configuration/#typepolicy-fields
 * https://www.apollographql.com/docs/react/caching/cache-field-behavior/
 */
const typePolicies = {
    // Query/Mutation are "types" just like "Cart".
    Query: {
        fields: {
            cart: {
                // Replaces @connection(key: "Cart")
                keyArgs: () => 'Cart'
            },
            customer: {
                keyArgs: () => 'Customer'
            },
            customerCart: {
                keyArgs: () => 'Cart'
            }
        }
    },
    AppliedGiftCard: {
        keyFields: ['code']
    },
    AvailablePaymentMethod: {
        keyFields: ['code']
    },
    AvailableShippingMethod: {
        // The combination of these fields makes an instance of
        // AvailableShippingMethod unique.
        keyFields: ['carrier_code', 'method_code']
    },
    Breadcrumb: {
        // Uses provided fields on the object as the `id`.
        keyFields: ['category_id']
    },
    Cart: {
        keyFields: () => 'Cart',
        fields: {
            applied_gift_cards: {
                // eslint-disable-next-line no-unused-vars
                merge(existing, incoming) {
                    return incoming;
                }
            },
            available_payment_methods: {
                // eslint-disable-next-line no-unused-vars
                merge(existing, incoming) {
                    return incoming;
                }
            },
            items: {
                // eslint-disable-next-line no-unused-vars
                merge(existing, incoming) {
                    return incoming;
                }
            },
            prices: {
                // `merge: true` can be used for an object field.
                merge: true
            },
            shipping_addresses: {
                merge(existing = [], incoming, { readField, mergeObjects }) {
                    // street makes these things unique
                    const mergeResult = new Set();
                    const streetToIndex = new Map();

                    existing.forEach((existingShippingAddress, index) => {
                        // Use readField instead of existingShippingAddress.street directly because it will follow cache references.
                        const street = readField(
                            'street',
                            existingShippingAddress
                        );
                        streetToIndex.set(street, index);
                    });

                    incoming.forEach(incomingShippingAddress => {
                        const street = readField(
                            'street',
                            incomingShippingAddress
                        );

                        if (streetToIndex.has(street)) {
                            const targetIndex = streetToIndex.get(street);
                            const existingShippingAddress =
                                existing[targetIndex];
                            const merged = mergeObjects(
                                existingShippingAddress,
                                incomingShippingAddress
                            );
                            mergeResult.add(merged);
                        } else {
                            // We do not have an address with this street yet, add it on to the end.
                            streetToIndex.set(street, streetToIndex.size);
                            mergeResult.add(incomingShippingAddress);
                        }
                    });

                    return Array.from(mergeResult);
                }
            }
        }
    },
    Customer: {
        keyFields: () => 'Customer',
        fields: {
            addresses: {
                merge(existing, incoming) {
                    return incoming;
                },
                read(cachedAddresses, { toReference }) {
                    if (cachedAddresses) {
                        return cachedAddresses.map(address => {
                            // Update v2 identifiers to new references. Previous
                            // entries had `id: CustomerAddress:1` which caused
                            // v3's lookup to fail. If we find a legacy id,
                            // point it at the object using a reference.
                            if (
                                address.id &&
                                address.id.includes('CustomerAddress')
                            ) {
                                return toReference(address.id);
                            } else {
                                return address;
                            }
                        });
                    }
                    // If there are no cached addresses that's fine - the schema
                    // shows that it is a nullable field.
                }
            },
            orders: {
                keyArgs: ['filter']
            }
        }
    },
    CustomerAddress: {
        fields: {
            street: {
                // eslint-disable-next-line no-unused-vars
                merge(existing, incoming) {
                    return incoming;
                }
            }
        }
    },
    CustomerOrders: {
        fields: {
            items: {
                // should this not be the default behavior, and instead go in useOrderHistoryPage
                // using the useTypePolicies hook?
                merge: (existing = [], incoming, { variables }) => {
                    if (variables) {
                        const { currentPage = 1 } = variables;
                        // reset cache collection if we're on the first page
                        if (currentPage === 1) {
                            return incoming;
                        }
                    }

                    return [...existing, ...incoming];
                }
            }
        }
    },
    CustomerPaymentTokens: {
        keyFields: () => 'CustomerPaymentTokens'
    },
    ProductImage: {
        keyFields: ['url']
    },
    SelectedConfigurableOption: {
        // id alone is not enough to identify a selected option as it can refer
        // to something like "size" where value_id refers to "large".
        keyFields: ['id', 'value_id']
    },
    SelectedPaymentMethod: {
        keyFields: ['code']
    },
    ShippingCartAddress: {
        keyFields: ['street'],
        fields: {
            available_shipping_methods: {
                merge(existing = [], incoming, { readField, mergeObjects }) {
                    // carrier_code + method_code makes these things unique
                    const mergeResult = new Set();
                    const carrierToIndex = new Map();

                    existing.forEach((existingShippingMethod, index) => {
                        // Use readField because it will follow cache references.
                        const carrierCode = readField(
                            'carrier_code',
                            existingShippingMethod
                        );
                        const methodCode = readField(
                            'method_code',
                            existingShippingMethod
                        );
                        const carrierKey = `${carrierCode}|${methodCode}`;
                        carrierToIndex.set(carrierKey, index);
                    });

                    incoming.forEach(incomingShippingMethod => {
                        // Use readField because it will follow cache references.
                        const carrierCode = readField(
                            'carrier_code',
                            incomingShippingMethod
                        );
                        const methodCode = readField(
                            'method_code',
                            incomingShippingMethod
                        );
                        const carrierKey = `${carrierCode}|${methodCode}`;
                        if (carrierToIndex.has(carrierKey)) {
                            const targetIndex = carrierToIndex.get(carrierKey);
                            const existingShippingMethod =
                                existing[targetIndex];
                            const merged = mergeObjects(
                                existingShippingMethod,
                                incomingShippingMethod
                            );
                            mergeResult.add(merged);
                        } else {
                            // We do not have a method with this key yet, add it on to the end.
                            carrierToIndex.set(carrierKey, carrierToIndex.size);
                            mergeResult.add(incomingShippingMethod);
                        }
                    });

                    return Array.from(mergeResult);
                }
            },
            country: {
                merge: true
            },
            region: {
                merge: true
            },
            selected_shipping_method: {
                merge: true
            }
        }
    },
    CategoryTree: {
        fields: {
            children: {
                merge(existing, incoming) {
                    return incoming;
                }
            }
        }
    }
};

export default typePolicies;
