import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Volt Fitness navigation', () => {
  render(<App />);
  expect(screen.getByText(/volt fitness/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /join now/i })).toBeInTheDocument();
});
