/**
 * Dashboard Page
 * Shows overview statistics and analytics charts
 */

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { dashboardApi, AnalyticsData } from '../../api/endpoints/dashboard';
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

const RATING_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

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
        <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">{title}</p>
        <p className="text-4xl font-bold text-secondary-900 dark:text-white mb-2">
          {value.toLocaleString()}
        </p>
        <p className="text-sm text-secondary-400 dark:text-secondary-500">{description}</p>
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
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, analyticsResponse] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getAnalytics(),
        ]);
        setStats(statsResponse.data);
        setAnalytics(analyticsResponse.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
          Welcome to Dashboard
        </h1>
        <p className="text-secondary-500 dark:text-secondary-400">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
              <StatCard
                title="Total Ratings"
                value={analytics?.totalRatings || 0}
                description={`Avg: ${(analytics?.averageRating || 0).toFixed(1)} / 5`}
                color="amber"
              />
            </div>
          </div>

          {analytics && (
            <>
              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Student Growth Chart */}
                <Card>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Student Registrations (Last 7 Days)
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.studentGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-secondary-700" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={formatDate}
                          stroke="#94a3b8"
                          fontSize={12}
                        />
                        <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                        <Tooltip
                          labelFormatter={formatDate}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="count"
                          name="Students"
                          stroke="#06b6d4"
                          strokeWidth={3}
                          dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: '#0891b2' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Rating Distribution Chart */}
                <Card>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Lessons by Rating
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.ratingDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-secondary-700" />
                        <XAxis
                          dataKey="rating"
                          stroke="#94a3b8"
                          fontSize={12}
                          tickFormatter={(value) => `${value} Star${value > 1 ? 's' : ''}`}
                        />
                        <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                        <Tooltip
                          labelFormatter={(value) => `${value} Star${Number(value) > 1 ? 's' : ''}`}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                          }}
                        />
                        <Bar dataKey="count" name="Lessons" radius={[4, 4, 0, 0]}>
                          {analytics.ratingDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={RATING_COLORS[entry.rating - 1]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Favorited Lessons */}
                <Card>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Top Favorited Lessons
                  </h3>
                  {analytics.topFavoritedLessons.length > 0 ? (
                    <div className="space-y-4">
                      {analytics.topFavoritedLessons.map((lesson, index) => (
                        <div key={lesson.id} className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-secondary-900 dark:text-white truncate">
                              {lesson.title}
                            </p>
                            <p className="text-sm text-secondary-500 dark:text-secondary-400">
                              Rating: {lesson.rating.toFixed(1)} / 5
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                              {lesson.favoriteCount}
                            </p>
                            <p className="text-xs text-secondary-400 dark:text-secondary-500">favorites</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary-500 dark:text-secondary-400 text-center py-8">
                      No lessons have been favorited yet
                    </p>
                  )}
                </Card>

                {/* Recent Students */}
                <Card>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                    Recent Students
                  </h3>
                  {analytics.recentStudents.length > 0 ? (
                    <div className="space-y-4">
                      {analytics.recentStudents.map((student) => (
                        <div key={student.id} className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-indigo to-indigo-600 flex items-center justify-center text-white font-bold">
                            {student.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-secondary-900 dark:text-white truncate">
                              {student.fullName}
                            </p>
                            <p className="text-sm text-secondary-500 dark:text-secondary-400 truncate">
                              {student.email}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-secondary-400 dark:text-secondary-500">
                              {new Date(student.createdAt).toLocaleDateString()}
                            </p>
                            {student.className && (
                              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                {student.className}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary-500 dark:text-secondary-400 text-center py-8">
                      No students registered yet
                    </p>
                  )}
                </Card>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
