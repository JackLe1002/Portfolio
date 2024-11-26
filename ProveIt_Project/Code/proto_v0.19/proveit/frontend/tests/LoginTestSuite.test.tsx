// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import React from "react";
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { LoginCluster } from '../src/clusters/LoginCluster';
jest.mock('../src/hooks/useLogin.tsx', () => ({
    useLogin: jest.fn().mockReturnValue({
        login: jest.fn(),
        error: null,
        isLoading: false,
    }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

describe('LoginCluster', () => {
    beforeEach(() => {
        render(<LoginCluster />);
    });

    test('renders the login form with all fields and buttons', () => {
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    test('allows entering email and password', async () => {
        // Use await with userEvent.type for asynchronous typing
        await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
        await userEvent.type(screen.getByLabelText(/password/i), 'password123');
        expect(screen.getByLabelText(/email address/i)).toHaveValue('test@example.com');
        expect(screen.getByLabelText(/password/i)).toHaveValue('password123');
    });

    test('toggles remember me checkbox', async () => {
        const checkbox = screen.getByLabelText(/remember me/i);
        expect(checkbox).not.toBeChecked();
        await userEvent.click(checkbox);
        expect(checkbox).toBeChecked();
    });

    test('calls login function on form submission', async () => {
        // Retrieve the mocked login function from useLogin
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { useLogin } = require('../src/hooks/useLogin.tsx');
        const { login } = useLogin();

        await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
        await userEvent.type(screen.getByLabelText(/password/i), 'password123');
        await userEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
        });
    });

});
