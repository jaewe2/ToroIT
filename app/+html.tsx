import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * This file is web-only and used to configure the root HTML for every web page during static rendering.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        
        {/* Prevent flickering in dark mode */}
        <ScrollViewStyleReset />
        <style>{responsiveBackground}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
  body {
    background-color: #fff;
  }

  @media (prefers-color-scheme: dark) {
    body {
      background-color: #000;
    }
  }
`;
