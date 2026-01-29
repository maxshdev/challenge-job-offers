import { auth } from "@/auth";
import { getUserByIdAction } from "@/src/modules/users/actions/user.actions";
import { getJobSubscriptionsAction } from "@/src/modules/job-subscriptions/actions/job-subscription.actions";
import { AccessDenied } from "@/src/components/AccessDenied";
import JobSubscriptionTable from "@/src/modules/job-subscriptions/components/JobSubscriptionTable";
import { IUser } from "@/src/modules/users/interfaces/user.interface";

export default async function JobSubscriptionsPage() {
    const session = await auth();
    if (!session?.user) return <p className="text-error p-10">No estás logeado.</p>;

    const user: IUser = await getUserByIdAction(session.user.id);
    if (user.role.name !== "superadmin")
        return <AccessDenied message="No se puede acceder a esta sección sin privilegios" />;

    const result = await getJobSubscriptionsAction();
    const subscriptionsData = Array.isArray(result) ? result : (result.data || []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <JobSubscriptionTable initialSubscriptions={subscriptionsData} />
        </div>
    );
}
