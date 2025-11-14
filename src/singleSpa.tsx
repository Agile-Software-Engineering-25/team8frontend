import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import { cssLifecycleFactory } from 'vite-plugin-single-spa/ex';
import type { User } from 'oidc-client-ts';
import { AuthProvider } from '@context/AuthContext';
import type { AppProps } from 'single-spa';
import App from './App';

type RootProps = {
  getUser?: () => User | null;

  [key: string]: unknown;
};

const lifecycle = singleSpaReact<RootProps>({
  React,
  ReactDOMClient,
  errorBoundary(err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return <div>Error: {message}</div>;
  },
  rootComponent: (props: RootProps) => {
    // Get user via function provided by the root
    const { getUser, ...appProps } = props;

    // Wrap App with AuthProvider; provider handles initial user + updates
    return (
      <AuthProvider getUser={getUser}>
        <App {...appProps} />
      </AuthProvider>
    );
  },
});

// IMPORTANT: Because the file is named singleSpa.tsx, the string 'singleSpa'
// must be passed to the call to cssLifecycleFactory.
const cssLc = cssLifecycleFactory('singleSpa' /* optional factory options */);

export const bootstrap = [cssLc.bootstrap, lifecycle.bootstrap];

export const mount = [
  cssLc.mount,
  async (props: AppProps) => {
    await lifecycle.mount(props);
  },
];

export const unmount = [
  async (props: AppProps) => {
    await lifecycle.unmount(props);
  },
  cssLc.unmount,
];
