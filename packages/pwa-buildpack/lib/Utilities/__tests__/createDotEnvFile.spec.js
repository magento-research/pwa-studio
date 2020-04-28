jest.mock('../../util/pretty-logger', () => ({
    warn: jest.fn(),
    error: jest.fn()
}));
jest.mock('../getEnvVarDefinitions');
const dotenv = require('dotenv');
const getEnvVarDefinitions = require('../getEnvVarDefinitions');
const createDotEnvFile = require('../createDotEnvFile');
const prettyLogger = require('../../util/pretty-logger');

const snapshotEnvFile = contents =>
    contents.replace(/.+?Generated by @magento[\S\s]+?Z\.\n/gim, '');

jest.spyOn(dotenv, 'config');
const envVarDefs = require('../../../envVarDefinitions.json');
const MAGENTO_BACKEND_URL_EXAMPLE = envVarDefs.sections
    .find(section => section.name === 'Connecting to a Magento store')
    .variables.find(v => v.name === 'MAGENTO_BACKEND_URL').example;
// skip the buildbus part!
getEnvVarDefinitions.mockReturnValue(envVarDefs);

const examples = {};
for (const section of envVarDefs.sections) {
    for (const variable of section.variables) {
        if (
            variable.hasOwnProperty('example') &&
            !variable.hasOwnProperty('default') &&
            !process.env.hasOwnProperty(variable.name)
        ) {
            examples[variable.name] = variable.example;
        }
    }
}

const mockLog = {
    warn: jest.fn(),
    error: jest.fn()
};

beforeEach(() => {
    prettyLogger.warn.mockClear();
    prettyLogger.error.mockClear();
    mockLog.warn.mockClear();
    mockLog.error.mockClear();
});

test('logs errors to default logger if env is not valid', () => {
    dotenv.config.mockReturnValueOnce({});
    createDotEnvFile('./');
    expect(prettyLogger.warn).toHaveBeenCalled();
});

test('uses alternate logger', () => {
    dotenv.config.mockReturnValueOnce({});
    createDotEnvFile('./', { logger: mockLog });
    expect(mockLog.warn).toHaveBeenCalled();
});

test('returns valid dotenv file if env is valid', () => {
    const currentEnv = {
        MAGENTO_BACKEND_URL: 'https://local.magento/'
    };
    dotenv.config.mockReturnValueOnce(currentEnv);

    const fileText = createDotEnvFile(currentEnv, { logger: mockLog });
    expect(snapshotEnvFile(fileText)).toMatchSnapshot();
    expect(dotenv.parse(fileText)).toMatchObject(currentEnv);
});

test('populates with examples where available', () => {
    const fileText = createDotEnvFile('./', { useExamples: true });
    expect(dotenv.parse(fileText)).toMatchObject(examples);
});

test('does not print example comment if value is set custom', () => {
    const fakeEnv = {
        MAGENTO_BACKEND_URL: 'https://other.magento.site',
        IMAGE_SERVICE_CACHE_EXPIRES: 'a million years'
    };
    dotenv.config.mockReturnValueOnce(fakeEnv);
    const fileText = createDotEnvFile(fakeEnv);
    expect(fileText).not.toMatch(MAGENTO_BACKEND_URL_EXAMPLE);
    expect(fileText).not.toMatch(
        `Example: ${examples.IMAGE_SERVICE_CACHE_EXPIRES}`
    );
});

test('passing an env object works, but warns deprecation and assumes cwd is context', () => {
    getEnvVarDefinitions.mockReturnValue({
        sections: [
            {
                name: 'Nothing special',
                variables: [
                    {
                        name: 'TEST_ENV_VAR_NOTHING',
                        type: 'str',
                        desc: 'that doesnt look like anything to me'
                    },
                    {
                        name: 'TEST_ENV_VAR_SOMETHING',
                        type: 'bool',
                        desc: 'manichean!!',
                        default: true
                    }
                ]
            }
        ],
        changes: []
    });
    expect(
        snapshotEnvFile(
            createDotEnvFile({
                TEST_ENV_VAR_NOTHING: 'foo'
            })
        )
    ).toMatchSnapshot();
    expect(getEnvVarDefinitions).toHaveBeenCalledWith(process.cwd());
    expect(prettyLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('deprecated')
    );
});
