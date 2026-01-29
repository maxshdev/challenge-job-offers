"use client";

import { useState, useRef } from "react";
import { useToast } from "@/src/components/ToastContext";
import { IUserProfile } from "@/src/modules/users-profiles/interfaces/user-profile.interface";
import { updateUserProfileAction } from "../../actions/user-profile.actions";

type MediaFormProps = {
    defaultValues: IUserProfile;
};

export default function MediaForm({ defaultValues }: MediaFormProps) {
    const { showToast } = useToast();

    const [avatarUrl, setAvatarUrl] = useState(defaultValues.avatar_url ?? "");
    const [imagePreview, setImagePreview] = useState<string | null>(defaultValues.avatar_url ?? null);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const imageInputRef = useRef<HTMLInputElement | null>(null);

    const validateFile = (file: File): Promise<boolean> => {
        return new Promise<boolean>((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                if (img.width < 200 || img.height < 200) {
                    setError("La imagen es demasiado pequeña. Mínimo 200x200 píxeles.");
                    resolve(false);
                } else if (img.width > 6000 || img.height > 6000) {
                    setError("La imagen es demasiado grande. Máximo 6000x6000 píxeles.");
                    resolve(false);
                } else {
                    setError("");
                    resolve(true);
                }
            };
            img.onerror = () => {
                setError("No se pudo cargar la imagen.");
                resolve(false);
            };
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const isValid = await validateFile(file);
        if (!isValid) {
            e.target.value = ""; // Limpiar input si inválido
            return;
        }

        setAvatarUrl(URL.createObjectURL(file));
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveFile = (field: string) => {
        if (field === "avatar_url") {
            setAvatarUrl("");
            setImagePreview(null);
            if (imageInputRef.current) imageInputRef.current.value = "";
        }
    };

    const handleSave = async () => {
        if (error) return;

        setSaving(true);
        try {
            await updateUserProfileAction(defaultValues.id, {
                avatar_url: avatarUrl,
            });
            showToast("Avatar actualizado correctamente 🎉", "success");
        } catch {
            showToast("Error al actualizar ❌", "error");
        } finally {
            setSaving(false);
        }
    };

    return (


        <div className="max-w-2xl mx-auto">
            <div className="card bg-base-200/50 border border-base-300 shadow-sm">
                <div className="card-body items-center text-center">
                    <h3 className="card-title mb-6">Foto de Perfil</h3>

                    <div className="relative group">
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-48 h-48 ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Avatar Preview" className="object-cover w-full h-full" />
                                ) : (
                                    <span className="text-3xl">IMG</span>
                                )}
                            </div>
                        </div>

                        {imagePreview && (
                            <button
                                onClick={() => handleRemoveFile("avatar_url")}
                                className="btn btn-circle btn-error btn-sm absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Eliminar imagen"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <div className="form-control w-full max-w-xs mt-8">
                        <input
                            ref={imageInputRef}
                            name="avatar_url"
                            type="file"
                            accept="image/*"
                            className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                            onChange={handleFileChange}
                        />
                        <label className="label">
                            <span className="label-text-alt text-base-content/60">
                                Mínimo 200x200px, Máximo 6000x6000px.
                            </span>
                        </label>
                    </div>

                    {error && (
                        <div role="alert" className="alert alert-error mt-4 py-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end pt-6 mt-4 border-t">
                <button className="btn btn-primary px-8" disabled={saving} onClick={handleSave}>
                    {saving ? <span className="loading loading-spinner"></span> : null}
                    {saving ? "Guardando..." : "Guardar Avatar"}
                </button>
            </div>
        </div>
    );
}
