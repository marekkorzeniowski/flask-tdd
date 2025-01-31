import React from 'react';
import { render, screen } from '../test-utils';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import RegisterForm from '../../components/RegisterForm';
import { expect as expectVitest } from 'vitest';

const mockProps = {
  onSubmit: vi.fn(),
  isAuthenticated: vi.fn().mockReturnValue(false),
};

const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: Router });
};

describe('RegisterForm', () => {
  it('renders properly', () => {
    renderWithRouter(<RegisterForm {...mockProps} />);
    const heading = screen.getByRole('heading', { name: 'Register' });
    expect(heading.tagName.toLowerCase()).toBe('h1');
  });

  it('renders with default props', () => {
    renderWithRouter(<RegisterForm {...mockProps} />);

    const usernameInput = screen.getByLabelText('Username') as HTMLInputElement;
    expect(usernameInput.value).toBe('');

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    expect(emailInput.type).toBe('email');
    expect(emailInput.value).toBe('');

    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    expect(passwordInput.type).toBe('password');
    expect(passwordInput.value).toBe('');

    const submitButtons = screen.getAllByRole('button', { name: 'Register' });
    expect(submitButtons[0].textContent).toBe('Register');
  });

//   it("renders", () => {
//     const { asFragment } = renderWithRouter(<RegisterForm {...mockProps} />);
//     expect(asFragment()).toMatchSnapshot();
//   });

  it('renders register form when not authenticated', () => {
    const { container } = renderWithRouter(<RegisterForm {...mockProps} />);
    const heading = container.querySelector('h1');
    expectVitest(heading?.textContent).toBe('Register');
  });

  it('redirects when authenticated', () => {
    const authenticatedProps = { ...mockProps, isAuthenticated: vi.fn().mockReturnValue(true) };
    renderWithRouter(<RegisterForm {...authenticatedProps} />);
    expect(window.location.pathname).toBe('/');
  });
});