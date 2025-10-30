import { Button } from "../components/ui/button"

export default function TestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-foreground">Test Page</h1>
        <Button>Test Button</Button>
      </div>
    </div>
  );
}