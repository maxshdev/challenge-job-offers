'use client';

import { useState } from 'react';

interface ApplyFormProps {
  jobTitle: string;
  company: string;
}

export default function ApplyForm({ jobTitle, company }: ApplyFormProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    portfolio: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar la aplicación
    console.log('Application submitted:', formData);
    setStep('success');
    setTimeout(() => {
      setStep('form');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        portfolio: '',
        message: '',
      });
    }, 3000);
  };

  return (
    <div>
      {step === 'form' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Nombre Completo</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Tu nombre"
              className="input input-bordered"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
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
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Teléfono</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+34 123 456 789"
                className="input input-bordered"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Portfolio / CV</span>
            </label>
            <input
              type="url"
              name="portfolio"
              placeholder="https://tuportfolio.com"
              className="input input-bordered"
              value={formData.portfolio}
              onChange={handleChange}
            />
            <label className="label">
              <span className="label-text-alt">Link a tu portafolio, LinkedIn o CV en línea</span>
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Mensaje (Opcional)</span>
            </label>
            <textarea
              name="message"
              placeholder="Cuéntanos por qué te interesa este puesto..."
              className="textarea textarea-bordered"
              rows={4}
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Enviar Aplicación
          </button>
        </form>
      ) : (
        <div className="alert alert-success">
          <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold">¡Aplicación enviada!</h3>
            <div className="text-sm">
              Hemos recibido tu aplicación para {jobTitle} en {company}. Recibirás actualizaciones en tu email.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
