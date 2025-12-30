/**
 * Dashboard Page
 * Shows overview statistics
 */

import { useState, useEffect } from 'react';
import { dashboardApi } from '../../api/endpoints/dashboard';
import { Card, Spinner, Alert } from '../../components/ui';
import { DashboardStats } from '../../types';

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  color: 'cyan' | 'indigo' | 'emerald' | 'amber';
}

const colorStyles = {
  cyan: 'from-primary-500 to-primary-600 shadow-primary-500/30',
  indigo: 'from-accent-indigo to-indigo-600 shadow-accent-indigo/30',
  emerald: 'from-accent-emerald to-emerald-600 shadow-accent-emerald/30',
  amber: 'from-accent-amber to-amber-600 shadow-accent-amber/30',
};

function StatCard({ title, value, description, color }: StatCardProps) {
  return (
    <Card padding="lg" className="relative overflow-hidden group">
      {/* Background decoration */}
      <div
        className={`
          absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10
          bg-gradient-to-br ${colorStyles[color]}
          group-hover:opacity-20 transition-opacity
        `}
      />

      <div className="relative">
        <p className="text-sm font-medium text-secondary-500 mb-1">{title}</p>
        <p className="text-4xl font-bold text-secondary-900 mb-2">
          {value.toLocaleString()}
        </p>
        <p className="text-sm text-secondary-400">{description}</p>
      </div>

      {/* Accent bar */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 h-1
          bg-gradient-to-r ${colorStyles[color]}
        `}
      />
    </Card>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardApi.getStats();
        setStats(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">
          Welcome to Dashboard
        </h1>
        <p className="text-secondary-500">
          Here's an overview of your school's statistics
        </p>
      </div>

      {error && (
        <Alert variant="error" className="mb-6" onDismiss={() => setError('')}>
          {error}
        </Alert>
      )}

      {stats && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
              <StatCard
                title="Total Students"
                value={stats.totalStudents}
                description="Registered students"
                color="cyan"
              />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <StatCard
                title="Total Lessons"
                value={stats.totalLessons}
                description="Available lessons"
                color="indigo"
              />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <StatCard
                title="Total Favorites"
                value={stats.totalFavorites}
                description="Lessons favorited"
                color="emerald"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <a
                  href="/students"
                  className="block p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                >
                  <p className="font-medium text-secondary-900">Manage Students</p>
                  <p className="text-sm text-secondary-500">
                    Add, edit, or remove student accounts
                  </p>
                </a>
                <a
                  href="/lessons"
                  className="block p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                >
                  <p className="font-medium text-secondary-900">Manage Lessons</p>
                  <p className="text-sm text-secondary-500">
                    Create and update lesson content
                  </p>
                </a>
                <a
                  href="/school"
                  className="block p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                >
                  <p className="font-medium text-secondary-900">School Profile</p>
                  <p className="text-sm text-secondary-500">
                    Update school information
                  </p>
                </a>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                System Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-secondary-100">
                  <span className="text-secondary-500">Platform Version</span>
                  <span className="font-medium text-secondary-900">1.0.0</span>
                </div>
                <div className="flex justify-between py-2 border-b border-secondary-100">
                  <span className="text-secondary-500">API Status</span>
                  <span className="font-medium text-green-600">Connected</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-secondary-500">Last Updated</span>
                  <span className="font-medium text-secondary-900">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

