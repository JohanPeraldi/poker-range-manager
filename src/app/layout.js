import './globals.css';

export const metadata = {
  title: 'Poker Range Manager',
  description: 'An app for managing NLHE poker hand ranges',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
