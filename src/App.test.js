import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app shell', () => {
  render(<App />);
  // App content is different from CRA template; just ensure header renders.
  const cartLinks = screen.getAllByText(/Cart/i);
  expect(cartLinks.length).toBeGreaterThan(0);

});

