import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "rsuite/dist/rsuite.css";

import { App } from "./App.tsx";
import styles from "./styles/AppShell.module.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className={styles.root}>
      <App />
    </div>
  </StrictMode>,
);
