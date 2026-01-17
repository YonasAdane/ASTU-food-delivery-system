"use client";

import {
	deleteUser,
	invalidateUserSessions,
	resetUserPassword,
	restoreUser,
	verifyUser,
} from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	CheckCircle,
	Key,
	LogOut,
	MoreHorizontal,
	RotateCcw,
	Trash2,
	XCircle,
} from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function UserActions({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();

  const run = (action: () => Promise<any>) => {
    startTransition(async () => {
      const res = await action();
      res?.error ? toast.error(res.message) : toast.success(res.message);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => run(() => verifyUser(user._id, !user.isVerified))}
        >
          {user.isVerified ? <XCircle className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
          {user.isVerified ? "Unverify User" : "Verify User"}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            run(() =>
              user.deleted ? restoreUser(user._id) : deleteUser(user._id)
            )
          }
        >
          {user.deleted ? <RotateCcw className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
          {user.deleted ? "Restore User" : "Delete User"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => run(() => resetUserPassword(user._id))}>
          <Key className="mr-2 h-4 w-4" />
          Reset Password
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => run(() => invalidateUserSessions(user._id))}>
          <LogOut className="mr-2 h-4 w-4" />
          Invalidate Sessions
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
