import { ErrorBoundary } from 'react-error-boundary';
import DashboardTab from '../pages/admin/dashboard/DashboardTab';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  );
}

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <DashboardTab/>
</ErrorBoundary>