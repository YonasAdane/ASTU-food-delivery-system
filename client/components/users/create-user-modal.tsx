"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, CreateUserFormValues } from "@/types/user";
import { createUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function CreateUserModal() {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: "customer" },
  });

  async function onSubmit(data: CreateUserFormValues) {
    const result = await createUser(data);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("User created successfully");
      setOpen(false);
      form.reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-orange-600 gap-2">
          <Plus className="size-4" /> Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create New User</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="role" render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}