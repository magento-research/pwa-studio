import React, { Fragment } from 'react';
import { func, shape, string, bool } from 'prop-types';

import { mergeClasses } from '../../classify';
import Field from '../Field';
import TextInput from '../TextInput';
import LinkButton from '../LinkButton';
import Password from '../Password';
import combine from '../../util/combineValidators';
import {
    hasLengthAtLeast,
    isRequired,
    validatePassword,
    validateDifferentCurrentPassword
} from '../../util/formValidators';
import defaultClasses from './editForm.css';

const EditForm = props => {
    const { classes: propClasses } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    return (
        <div className={classes.root}>
            <div className={classes.firstname}>
                <Field id="firstname" label="First Name">
                    <TextInput field="firstname" validate={isRequired} />
                </Field>
            </div>
            <div className={classes.lastname}>
                <Field id="lastname" label="Last Name">
                    <TextInput field="lastname" validate={isRequired} />
                </Field>
            </div>
            <div className={classes.email}>
                <Field id="email" label="Email">
                    <TextInput field="email" validate={isRequired} />
                </Field>
            </div>
            <div className={classes.password}>
                <Password
                    fieldName="password"
                    label="Current Password"
                    validate={isRequired}
                    autoComplete="current-password"
                    isToggleButtonHidden={false}
                />
            </div>
            <div className={classes.newPassword}>
                <Password
                    fieldName="newPassword"
                    label="New Password"
                    validate={validateDifferentCurrentPassword}
                    isToggleButtonHidden={false}
                />
            </div>
        </div>
    );
};

export default EditForm;

EditForm.propTypes = {
    classes: shape({
        root: string,
        field: string,
        email: string,
        firstname: string,
        lastname: string,
        buttons: string,
        passwordLabel: string,
        password: string,
        newPassword: string
    })
};
