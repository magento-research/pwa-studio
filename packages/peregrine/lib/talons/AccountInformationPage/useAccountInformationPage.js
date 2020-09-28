import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useUserContext } from '../../context/user';

export const useAccountInformationPage = props => {
    const {
        mutations: {
            setCustomerInformationMutation,
            changeCustomerPasswordMutation
        },
        queries: { getCustomerInformationQuery }
    } = props;

    const [{ isSignedIn }] = useUserContext();
    const [shouldShowNewPassword, setShouldShowNewPassword] = useState(false);

    const [isUpdateMode, setIsUpdateMode] = useState(false);

    const { data: accountInformationData, error: loadDataError } = useQuery(
        getCustomerInformationQuery,
        {
            skip: !isSignedIn,
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    const [
        setCustomerInformation,
        {
            error: customerInformationUpdateError,
            loading: isUpdatingCustomerInformation
        }
    ] = useMutation(setCustomerInformationMutation);

    const [
        changeCustomerPassword,
        {
            error: customerPasswordChangeError,
            loading: isChangingCustomerPassword
        }
    ] = useMutation(changeCustomerPasswordMutation);

    const initialValues = useMemo(() => {
        if (accountInformationData) {
            return { customer: accountInformationData.customer };
        }
    }, [accountInformationData]);

    const handleChangePassword = useCallback(() => {
        setShouldShowNewPassword(true);
    }, [setShouldShowNewPassword]);

    const handleCancel = useCallback(() => {
        setIsUpdateMode(false);
        setShouldShowNewPassword(false);
    }, [setIsUpdateMode]);

    const showUpdateMode = useCallback(() => {
        setIsUpdateMode(true);
    }, [setIsUpdateMode]);

    const handleSubmit = useCallback(
        async ({ email, firstname, lastname, password, newPassword }) => {
            try {
                email = email.trim();
                firstname = firstname.trim();
                lastname = lastname.trim();
                password = password.trim();
                newPassword = newPassword ? newPassword.trim() : newPassword;

                if (
                    initialValues.customer.email !== email ||
                    initialValues.customer.firstname !== firstname ||
                    initialValues.customer.lastname !== lastname
                ) {
                    await setCustomerInformation({
                        variables: {
                            customerInput: {
                                email,
                                firstname,
                                lastname,
                                // You must send password because it is required
                                // when changing email.
                                password
                            }
                        }
                    });
                }
                if (password && newPassword) {
                    await changeCustomerPassword({
                        variables: {
                            currentPassword: password,
                            newPassword: newPassword
                        }
                    });
                }
                // After submission, close the form if there were no errors.
                handleCancel(false);
            } catch {
                // we have an onError link that logs errors, and FormError
                // already renders this error, so just return to avoid
                // triggering the success callback
                return;
            }
        },
        [
            setCustomerInformation,
            handleCancel,
            changeCustomerPassword,
            initialValues
        ]
    );

    return {
        handleCancel,
        formErrors: [
            customerInformationUpdateError,
            customerPasswordChangeError
        ],
        handleSubmit,
        handleChangePassword,
        initialValues,
        isDisabled: isUpdatingCustomerInformation || isChangingCustomerPassword,
        isUpdateMode,
        isSignedIn,
        loadDataError,
        shouldShowNewPassword,
        showUpdateMode
    };
};
