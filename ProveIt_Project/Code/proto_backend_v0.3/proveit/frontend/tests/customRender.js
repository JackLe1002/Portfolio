import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

const CustomTestWrapper = ({ children }) => {
    return <MemoryRouter>{children}</MemoryRouter>;
};

export const customRender = (ui, options) => {
    render(ui, { wrapper: CustomTestWrapper, ...options });
};
