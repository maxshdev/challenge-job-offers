import { auth } from "@/auth";
import BasicForm from "./forms/BasicForm";
import MediaForm from "./forms/MediaForm";
import { getUserProfileAction } from "../actions/user-profile.actions";
import { IUserProfile } from "../../users-profiles/interfaces/user-profile.interface";

export default async function AccountTabs() {

    const session = await auth();

    if (!session?.user) return <p className="text-error p-10">No estás logeado.</p>;

    const userProfile: IUserProfile = await getUserProfileAction(session.user.id);

    if (!userProfile) return <p className="text-error p-10">Perfil no encontrado.</p>;

    return (
        <>
            <div className="container">

                {/* name of each tab group should be unique */}
                <div className="tabs tabs-lift">
                    <input type="radio" name="my_tabs_2" className="tab" aria-label="Perfil de Usuario" defaultChecked />
                    <div className="tab-content border-base-300 bg-base-100 p-10 shadow-xl">
                        <BasicForm defaultValues={userProfile} />
                    </div>

                    <input type="radio" name="my_tabs_2" className="tab" aria-label="Imagen de Perfil" />
                    <div className="tab-content border-base-300 bg-base-100 p-10 shadow-xl">
                        <MediaForm defaultValues={userProfile} />
                    </div>

                    <input type="radio" name="my_tabs_2" className="tab" aria-label="Tab 3" />
                    <div className="tab-content border-base-300 bg-base-100 p-10 shadow-xl">
                        <div className="py-10 text-center text-base-content/70">
                            Configuraciones adicionales próximamente.
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
