import { ReactNode } from "react";
import { HeaderBar } from "./HeaderBar";
import { Sidebar } from "./Sidebar";

interface TwoColumnShellProps {
  children: ReactNode;
}

export const TwoColumnShell = ({ children }: TwoColumnShellProps) => {
  return (
    <div className="shell-wrapper">
      <HeaderBar />
      <div className="shell-container">
        <Sidebar />
        <main className="shell-main" role="main">
          {children}
        </main>
      </div>

      <style>{`
        .shell-wrapper {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
        }

        .shell-container {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .shell-main {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: var(--space-8);
          max-width: var(--content-max-width);
          margin: 0 auto;
          width: 100%;
          outline: none;
        }

        .shell-main:focus {
          outline: 2px solid var(--color-blue);
          outline-offset: -2px;
        }

        /* Desktop */
        @media (min-width: 769px) {
          .shell-main {
            margin-left: var(--sidebar-width);
          }
        }

        /* Tablet & mobile */
        @media (max-width: 768px) {
          .shell-container {
            flex-direction: column;
          }

          .shell-main {
            padding: var(--space-6);
            margin-left: 0;
            margin-top: 60px; /* Space for hamburger menu */
          }
        }

        /* Small mobile */
        @media (max-width: 640px) {
          .shell-main {
            padding: var(--space-4);
          }
        }
      `}</style>
    </div>
  );
};
