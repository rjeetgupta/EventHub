'use client';

import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { persistor, store } from "@/store";
import { PersistGate } from "redux-persist/integration/react";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      {/* <AuthInitializer> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          </ThemeProvider>
        {/* </AuthInitializer> */}
        </PersistGate>
    </Provider>
  );
}