import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Calendar,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ArrowUpDown,
  PlusCircle,
  FileText,
} from 'lucide-react';
import { api } from '../services/api';
import { RiskAssessment } from '../types';
import { formatDate, formatCurrency } from '../utils/formatters';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card, CardHeader } from '../components/common/Card';
import { TableSkeleton } from '../components/common/Skeleton';
import { Modal } from '../components/common/Modal';

export const RiskHistoryPage: React.FC = () => {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.risk.getHistory({
        page,
        limit: 10,
        search,
        category: category !== 'ALL' ? category : undefined,
        sortBy,
        sortOrder,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      if (res && res.data) {
        setAssessments(res.data);
        if (res.meta) setMeta(res.meta);
      } else if (Array.isArray(res)) {
        setAssessments(res);
      }
    } catch (err) {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, [category, sortBy, sortOrder, startDate, endDate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory(1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.risk.deleteById(deleteId);
      setDeleteId(null);
      fetchHistory(meta.page);
    } catch (err) {
      // Ignore
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Prediction History
          </h1>
          <p className="text-xs text-slate-500">
            Review all previous risk evaluations, parameter snapshots, and printable reports.
          </p>
        </div>
        <Link to="/assess">
          <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
            New Assessment
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 sm:p-5">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by goal or horizon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="LOW RISK">Low Risk (0-30)</option>
              <option value="MODERATE RISK">Moderate Risk (31-60)</option>
              <option value="HIGH RISK">High Risk (61-80)</option>
              <option value="VERY HIGH RISK">Very High Risk (81-100)</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="lg:col-span-3">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [f, o] = e.target.value.split('-');
                setSortBy(f);
                setSortOrder(o as 'asc' | 'desc');
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="createdAt-desc">Date (Newest First)</option>
              <option value="createdAt-asc">Date (Oldest First)</option>
              <option value="riskScore-desc">Score (Highest First)</option>
              <option value="riskScore-asc">Score (Lowest First)</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-2">
            <Button type="submit" variant="secondary" size="sm" className="w-full h-full">
              Filter Records
            </Button>
          </div>
        </form>
      </Card>

      {/* History Table */}
      <Card className="p-6">
        {loading ? (
          <TableSkeleton rows={5} />
        ) : assessments.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <ShieldAlert className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No matching assessments found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search criteria or submit a new risk assessment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3">Planned Investment</th>
                  <th className="p-3">Goal</th>
                  <th className="p-3">Horizon</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {assessments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-mono text-[11px] text-slate-400">
                      #{a.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      {formatDate(a.createdAt)}
                    </td>
                    <td className="p-3">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {a.riskScore}
                        <span className="text-[10px] text-slate-400 font-normal"> / 100</span>
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge riskCategory={a.riskCategory} size="sm" />
                    </td>
                    <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                      {formatCurrency(a.investmentAmount)}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{a.investmentGoal}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{a.investmentHorizon}</td>
                    <td className="p-3 text-right space-x-1">
                      <Link to={`/history/${a.id}`}>
                        <Button variant="ghost" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                          Details
                        </Button>
                      </Link>
                      <button
                        onClick={() => setDeleteId(a.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-500">
              Showing page {meta.page} of {meta.totalPages} ({meta.total} total assessments)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={meta.page <= 1}
                onClick={() => fetchHistory(meta.page - 1)}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={meta.page >= meta.totalPages}
                onClick={() => fetchHistory(meta.page + 1)}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to delete this historical assessment record? This action will permanently remove its associated factor calculations from your dashboard timeline.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={deleting}
              onClick={handleDelete}
            >
              Delete Record
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
