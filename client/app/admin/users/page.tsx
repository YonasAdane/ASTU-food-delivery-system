import { getUsers } from "@/actions/user";
import { UserFilters } from "@/components/users/user-filters";
import { CreateUserModal } from "@/components/users/create-user-modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { getErrorMessage } from "@/lib/get-error-message";
import UserActions from "@/components/users/user-actions";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    role?: string;
    isVerified?: string;
    status?: string;
    deleted?: string;
  }>;
}) {
  const sp=await searchParams;
  const page = Number(sp.page) || 1;

  try {
    const res = await getUsers(
      page,
      sp.search,
      10,
      sp.role,
      sp.isVerified,
      sp.status,
      sp.deleted
    );

    if (res?.error) throw new Error(res.message);

    return (
      <div className="flex-1 overflow-y-auto p-8 bg-background">
        <div className="max-w-[1200px] mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">User Management</h2>
            <CreateUserModal />
          </div>
          {/* {JSON.stringify({ page,
            sp.search,
            10,
            sp.role,
            sp.isVerified,
            sp.status,
            sp.deleted})} */}
          <div className="rounded-xl border bg-card shadow-sm">
            <UserFilters />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Driver Status</TableHead>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {res?.data?.data.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-semibold">{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>

                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant={ "secondary"}>
                        <span className={`size-2 rounded-full ${user.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        {user.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {user.role === "driver" ? (
                        <Badge
                          variant={user.status === "available" ? "default" : "destructive"}
                          className="capitalize"
                        >
                          {user.status}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {user.role === "driver" && user.restaurantId ? "Driver" : "-"}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(user.createdAt))} ago
                    </TableCell>

                    <TableCell>
                      <Badge variant={user.deleted ? "destructive" : "default"}>
                        {user.deleted ? "Deleted" : "Active"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <UserActions user={user} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="p-4 border-t flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Page {res?.data?.meta.page} of {res?.data?.meta.pages} ({res?.data?.meta.total} total)
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">Failed to load users</h2>
          <p className="text-muted-foreground">{getErrorMessage(error)}</p>
        </div>
      </div>
    );
  }
}
