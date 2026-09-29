import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";

import App from "./app/App";
import i18n, { i18nReady } from "./i18n";

// Import global styles
import "./index.css";

// Import fonts
import "@fontsource-variable/inter/index.css"; // for body text
import "@fontsource/bai-jamjuree/400.css"; // Regular
import "@fontsource/bai-jamjuree/400-italic.css"; // Regular Italic
import "@fontsource/bai-jamjuree/500.css"; // Medium
import "@fontsource/bai-jamjuree/600.css"; // SemiBold
import "@fontsource/bai-jamjuree/700.css"; // Bold
import "@fontsource/bai-jamjuree/700-italic.css"; // Bold Italic

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    'Failed to find the root element. Make sure you have a <div id="root"></div> in your index.html file.',
  );
}

// Render once translations are loaded so components do not suspend on first paint
i18nReady.finally(() => {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </I18nextProvider>
    </React.StrictMode>,
  );
});
