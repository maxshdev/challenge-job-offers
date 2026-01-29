'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { applyJobAction } from '../actions/job.actions';
import { IJobApplication } from '../interfaces/job.interface';

interface ApplyFormProps {
  jobId: string;
  jobTitle: string;
  company: string;
  onClose: () => void;
}

export default function ApplyForm({ jobId, jobTitle, company, onClose }: ApplyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const applicationData = {
        email: email,
      };

      await applyJobAction(jobId, applicationData);
      setSubmitted(true);

      setTimeout(() => {
        onClose();
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al enviar la aplicación');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="alert alert-success">
        <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="font-bold">¡Aplicación enviada!</h3>
          <div className="text-sm">
            Hemos recibido tu aplicación para {jobTitle} en {company}. Te contactaremos pronto.
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="alert alert-error">
          <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Email</span>
        </label>
        <input
          type="email"
          placeholder="tu@email.com"
          className="input input-bordered"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost flex-1"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary flex-1"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Enviando...
            </>
          ) : (
            'Enviar Aplicación'
          )}
        </button>
      </div>
    </form>
  );
}
