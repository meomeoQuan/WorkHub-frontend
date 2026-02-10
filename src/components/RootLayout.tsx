import { AuthProvider } from '../contexts/AuthContext';
import { Layout } from './Layout';

export function RootLayout() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}
