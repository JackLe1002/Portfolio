// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React from "react";
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { SignUpCluster } from '../src/clusters/SignUpCluster';

jest.mock('../src/hooks/useSignup.tsx', () => ({
    useSignUp: jest.fn().mockReturnValue({
        signup: jest.fn(),
        invitedSignup: jest.fn(),
        error: null,
        isLoading: false,
        setError: jest.fn(),
    }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useSearchParams: () => ([
        { get: jest.fn((param) => {
                if (param === 'email') return 'john@example.com';
                if (param === 'role') return 'manager';
                return null;
            })},
        jest.fn(), // Mock setSearchParams
    ]),
}));


describe('SignUpCluster', () => {
    const mockSignupType = "manager"; // or "invited"

    beforeEach(() => {
        render(<SignUpCluster signupType={mockSignupType} />);
    });

    test('renders the signup form with all fields and buttons', () => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        const passwordInputs = screen.getAllByPlaceholderText(/password/i);
        const passwordInput = passwordInputs[0];
        const confirmPasswordInput = passwordInputs[1];
        expect(passwordInput).toBeInTheDocument();
        expect(confirmPasswordInput).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    test('allows entering all user information', async () => {

        const passwordInputs = screen.getAllByPlaceholderText(/password/i);
        const passwordInput = passwordInputs[0];
        const confirmPasswordInput = passwordInputs[1];

        await userEvent.type(screen.getByLabelText(/first name/i), 'John');
        await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
        await userEvent.type(screen.getByLabelText(/email address/i), 'john@example.com');
        await userEvent.type(passwordInput, 'Password123!');
        await userEvent.type(confirmPasswordInput, 'Password123!');
        expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
        expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
        expect(screen.getByLabelText(/email address/i)).toHaveValue('john@example.com');
        expect(passwordInput).toHaveValue('Password123!');
        expect(confirmPasswordInput).toHaveValue('Password123!');
    });

    test('calls signup function on form submission', async () => {
        // Retrieve the mocked signup function from useSignUp
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { useSignUp } = require('../src/hooks/useSignup.tsx');
        const { signup } = useSignUp();
        const passwordInputs = screen.getAllByPlaceholderText(/password/i);
        const passwordInput = passwordInputs[0];
        const confirmPasswordInput = passwordInputs[1];

        // Fill in the form and submit
        await userEvent.type(screen.getByLabelText(/first name/i), 'John');
        await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
        await userEvent.type(screen.getByLabelText(/email address/i), 'john@example.com');
        await userEvent.type(passwordInput, 'Password123!');
        await userEvent.type(confirmPasswordInput, 'Password123!');
        await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

        // Check that the signup function was called with the correct arguments
        await waitFor(() => {
            expect(signup).toHaveBeenCalledWith('John', 'Doe', 'john@example.com', 'Password123!');
        });
    });

    test('validates password and confirm password match', async () => {
        await userEvent.type(screen.getByLabelText(/first name/i), 'John');
        await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
        await userEvent.type(screen.getByLabelText(/email address/i), 'john@example.com');

        const passwordInputs = screen.getAllByPlaceholderText(/password/i);
        const passwordInput = passwordInputs[0];
        const confirmPasswordInput = passwordInputs[1];

        await userEvent.type(passwordInput, 'Password123!');
        await userEvent.type(confirmPasswordInput, 'DifferentPassword123!');
        await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
        expect(screen.getByText(/Password and Confirm password do not match./i)).toBeInTheDocument();
    });

});
