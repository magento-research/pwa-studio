const config = {
    parser: 'babel-eslint',
    plugins: ['react'],
    extends: ['@magento'],
    rules: {
        'no-undef': 'off',
        'no-useless-escape': 'off',
        'react/jsx-no-literals': [
            'error',
            {
                allowedStrings: [],
                ignoreProps: true,
                noStrings: true
            }
        ]
    }
};

module.exports = config;
