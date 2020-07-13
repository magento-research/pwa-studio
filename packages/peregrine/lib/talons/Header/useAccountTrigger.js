import { useCallback, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/react-hooks';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '@magento/peregrine/lib/Apollo/clearCustomerDataFromCache';

/**
 *
 */
export const useAccountTrigger = props => {
    const { mutations } = props;
    const { signOut: signOutMutation } = mutations;

    const {
        elementRef: accountMenuRef,
        expanded: accountMenuIsOpen,
        setExpanded: setAccountMenuIsOpen,
        triggerRef: accountMenuTriggerRef
    } = useDropdown();

    const apolloClient = useApolloClient();
    const history = useHistory();
    const location = useLocation();
    const [revokeToken] = useMutation(signOutMutation);
    const [{ isSignedIn: isUserSignedIn }, { signOut }] = useUserContext();

    const handleSignOut = useCallback(async () => {
        setAccountMenuIsOpen(false);

        // Delete cart/user data from the redux store.
        await signOut({ revokeToken });
        await clearCartDataFromCache(apolloClient);
        await clearCustomerDataFromCache(apolloClient);

        // Refresh the page as a way to say "re-initialize". An alternative
        // would be to call apolloClient.resetStore() but that would require
        // a large refactor.
        history.go(0);
    }, [apolloClient, history, revokeToken, setAccountMenuIsOpen, signOut]);

    const handleTriggerClick = useCallback(() => {
        // Toggle the Account Menu.
        setAccountMenuIsOpen(isOpen => !isOpen);
    }, [setAccountMenuIsOpen]);

    // Close the Account Menu on page change.
    useEffect(() => {
        setAccountMenuIsOpen(false);
    }, [location.pathname, setAccountMenuIsOpen]);

    return {
        accountMenuIsOpen,
        accountMenuRef,
        accountMenuTriggerRef,
        handleSignOut,
        handleTriggerClick,
        isUserSignedIn
    };
};
