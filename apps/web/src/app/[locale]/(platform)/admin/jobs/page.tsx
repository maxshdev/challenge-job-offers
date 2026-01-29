import { auth } from "@/auth";
import { getUserByIdAction } from "@/src/modules/users/actions/user.actions";
import { getJobsAction } from "@/src/modules/jobs/actions/job.actions";
import { AccessDenied } from "@/src/components/AccessDenied";
import JobTable from "@/src/modules/jobs/components/JobTable";
import { IUser } from "@/src/modules/users/interfaces/user.interface";

export default async function JobsPage() {
  const session = await auth();
  if (!session?.user) return <p className="text-error p-10">No estás logeado.</p>;

  const user: IUser = await getUserByIdAction(session.user.id);
  if (user.role.name !== "superadmin")
    return <AccessDenied message="No se puede acceder a esta sección sin privilegios" />;

  const result = await getJobsAction();
  const jobsData = Array.isArray(result) ? result : (result.data || []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <JobTable initialJobs={jobsData} />
    </div>
  );
}