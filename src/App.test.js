import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders Volt Fitness navigation', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(screen.getByText(/volt fitness/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /join now/i })).toBeInTheDocument();
});
