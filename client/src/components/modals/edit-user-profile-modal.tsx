"use client";

import React, { ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import Spinner from "@/components/spinner";

import { updateUserSchema } from "@/lib/zod";

import { useConfirm } from "@/hooks/use-confirm";

import useEditUserProfileModal from "@/hooks/users/use-edit-user-profile-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { useAuthStore } from "@/stores/use-auth-store";
import { useUpdateUser } from "@/hooks/users/use-update-user";
import { useDeleteUser } from "@/hooks/users/use-delete-user";

const EditUserProfileModal = () => {
  const { isOpen, setIsOpen, onClose } = useEditUserProfileModal();
  const { mutate: updateUser, isPending: isUpdatePending } = useUpdateUser();
  const { mutate: deleteUser, isPending: isDeletePending } = useDeleteUser();

  const { user } = useAuthStore();

  const inputRef = useRef<HTMLInputElement>(null);

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Account",
    "This will permanently delete the account. Are you sure you want to proceed?"
  );

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      avatarImage: user?.avatarImage || ""
    }
  });

  const onSubmit = (values: z.infer<typeof updateUserSchema>) => {
    const formData = new FormData();

    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);

    if (values.avatarImage instanceof File) {
      formData.append("avatarImage", values.avatarImage);
    }

    updateUser(formData, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
      form.setValue("avatarImage", file);
    }
  };

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteUser();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto no-scrollbar max-h-[85vh]">
        <div className="flex flex-col gap-y-4">
          <DeleteDialog />

          <div className="w-full h-full border border-neutral-800 dark:border-neutral-600 rounded-lg">
            <DialogHeader className="flex p-7 ">
              <DialogTitle className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
                Edit Profile
              </DialogTitle>
              <DialogDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                Manage {user?.username} profile
              </DialogDescription>
            </DialogHeader>

            <div className="px-7">
              <Separator />
            </div>

            <div className="p-7 space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col space-y-5">
                    <FormField
                      control={form.control}
                      name="avatarImage"
                      render={({ field }) => (
                        <div className="flex flex-col gap-y-4">
                          <div className="flex items-center gap-x-5">
                            {field.value ? (
                              <div className="relative rounded-full overflow-hidden w-20 h-20">
                                <Image
                                  alt="profile-image"
                                  fill
                                  className="object-cover"
                                  src={
                                    field.value instanceof File
                                      ? URL.createObjectURL(field.value)
                                      : field.value
                                  }
                                />
                              </div>
                            ) : (
                              <Avatar className="w-20 h-20">
                                <AvatarFallback>
                                  <ImageIcon className="w-6 h-6 text-neutral-400 dark:text-neutral-500" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div className="flex flex-col">
                              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                                Profile Image
                              </p>
                              <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                                Update user profile image
                              </p>
                              <input
                                className="hidden"
                                type="file"
                                accept=".jpg, .png, .jpeg, .svg"
                                ref={inputRef}
                                onChange={handleImageChange}
                              />
                              {field.value ? (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  disabled={isUpdatePending}
                                  size="xs"
                                  className="w-fit mt-2"
                                  onClick={() => {
                                    field.onChange(null);
                                    if (inputRef.current) {
                                      inputRef.current.value = "";
                                    }
                                    form.setValue("avatarImage", "");
                                  }}
                                >
                                  Remove Image
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  size="sm"
                                  className="w-fit mt-2"
                                  disabled={isUpdatePending}
                                  onClick={() => inputRef.current?.click()}
                                >
                                  Upload Image
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your first name"
                              className="py-3"
                            />
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
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your last name"
                              className="py-3"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="mt-8" />

                  <div className="flex items-center justify-end mt-4">
                    <Button
                      type="submit"
                      size="sm"
                      className="w-full sm:w-auto"
                      disabled={isUpdatePending}
                    >
                      {isUpdatePending ? <Spinner /> : "Save"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            <div className="p-7 mt-8">
              <div className="flex flex-col space-y-4">
                <h3 className="font-bold text-lg text-red-600 dark:text-red-700">
                  Danger Zone
                </h3>
                <p className="text-sm text-muted-foreground">
                  Once you delete an account, it cannot be recovered. Please be
                  certain
                </p>
                <Separator className="mt-4" />
                <Button
                  className="mt-6 w-full sm:w-auto ml-auto"
                  size="sm"
                  variant="destructive"
                  type="button"
                  disabled={isDeletePending}
                  onClick={handleDelete}
                >
                  {isDeletePending ? <Spinner /> : "Delete Account"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserProfileModal;
