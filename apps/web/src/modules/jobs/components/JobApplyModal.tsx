'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ApplyForm from './ApplyForm';

interface JobApplyModalProps {
  jobId: string;
  jobTitle: string;
  company: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobApplyModal({ jobId, jobTitle, company, isOpen, onClose }: JobApplyModalProps) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!isOpen) return null;

  const handleLoginRequired = () => {
    router.push('/login');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-base-100 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-base-100 border-b border-base-300 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Aplicar a {jobTitle}</h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {!session && !jobId.startsWith('ext-') ? (
            <div className="space-y-4">
              <div className="alert alert-warning">
                <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0H8m4 0h4m-9-9a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
                <div>
                  <h3 className="font-bold">Debes estar logueado para solicitar empleo</h3>
                  <div className="text-sm">Inicia sesión en tu cuenta para poder aplicar a este puesto de trabajo.</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="btn btn-ghost flex-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLoginRequired}
                  className="btn btn-primary flex-1"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          ) : (
            <ApplyForm jobId={jobId} jobTitle={jobTitle} company={company} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}
