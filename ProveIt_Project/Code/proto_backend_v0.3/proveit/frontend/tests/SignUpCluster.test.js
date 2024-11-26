import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignUpCluster from '../src/components/SignUpCluster';

describe('SignUpCluster', () => {
    let component;

    // Helper function to render the component with MemoryRouter
    const renderComponent = () => {
        return render(
            <MemoryRouter>
                <SignUpCluster />
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        // Render the component before each test
        component = renderComponent();
    });

    it('should render the component', () => {
        const { getByText } = component;
        expect(getByText('Sign Up')).toBeInTheDocument();
    });

    it('should display an error message for empty fields', () => {
        const { getByText } = component;
        fireEvent.click(getByText('Sign Up'));
        expect(getByText('All fields must be filled out.')).toBeInTheDocument();
    });

    it('should display an error message for password mismatch', () => {
        const { getByText, getByLabelText } = component;
        fireEvent.change(getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'mismatched' } });
        fireEvent.click(getByText('Sign Up'));
        expect(getByText('Password and Confirm Password do not match.')).toBeInTheDocument();
    });

        it('should display an error message for a weak password', () => {
            const { getByText, getByLabelText } = component;
            fireEvent.change(getByLabelText('Password'), { target: { value: 'weak' } });
            fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'weak' } });
            fireEvent.click(getByText('Sign Up'));
            expect(getByText('Password must be 8-14 characters long with 1 special character and 1 uppercase letter.')).toBeInTheDocument();
        });
    });
