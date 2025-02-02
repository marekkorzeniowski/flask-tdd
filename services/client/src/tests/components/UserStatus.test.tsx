import React from 'react';
import { render, cleanup, screen, waitFor, act } from '../test-utils';
import { describe, it, expect, vi, afterEach } from 'vitest';
import axios from 'axios';

import UserStatus from '../../components/UserStatus';

vi.mock('axios');

describe('UserStatus', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const mockIsAuthenticated = vi.fn().mockReturnValue(true); // new

  it('renders properly when authenticated', async () => {
    const mockAxios = vi.mocked(axios);
    mockAxios.mockResolvedValueOnce({
      data: { email: 'test@test.com', username: 'test' }
    });

    // new
    render(
        <UserStatus accessToken="dummy-token" isAuthenticated={mockIsAuthenticated} />
    );

    await waitFor(() => {
      expect(mockAxios).toHaveBeenCalledTimes(1);
    });

    const userEmail = await screen.findByTestId('user-email');
    const userUsername = await screen.findByTestId('user-username');

    expect(userEmail.textContent).toBe('test@test.com');
    expect(userUsername.textContent).toBe('test');
  });

  it("renders", async () => {
    vi.mocked(axios).mockResolvedValueOnce({
      data: { email: 'test@test.com', id: 1, username: 'test' }
    });


    // new
    const { asFragment } = render(
        <UserStatus accessToken="dummy-token" isAuthenticated={mockIsAuthenticated} />
    );
    await act(async () => {
      expect(axios).toHaveBeenCalled();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});