import { auth } from "@/auth";
import { getUserByIdAction } from "@/src/modules/users/actions/user.actions";
import { AccessDenied } from "@/src/components/AccessDenied";
import JobApplicationTable from "@/src/modules/job-applications/components/JobApplicationTable";
import { getApplicationsAction } from "@/src/modules/job-applications/actions/job-application.actions";
import { IUser } from "@/src/modules/users/interfaces/user.interface";

export default async function JobApplicationsPage() {
  const session = await auth();
  if (!session?.user) return <p className="text-error p-10">No estás logeado.</p>;

  const user: IUser = await getUserByIdAction(session.user.id);
  if (user.role.name !== "superadmin") 
    return <AccessDenied message="No se puede acceder a esta sección sin privilegios" />;

  const applications = await getApplicationsAction();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <JobApplicationTable initialApplications={applications} />
    </div>
  );
}
