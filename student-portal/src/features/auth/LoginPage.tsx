/**
 * Login Page
 * Handles student authentication
 */

import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

  const from = (location.state as LocationState)?.from?.pathname || '/lessons';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-100 opacity-50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary-100 opacity-50 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 mb-4 shadow-lg shadow-primary-500/30">
            <span className="text-white font-bold text-2xl">Q</span>
          </div>
          <h1 className="text-2xl font-bold text-secondary-900">Welcome back</h1>
          <p className="text-secondary-500 mt-1">Sign in to continue learning</p>
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
              placeholder="student@example.com"
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

          <div className="mt-6 pt-6 border-t border-secondary-100 text-center">
            <p className="text-sm text-secondary-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </Card>

        {/* Demo credentials hint */}
        <div className="mt-6 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
          <p className="text-xs text-secondary-500 text-center">
            <span className="font-medium">Demo Student:</span> Register a new account to get started
          </p>
        </div>
      </div>
    </div>
  );
}

