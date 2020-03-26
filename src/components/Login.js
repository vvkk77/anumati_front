import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import '../Login.css';

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.loginEval = this.loginEval.bind(this);
    }
    
    async loginEval() {
        this.props.loginSuccess();
    }

    render() {
        return(
            <div>
                <Formik
                    className="login-form"
                    initialValues={{ email: '', password: '' }}
                    validate={values => {
                        const errors = {};
                        if (!values.email) {
                            errors.email = 'Required';
                        } else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                        ) {
                            errors.email = 'Invalid email address';
                        }
                        if (!values.password) {
                            errors.password = 'Required';
                        }

                        return errors;
                    }}
                    onSubmit={this.loginEval}
                >
                    {({ isSubmitting }) => (
                        <Form style={{
                            width: "fit-content",
                            marginLeft: "auto",
                            marginRight: "auto"
                        }}>
                            <label htmlFor="email" style={{
                                display: "block",
                                marginTop: "4em"
                            }}>
                                Email
                            </label>
                            <Field
                                label="Email ID"
                                type="email"
                                name="email"
                                placeholder="Enter Email ID" />
                            <ErrorMessage name="email" component="div" />
                            <label htmlFor="password" style={{
                                display: "block",
                                margin: "10px"
                            }}>
                                Password
                            </label>
                            <Field
                                type="password"
                                name="password"
                                placeholder="Enter Password"
                                label="Password" />
                            <ErrorMessage name="password" component="div" />
                            <button type="submit" disabled={isSubmitting} style={{
                                display: "block",
                                width: "fit-content",
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginTop: "50px"
                            }}>
                                Submit
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }
}

export default Login;