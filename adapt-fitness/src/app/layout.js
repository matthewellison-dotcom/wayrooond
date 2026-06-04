export const metadata = {
  title: 'Adapt — Fitness for your actual body',
  description: 'AI-powered fitness app built around your injuries and limitations',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#07080A' }}>
        {children}
      </body>
    </html>
  );
}
