'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '../../home/components/Navbar';
import JobApplyModal from '@/src/modules/jobs/components/JobApplyModal';
import { getJobByIdAction } from '@/src/modules/jobs/actions/job.actions';
import { IJob } from '@/src/modules/jobs/interfaces/job.interface';

interface JobDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [job, setJob] = useState<IJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      setJobId(id);
    });
  }, [params]);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      try {
        const data = await getJobByIdAction(jobId);
        setJob(data);
      } catch (err: any) {
        setError(err.message || 'Error cargando el empleo');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'junior':
        return 'badge-info';
      case 'mid':
        return 'badge-warning';
      case 'senior':
        return 'badge-success';
      case 'lead':
        return 'badge-error';
      default:
        return 'badge-ghost';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'badge-primary';
      case 'part-time':
        return 'badge-secondary';
      case 'contract':
        return 'badge-accent';
      case 'freelance':
        return 'badge-ghost';
      default:
        return 'badge-ghost';
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salario no especificado';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `Desde $${min.toLocaleString()}`;
    if (max) return `Hasta $${max.toLocaleString()}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-base-200">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="min-h-screen bg-base-200">
        <Navbar />
        <div className="container mx-auto px-6 py-12">
          <div className="alert alert-error">
            <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2" />
            </svg>
            <span>{error || 'Empleo no encontrado'}</span>
          </div>
        </div>
      </main>
    );
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'full-time': 'Full Time',
      'part-time': 'Part Time',
      'contract': 'Contrato',
      'freelance': 'Freelance',
    };
    return labels[type] || type;
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      'junior': '👶 Junior',
      'mid': '🧑 Mid Level',
      'senior': '👨‍💼 Senior',
      'lead': '🎯 Lead',
    };
    return labels[level] || level;
  };

  return (
    <main className="min-h-screen bg-base-200">
      {/* Navbar */}
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-base-100 px-6 py-4">
        <div className="container mx-auto">
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <Link href="/jobs" className="link link-hover">Empleos</Link>
              </li>
              <li>{job.title}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="px-6 py-8 bg-base-100">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-3">{job.title}</h1>
              <p className="text-xl text-base-content/70 mb-4">{job.company}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`badge badge-lg ${getTypeBadgeColor(job.type)}`}>
                  {getTypeLabel(job.type)}
                </span>
                <span className={`badge badge-lg ${getLevelBadgeColor(job.level ?? "junior")}`}>
                  {getLevelLabel(job.level ?? "junior")}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setShowApplyModal(true)}
              className="btn btn-primary btn-lg gap-2 md:btn-md md:btn-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Solicitar Empleo
            </button>
          </div>

          {/* Key Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <p className="text-sm opacity-70">Salario</p>
                <p className="font-semibold text-lg">{formatSalary(job.salary_min, job.salary_max)}</p>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body p-4">
                <p className="text-sm opacity-70">📍 Ubicación</p>
                <p className="font-semibold">{job.location}</p>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body p-4">
                <p className="text-sm opacity-70">Tipo</p>
                <p className="font-semibold capitalize">{getTypeLabel(job.type)}</p>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body p-4">
                <p className="text-sm opacity-70">Publicado</p>
                <p className="font-semibold text-sm">Hace 2 días</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Descripción del Puesto</h2>
                <div className="prose prose-sm max-w-none">
                  <p className="text-base-content/80 whitespace-pre-wrap leading-relaxed">
                    {job.description}
                  </p>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Requisitos</h2>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span>Experiencia mínima en la industria (según nivel)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span>Sólidos conocimientos en {job.tags?.length ? job.tags[0] : 'tecnologías relevantes'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span>Excelentes habilidades de comunicación</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span>Capacidad para trabajar en equipo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span>Disposición para aprender nuevas tecnologías</span>
                  </li>
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h2 className="text-2xl font-bold mb-4">¿Qué Ofrecemos?</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="card bg-success/10 border border-success/20">
                    <div className="card-body p-4">
                      <p className="font-semibold text-sm">💰 Salario competitivo</p>
                      <p className="text-xs opacity-70">Acorde a tu experiencia y mercado</p>
                    </div>
                  </div>
                  <div className="card bg-success/10 border border-success/20">
                    <div className="card-body p-4">
                      <p className="font-semibold text-sm">🏠 Trabajo remoto</p>
                      <p className="text-xs opacity-70">Totalmente flexible desde casa</p>
                    </div>
                  </div>
                  <div className="card bg-success/10 border border-success/20">
                    <div className="card-body p-4">
                      <p className="font-semibold text-sm">📚 Desarrollo profesional</p>
                      <p className="text-xs opacity-70">Cursos y certificaciones pagadas</p>
                    </div>
                  </div>
                  <div className="card bg-success/10 border border-success/20">
                    <div className="card-body p-4">
                      <p className="font-semibold text-sm">🎯 Equipo increíble</p>
                      <p className="text-xs opacity-70">Profesionales apasionados</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Apply Card */}
              <div className="card bg-primary text-primary-content sticky top-20">
                <div className="card-body">
                  <h3 className="card-title text-lg">¿Te interesa este puesto?</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Postúlate ahora y sé parte de nuestro equipo
                  </p>
                  <button 
                    onClick={() => setShowApplyModal(true)}
                    className="btn btn-accent w-full mb-2"
                  >
                    Solicitar Empleo
                  </button>
                  <button className="btn btn-ghost btn-outline text-primary-content btn-sm w-full">
                    Compartir
                  </button>
                </div>
              </div>

              {/* Skills */}
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-4">Tecnologías</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags?.map((tag, idx) => (
                      <span key={idx} className="badge badge-primary badge-outline">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-4">Sobre {job.company}</h3>
                  <p className="text-sm opacity-80 mb-4">
                    {job.company} es una empresa líder en la industria tecnológica, con presencia global y equipo remoto.
                  </p>
                  <button className="btn btn-outline btn-sm w-full">
                    Ver más ofertas
                  </button>
                </div>
              </div>

              {/* Similar Jobs */}
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-4">Ofertas Similares</h3>
                  <p className="text-sm opacity-70">Las ofertas similares estarán disponibles próximamente</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent text-accent-content py-12 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">¿No encontraste lo que buscas?</h2>
          <p className="mb-6 opacity-90 max-w-2xl mx-auto">
            Crea una alerta de empleo personalizada y recibe notificaciones cuando se publique algo que coincida con tu perfil
          </p>
          <Link href="/job-alerts/subscribe" className="btn btn-primary">
            Crear Alerta
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <p className="font-bold">Job Board</p>
          <p>© {new Date().getFullYear()} Job Board — Encuentra tu trabajo perfecto</p>
        </div>
      </footer>

      {/* Apply Modal */}
      {job && (
        <JobApplyModal 
          jobId={job.id}
          jobTitle={job.title}
          company={job.company}
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </main>
  );
}
