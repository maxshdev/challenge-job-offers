'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '../home/components/Navbar';
import { useTranslations } from 'next-intl';
import { getJobsAction } from '@/src/modules/jobs/actions/job.actions';
import JobsGrid from '@/src/modules/jobs/components/JobsGrid';
import JobFilters from '@/src/modules/jobs/components/JobFilters';
import { IJob } from '@/src/modules/jobs/interfaces/job.interface';

/* eslint-disable react-hooks/exhaustive-deps */
export default function JobsPage() {
  const t = useTranslations('Public');
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<any>({});

  const fetchJobs = useCallback(async (filters: any = {}, pageNum = 1) => {
    setLoading(true);
    try {
      // Store current filters for pagination calls
      setCurrentFilters(filters);

      const response = await getJobsAction({
        ...filters,
        includeExternal: true,
        page: pageNum,
        limit
      });

      // Handle both array response (legacy/fallback) and paginated response
      if (Array.isArray(response)) {
        setJobs(response);
        setTotal(response.length);
      } else {
        setJobs(response.data);
        setTotal(response.total);
        setPage(response.page);
      }
    } catch (err: any) {
      setError(err.message || 'Error cargando empleos');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Initial fetch handled by JobFilters which calls onFilterChange on mount
  // But we need to make sure handleFilterChange resets page to 1

  const handleFilterChange = useCallback((filters: any) => {
    setPage(1); // Reset to first page on filter change
    fetchJobs(filters, 1);
  }, [fetchJobs]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchJobs(currentFilters, newPage);
    // Scroll to top of grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="min-h-screen bg-base-200">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="hero min-h-[40vh] bg-gradient-to-r from-primary to-secondary text-primary-content px-6">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Ofertas de Empleo</h1>
            <p className="text-xl opacity-90">
              Encuentra tu siguiente oportunidad laboral en nuestras mejores empresas
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 px-6 bg-base-100">
        <div className="container mx-auto">
          <JobFilters onFilterChange={handleFilterChange} />
        </div>
      </section>

      {/* Jobs Grid */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {total} oferta{total !== 1 ? 's' : ''} encontrada{total !== 1 ? 's' : ''}
            </h2>
            <button className="btn btn-outline btn-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Ordenar
            </button>
          </div>

          {error && (
            <div className="alert alert-error mb-6">
              <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <JobsGrid jobs={jobs} loading={loading} />

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="join">
                <button
                  className="join-item btn"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  «
                </button>
                <div className="join-item btn pointer-events-none">
                  Página {page} de {totalPages}
                </div>
                <button
                  className="join-item btn"
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="bg-primary text-primary-content py-12 px-6">
        <div className="container mx-auto">
          <div className="card bg-primary-focus">
            <div className="card-body text-center">
              <h3 className="card-title justify-center text-2xl mb-4">No te pierdas nuevas ofertas</h3>
              <p className="mb-6 opacity-90">
                Suscríbete a nuestras alertas y recibe notificaciones de empleos que coincidan con tu perfil
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                <Link href="/job-alerts/subscribe" className="btn btn-accent">
                  Suscribirse a alertas
                </Link>
                <button className="btn btn-ghost">
                  Ir al inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <p className="font-bold">Job Board</p>
          <p>© {new Date().getFullYear()} Job Board — Encuentra tu trabajo perfecto</p>
        </div>
      </footer>
    </main>
  );
}