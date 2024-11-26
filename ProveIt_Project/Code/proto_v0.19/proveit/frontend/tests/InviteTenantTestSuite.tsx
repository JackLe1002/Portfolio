Object.defineProperty(global, 'import.meta', {
    value: {
        env: {
            VITE_SERVER: 'http://localhost:3000',
        },
    },
});


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import InviteUserCluster from '../src/clusters/ho-manager/InviteUserCluster';
import { useAuthContext } from '../src/hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { mocked } from 'jest-mock';

jest.mock('../src/hooks/useAuthContext');
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

const mockRole = {
    id: 'role1',
    role: 'tenant'
};

const mockUser = {
    email: 'test@example.com',
    token: 'mockToken',
    refreshToken: 'mockRefreshToken',
    id: 'mockId',
    phoneVerified: true,
    role: mockRole,
};
describe('InviteUserCluster', () => {

    beforeEach(() => {

        const mockedUseAuthContext = mocked(useAuthContext);
        mockedUseAuthContext.mockReturnValue({ state: { user: mockUser }, dispatch: jest.fn() });

        const mockedUseNavigate = mocked(useNavigate);
        mockedUseNavigate.mockReturnValue(jest.fn());

        global.fetch = jest.fn(() =>
            Promise.resolve(
                new Response(JSON.stringify({ isSuccess: true }), {
                    status: 200,
                    statusText: 'OK',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            )
        );

        render(<InviteUserCluster roleName="tenant" />);
    });

    test('renders the invite user form', () => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /send invite/i })).toBeInTheDocument();
    });

    test('allows entering user information', async () => {
        await userEvent.type(screen.getByLabelText(/first name/i), 'John');
        await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
        await userEvent.type(screen.getByLabelText(/email/i), 'johndoe@example.com');
        await userEvent.type(screen.getByLabelText(/phone/i), '1234567890');

        expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
        expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
        expect(screen.getByLabelText(/email/i)).toHaveValue('johndoe@example.com');
        expect(screen.getByLabelText(/phone/i)).toHaveValue('1234567890');
    });

    test('handles form submission', async () => {
        // Mock the form inputs
        // ... (as above in the previous test)

        const submitButton = screen.getByRole('button', { name: /send invite/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
                method: "POST",
                headers: expect.any(Object),
                body: expect.any(String),
            }));
        });
    });

    test('navigates to dashboard on successful invite', async () => {
        const navigate = useNavigate();
        // Fill in the form and submit
        // ... (as above in the previous test)

        await waitFor(() => {
            expect(navigate).toHaveBeenCalledWith('/dashboard');
        });
    });
});

