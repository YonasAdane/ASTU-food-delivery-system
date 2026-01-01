import { getUsers } from "@/actions/user";
import { UserFilters } from "@/components/users/user-filters";
import { CreateUserModal } from "@/components/users/create-user-modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { getErrorMessage } from "@/lib/get-error-message";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; role?: string }>;
}) {
	const sp=await searchParams;
  const page = Number(sp.page) || 1;
  const search = sp.search;
  const role = sp.role;

  try {
    const res = await getUsers( page, search,10, role );
		if(res?.error) throw new Error(res?.message)
		
    return (
      <div className="flex-1 overflow-y-auto p-8 bg-background">
        <div className="max-w-[1200px] mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">User Management</h2>
            <CreateUserModal />
          </div>

          <div className="rounded-xl border bg-card shadow-sm">
            <UserFilters />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {res?.data?.data?.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{user.email}</p>
                        <p className="text-xs text-muted-foreground">{user.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${user.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className="text-sm">{user.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(user.createdAt))} ago
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Simple Pagination Footer */}
            <div className="p-4 border-t flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Page {res.data?.meta.page} of {res.data?.meta.pages} ({res.data?.meta.total} total)
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
          <p className="text-muted-foreground">{getErrorMessage(error)}.</p>
        </div>
      </div>
    );
  }
}