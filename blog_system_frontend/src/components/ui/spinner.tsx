import { Loader2 } from 'lucide-react';

function Spinner() {
  return <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />;
}

function PageLoader() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <Spinner />
    </div>
  );
}

function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner />
    </div>
  );
}

export { Spinner, PageLoader, FullPageLoader };
