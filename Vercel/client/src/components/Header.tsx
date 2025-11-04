import { Shield } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b bg-background h-16 flex items-center px-6" data-testid="header-main">
      <div className="flex items-center gap-3">
        <Shield className="h-7 w-7 text-primary" data-testid="icon-logo" />
        <div>
          <h1 className="text-xl font-semibold text-foreground" data-testid="text-app-title">
            SkinDoc AI
          </h1>
          <p className="text-xs text-muted-foreground" data-testid="text-app-subtitle">
            Dermatoscope Analysis
          </p>
        </div>
      </div>
    </header>
  );
}
