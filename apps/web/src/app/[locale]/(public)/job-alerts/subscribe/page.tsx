'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '../../home/components/Navbar';

export default function SubscribeAlertsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    search_pattern: '',
    job_type: '',
    level: '',
    location: '',
    salary_min: '',
    salary_max: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleLoginRequired = () => {
    router.push('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Clean up empty values to avoid sending empty strings for numbers
      const payload: any = { ...formData };
      if (payload.salary_min === '') delete payload.salary_min;
      else payload.salary_min = Number(payload.salary_min);

      if (payload.salary_max === '') delete payload.salary_max;
      else payload.salary_max = Number(payload.salary_max);

      // Remove empty strings for optional text fields if needed, 
      // though DTO might handle them if they are optional.
      // Better to accept them as is or clean them.

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      const response = await fetch(`${API_URL}/job-alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization if needed, but currently backend seems open or handled via session if we proxy
          // Assuming direct call for now based on other components or if we have the token
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create alert');
      }

      const data = await response.json();
      console.log('Alert created:', data);

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          email: '',
          search_pattern: '',
          job_type: '',
          level: '',
          location: '',
          salary_min: '',
          salary_max: '',
        });
      }, 3000);
    } catch (error) {
      console.error('Error creating alert:', error);
      // Could add an error state here to show to user
    }
  };

  return (
    <main className="min-h-screen bg-base-200">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="hero min-h-[30vh] bg-gradient-to-r from-accent to-primary text-primary-content px-6">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Alertas de Empleo</h1>
            <p className="text-lg opacity-90">
              Suscríbete y recibe notificaciones de nuevas ofertas que coincidan con tu perfil
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-2xl">
          {!session ? (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <div className="alert alert-warning mb-6">
                  <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0H8m4 0h4m-9-9a9 9 0 1118 0 9 9 0 01-18 0z" />
                  </svg>
                  <div>
                    <h3 className="font-bold">Debes estar logueado para recibir alertas de empleo</h3>
                    <div className="text-sm">Inicia sesión en tu cuenta para poder suscribirte a notificaciones de empleos.</div>
                  </div>
                </div>
                <div className="flex gap-3 flex-col sm:flex-row justify-center">
                  <Link href="/jobs" className="btn btn-ghost">
                    Volver a empleos
                  </Link>
                  <button onClick={() => router.push('/login')} className="btn btn-primary">
                    Iniciar Sesión
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-6">Configurar mi alerta</h2>

                  <form onSubmit={handleSubmit}>
                    {/* Email - Required */}
                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text font-semibold">
                          Email <span className="text-error">*</span>
                        </span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="tu@email.com"
                        className="input input-bordered"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <label className="label">
                        <span className="label-text-alt">Usaremos este email para enviarte las notificaciones</span>
                      </label>
                    </div>

                    {/* Search Pattern */}
                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text font-semibold">Palabras clave</span>
                      </label>
                      <input
                        type="text"
                        name="search_pattern"
                        placeholder="Ej: React, Python, Senior Developer..."
                        className="input input-bordered"
                        value={formData.search_pattern}
                        onChange={handleChange}
                      />
                      <label className="label">
                        <span className="label-text-alt">Déjalo vacío para recibir todas las ofertas</span>
                      </label>
                    </div>

                    {/* Grid for multiple fields */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      {/* Job Type */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Tipo de empleo</span>
                        </label>
                        <select
                          name="job_type"
                          className="select select-bordered"
                          value={formData.job_type}
                          onChange={handleChange}
                        >
                          <option value="">Cualquiera</option>
                          <option value="full-time">Full Time</option>
                          <option value="part-time">Part Time</option>
                          <option value="contract">Contrato</option>
                          <option value="freelance">Freelance</option>
                        </select>
                      </div>

                      {/* Level */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Nivel profesional</span>
                        </label>
                        <select
                          name="level"
                          className="select select-bordered"
                          value={formData.level}
                          onChange={handleChange}
                        >
                          <option value="">Cualquiera</option>
                          <option value="junior">Junior</option>
                          <option value="mid">Mid Level</option>
                          <option value="senior">Senior</option>
                          <option value="lead">Lead</option>
                        </select>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text font-semibold">Ubicación</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        placeholder="Ej: Madrid, Remoto, Barcelona..."
                        className="input input-bordered"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Salary Range */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Salario mínimo</span>
                        </label>
                        <input
                          type="number"
                          name="salary_min"
                          placeholder="20000"
                          className="input input-bordered"
                          value={formData.salary_min}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Salario máximo</span>
                        </label>
                        <input
                          type="number"
                          name="salary_max"
                          placeholder="80000"
                          className="input input-bordered"
                          value={formData.salary_max}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Alert Success */}
                    {submitted && (
                      <div className="alert alert-success mb-4">
                        <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>¡Alerta creada exitosamente! Revisa tu email para confirmar.</span>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="card-actions justify-between mt-6">
                      <Link href="/jobs" className="btn btn-ghost">
                        Volver
                      </Link>
                      <button type="submit" className="btn btn-primary">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        Suscribirse
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Info Cards */}
              {session && (
                <div className="grid md:grid-cols-3 gap-4 mt-8">
                  <div className="card bg-base-100 shadow">
                    <div className="card-body">
                      <h3 className="card-title text-sm">📧 Notificaciones</h3>
                      <p className="text-sm text-base-content/70">Recibe emails inmediatos cuando hay ofertas nuevas</p>
                    </div>
                  </div>

                  <div className="card bg-base-100 shadow">
                    <div className="card-body">
                      <h3 className="card-title text-sm">⚙️ Personalizado</h3>
                      <p className="text-sm text-base-content/70">Configura tus preferencias de búsqueda</p>
                    </div>
                  </div>

                  <div className="card bg-base-100 shadow">
                    <div className="card-body">
                      <h3 className="card-title text-sm">🔄 Flexible</h3>
                      <p className="text-sm text-base-content/70">Modifica o cancela en cualquier momento</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-6 bg-base-100">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Preguntas Frecuentes</h2>

          <div className="join join-vertical w-full">
            <div className="collapse collapse-arrow join-item border border-base-300">
              <input type="radio" name="faq" defaultChecked />
              <div className="collapse-title font-semibold">¿Con qué frecuencia recibiré notificaciones?</div>
              <div className="collapse-content">
                <p>Recibirás notificaciones cada vez que se publique un empleo que coincida con tus criterios de búsqueda.</p>
              </div>
            </div>

            <div className="collapse collapse-arrow join-item border border-base-300">
              <input type="radio" name="faq" />
              <div className="collapse-title font-semibold">¿Puedo cambiar mis preferencias después?</div>
              <div className="collapse-content">
                <p>Sí, puedes editar o eliminar tu alerta en cualquier momento. Encontrarás un enlace en cada email de notificación.</p>
              </div>
            </div>

            <div className="collapse collapse-arrow join-item border border-base-300">
              <input type="radio" name="faq" />
              <div className="collapse-title font-semibold">¿Será mi email compartido con terceros?</div>
              <div className="collapse-content">
                <p>No, tu email solo se usa para enviarte notificaciones de empleos. Nunca lo compartimos con terceros.</p>
              </div>
            </div>

            <div className="collapse collapse-arrow join-item border border-base-300">
              <input type="radio" name="faq" />
              <div className="collapse-title font-semibold">¿Puedo tener múltiples alertas?</div>
              <div className="collapse-content">
                <p>Por supuesto, puedes crear tantas alertas como desees con diferentes criterios.</p>
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
