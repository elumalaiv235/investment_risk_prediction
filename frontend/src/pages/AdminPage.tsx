import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Activity,
  Layers,
  Sliders,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';
import { AdminStats } from '../types';
import { formatDate } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { Card, CardHeader } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { CategoryDistributionChart } from '../components/charts/CategoryDistributionChart';
import { TableSkeleton } from '../components/common/Skeleton';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Weight simulator test states
  const [weights, setWeights] = useState({
    financialCapacity: 20,
    emergencySavings: 15,
    horizon: 15,
    debt: 10,
    knowledge: 10,
    volatility: 10,
    age: 10,
    goal: 5,
    experience: 5,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData] = await Promise.all([
        api.admin.getStats(),
        api.admin.getUsers(1, 20),
      ]);
      setStats(statsData);
      if (usersData && usersData.data) {
        setUsers(usersData.data);
        if (usersData.meta) setMeta(usersData.meta);
      } else if (Array.isArray(usersData)) {
        setUsers(usersData);
      }
    } catch (err) {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleToggle = async (user: any) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    setUpdatingId(user.id);
    try {
      await api.admin.updateUserRole(user.id, newRole);
      fetchData();
    } catch (err) {
      // Ignore
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-2">
          <Shield className="w-3.5 h-3.5" />
          <span>Chief Risk Officer & Administrator Console</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Platform Administration & Model Telemetry
        </h1>
        <p className="text-xs text-slate-500">
          Anonymous aggregate risk distribution, user registry, and multivariate scoring calibration.
        </p>
      </div>

      {/* 1. KEY AGGREGATE METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registered Users</span>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {stats?.totalUsers || 0}
          </p>
          <span className="text-[11px] text-slate-400">Active investor profiles</span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Assessments</span>
            <Activity className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {stats?.totalAssessments || 0}
          </p>
          <span className="text-[11px] text-slate-400">Quantitative evaluations</span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Platform Score</span>
            <TrendingUp className="w-5 h-5 text-teal-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {stats?.averagePlatformScore || 0}
            <span className="text-xs font-normal text-slate-400"> / 100</span>
          </p>
          <span className="text-[11px] text-slate-400">Calibrated risk average</span>
        </Card>
      </div>

      {/* 2. PLATFORM RISK DISTRIBUTION & MODEL WEIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Distribution Chart */}
        <Card className="lg:col-span-5 p-6">
          <CardHeader
            title="Platform-Wide Risk Distribution"
            subtitle="Anonymous aggregate assessment tier distribution"
          />
          <CategoryDistributionChart data={stats?.categoryDistribution || []} height={260} />
        </Card>

        {/* Scoring Weight Configuration Overview */}
        <Card className="lg:col-span-7 p-6">
          <CardHeader
            title="Engine Weighting Calibration"
            subtitle="Normalized 9-factor model weight architecture"
          />
          <div className="space-y-2 text-xs">
            {[
              { name: 'Financial Capacity & Cashflow', weight: '20%' },
              { name: 'Emergency Reserves Liquidity', weight: '15%' },
              { name: 'Investment Time Horizon', weight: '15%' },
              { name: 'Debt-to-Asset Burden', weight: '10%' },
              { name: 'Market Knowledge & Literacy', weight: '10%' },
              { name: 'Psychological Volatility Tolerance', weight: '10%' },
              { name: 'Age & Life Stage', weight: '10%' },
              { name: 'Primary Objective Orientation', weight: '5%' },
              { name: 'Historical Experience & Priority', weight: '5%' },
            ].map((w, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-700 dark:text-slate-300 font-medium">{w.name}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{w.weight}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 3. USER MANAGEMENT REGISTRY */}
      <Card className="p-6">
        <CardHeader
          title="User Management Registry"
          subtitle="List of registered investors and authorization roles"
        />

        {loading ? (
          <TableSkeleton rows={4} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Joined Date</th>
                  <th className="p-3">Assessments</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3 text-right">Role Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="p-3 text-slate-500">{u.email}</td>
                    <td className="p-3 text-slate-500">{formatDate(u.createdAt)}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {u._count?.assessments || 0}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        isLoading={updatingId === u.id}
                        onClick={() => handleRoleToggle(u)}
                      >
                        Toggle {u.role === 'ADMIN' ? 'to USER' : 'to ADMIN'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
