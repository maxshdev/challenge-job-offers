'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IJob } from '../interfaces/job.interface';

interface PublicApplyFormProps {
  job: IJob;
  onSuccess: () => void;
}

export default function PublicApplyForm({ job, onSuccess }: PublicApplyFormProps) {
  const t = useTranslations('Public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    cover_letter: '',
    resume_url: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/jobs/${job.id}/apply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar tu aplicación');
      }

      // Reset form
      setFormData({
        email: '',
        phone: '',
        cover_letter: '',
        resume_url: '',
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Email *</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="tu@email.com"
          className="input input-bordered"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Teléfono</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 123-4567"
          className="input input-bordered"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Carta de Presentación</span>
        </label>
        <textarea
          name="cover_letter"
          value={formData.cover_letter}
          onChange={handleChange}
          placeholder="Cuéntanos por qué eres ideal para este puesto..."
          className="textarea textarea-bordered h-24"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">URL de CV</span>
        </label>
        <input
          type="url"
          name="resume_url"
          value={formData.resume_url}
          onChange={handleChange}
          placeholder="https://ejemplo.com/tu-cv.pdf"
          className="input input-bordered"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? (
          <>
            <span className="loading loading-spinner"></span>
            Enviando...
          </>
        ) : (
          'Enviar Aplicación'
        )}
      </button>
    </form>
  );
}
