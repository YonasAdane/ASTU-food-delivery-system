import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createDriverSchema, CreateDriverFormValues } from "@/lib/validations/driver-schema";

interface AddDriverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateDriverFormValues) => void;
  loading?: boolean;
}

export function AddDriverDialog({ open, onOpenChange, onSubmit, loading }: AddDriverDialogProps) {
  const form = useForm<CreateDriverFormValues>({
    resolver: zodResolver(createDriverSchema),
    defaultValues: {
      email: "",
      phone: "",
      password: "",
      firstName: "",
      lastName: "",
      restaurantId: "",
    },
  });

  const handleSubmit = (data: CreateDriverFormValues) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Add New Driver</DialogTitle>
          <DialogDescription className="dark:text-gray-300">
            Enter the driver's information to add them to the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white">First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" className="bg-white dark:bg-gray-700 dark:text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white">Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" className="bg-white dark:bg-gray-700 dark:text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" type="email" className="bg-white dark:bg-gray-700 dark:text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white">Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+251912345678" className="bg-white dark:bg-gray-700 dark:text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-white">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" className="bg-white dark:bg-gray-700 dark:text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-2 pt-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Driver"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}