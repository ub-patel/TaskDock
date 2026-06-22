export function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <h1 className="text-4xl font-bold mb-2">TaskDock</h1>
      <p className="text-muted-foreground mb-8">Authentication Portal</p>
      <div className="w-full max-w-md p-6 bg-card border border-border rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Login Shell</h2>
        <p className="text-sm text-muted-foreground text-center">Authentication controls will be implemented in Phase 2.</p>
      </div>
    </div>
  );
}
