import React, { ReactElement } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import userEvent from '@testing-library/user-event';


type SessionType = {
  expires?: string;
  user?: { name?: string; email?: string; image?: string; role?: string };
} | null;


interface CustomRenderOptions {
  session?: SessionType;
  [key: string]: any;
}


function render(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { session = null, ...restOptions } = options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider session={session as any}>
        {children}
      </SessionProvider>
    );
  }

  return {
    user: userEvent.setup(),
    ...rtlRender(ui, {
      wrapper: Wrapper,
      ...restOptions,
    }),
  };
}

// Re-export everything
export * from '@testing-library/react';
export { render };