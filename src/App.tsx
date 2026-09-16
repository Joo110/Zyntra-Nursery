import { QueryProvider } from '@/app/providers/QueryProvider';
import { ToastProvider } from '@/app/providers/ToastProvider';
import { AppRouter } from '@/app/router/AppRouter';

export default function App() {
  return (
    <QueryProvider>
      <AppRouter />
      <ToastProvider />
    </QueryProvider>
  );
}
