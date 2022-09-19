// We can delete this file and put the imports directly into
// withImportsInjected after all customers migrate off of
// TipInfo and TipWarning.
import { ReactNode } from "react";
import { Info, Warning, Note, Tip, Check } from "@mintlify/components";

export { Info, Warning, Note, Tip, Check };

// 8/11/22 - Deprecate once everyone migrates
export const TipInfo = ({ children }: { children: ReactNode }) => {
  return <Info>{children}</Info>;
};

// 8/11/22 Deprecate once everyone migrates
export const TipWarning = ({ children }: { children: ReactNode }) => {
  return <Warning>{children}</Warning>;
};
