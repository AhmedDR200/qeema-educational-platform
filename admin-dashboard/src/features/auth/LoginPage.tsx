/**
 * Admin Login Page
 */

import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input, Alert, Card } from '../../components/ui';

interface LocationState {
  from?: { pathname: string };
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as LocationState)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-primary-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 mb-4 shadow-lg shadow-primary-500/30">
            <span className="text-white font-bold text-2xl">Q</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-secondary-400 mt-1">Sign in to manage your school</p>
        </div>

        <Card className="animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="error" onDismiss={() => setError('')}>
                {error}
              </Alert>
            )}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@school.com"
              required
              autoComplete="email"
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
              className="mt-6"
            >
              Sign In
            </Button>
          </form>
        </Card>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-secondary-800/50 rounded-lg border border-secondary-700">
          <p className="text-xs text-secondary-400 text-center">
            <span className="font-medium text-secondary-300">Demo Admin:</span>{' '}
            admin@school.com / Admin123!
          </p>
        </div>
      </div>
    </div>
  );
}

