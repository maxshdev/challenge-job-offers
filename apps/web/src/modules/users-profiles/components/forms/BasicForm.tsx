"use client";

import { useState } from "react";
import { useToast } from "@/src/components/ToastContext";
import { IUserProfile } from "@/src/modules/users-profiles/interfaces/user-profile.interface";
import { updateUserProfileAction } from "../../actions/user-profile.actions";

type BasicFormProps = {
    defaultValues: IUserProfile;
};

type FormErrors = {
    firstName?: string;
    lastName?: string;
    title?: string;
    biography?: string;
    website?: string;
};

export default function BasicForm({ defaultValues }: BasicFormProps) {
    const { showToast } = useToast();

    const [form, setForm] = useState({
        firstName: defaultValues.first_name ?? "",
        lastName: defaultValues.last_name ?? "",
        title: defaultValues.title ?? "",
        biography: defaultValues.biography ?? "",
        website: defaultValues.website ?? "",
    });

    const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
        facebook: defaultValues.social_links?.facebook || "",
        instagram: defaultValues.social_links?.instagram || "",
        linkedin: defaultValues.social_links?.linkedin || "",
        tiktok: defaultValues.social_links?.tiktok || "",
        x: defaultValues.social_links?.x || "",
        youtube: defaultValues.social_links?.youtube || "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [saving, setSaving] = useState(false);

    const handleChange =
        (field: keyof typeof form) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setForm((prev) => ({ ...prev, [field]: e.target.value }));
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            };

    const handleSocialChange =
        (network: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
            setSocialLinks((prev) => ({ ...prev, [network]: e.target.value }));

    const validate = () => {
        const newErrors: FormErrors = {};
        if (!form.firstName.trim()) newErrors.firstName = "El/Los Nombre/s es obligatorio.";
        if (!form.lastName.trim()) newErrors.lastName = "El/Los Apellido/s es obligatorio.";
        if (!form.title.trim()) newErrors.title = "El título obligatorio.";
        if (!form.biography.trim()) newErrors.biography = "Debe tener una pequeña biografía.";
        if (!form.website.trim()) newErrors.website = "La url del sitio web no puede estar vacia.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            await updateUserProfileAction(defaultValues.id, {
                first_name: form.firstName,
                last_name: form.lastName,
                title: form.title,
                biography: form.biography,
                website: form.website,
                social_links: socialLinks,
            });
            showToast("Perfil actualizado correctamente 🎉", "success");
        } catch {
            showToast("Error al actualizar ❌", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* IZQUIERDA: Información Personal */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold opacity-70 border-b pb-2 mb-4">
                        Información Personal
                    </h3>

                    {/* Nombre */}
                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend font-medium">Nombre/s</legend>
                        <input
                            type="text"
                            className={`input input-bordered w-full ${errors.firstName ? "input-error" : ""}`}
                            value={form.firstName}
                            placeholder="Ej. Juan"
                            onChange={handleChange("firstName")}
                        />
                        {errors.firstName && <p className="label text-error">{errors.firstName}</p>}
                    </fieldset>

                    {/* Apellido */}
                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend font-medium">Apellido/s</legend>
                        <input
                            type="text"
                            className={`input input-bordered w-full ${errors.lastName ? "input-error" : ""}`}
                            value={form.lastName}
                            placeholder="Ej. Pérez"
                            onChange={handleChange("lastName")}
                        />
                        {errors.lastName && <p className="label text-error">{errors.lastName}</p>}
                    </fieldset>

                    {/* Título */}
                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend font-medium">Título Profesional</legend>
                        <input
                            type="text"
                            className={`input input-bordered w-full ${errors.title ? "input-error" : ""}`}
                            value={form.title}
                            placeholder="Ej. Diseñador Gráfico"
                            onChange={handleChange("title")}
                        />
                        {errors.title && <p className="label text-error">{errors.title}</p>}
                    </fieldset>

                    {/* Biografía */}
                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend font-medium">Biografía</legend>
                        <textarea
                            className={`textarea textarea-bordered h-64 w-full ${errors.biography ? "textarea-error" : ""}`}
                            placeholder="Cuéntanos un poco sobre ti..."
                            value={form.biography}
                            onChange={handleChange("biography")}
                        />
                        {errors.biography && <p className="label text-error">{errors.biography}</p>}
                    </fieldset>
                </div>

                {/* DERECHA: Web + Redes */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold opacity-70 border-b pb-2 mb-4">
                        Presencia Online
                    </h3>

                    {/* Website */}
                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend font-medium">Sitio Web Personal</legend>
                        <input
                            type="text"
                            className={`input input-bordered w-full ${errors.website ? "input-error" : ""}`}
                            value={form.website}
                            placeholder="https://mi-sitio.com"
                            onChange={handleChange("website")}
                        />
                        {errors.website && <p className="label text-error">{errors.website}</p>}
                    </fieldset>

                    <div className="divider text-sm font-medium opacity-50">Redes Sociales</div>

                    {/* Redes */}
                    {Object.entries(socialLinks).map(([network, value]) => (
                        <fieldset key={network} className="fieldset w-full">
                            <legend className="fieldset-legend capitalize opacity-70">
                                {network}
                            </legend>

                            <input
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="Usuario / URL"
                                value={value}
                                onChange={handleSocialChange(network)}
                            />
                        </fieldset>
                    ))}
                </div>
            </div>

            {/* Botón de Guardado */}
            <div className="flex justify-end pt-6 border-t mt-4">
                <button className="btn btn-primary px-8" disabled={saving} onClick={handleSave}>
                    {saving ? <span className="loading loading-spinner"></span> : null}
                    {saving ? "Guardando..." : "Guardar Cambios"}
                </button>
            </div>
        </div>
    );
}
