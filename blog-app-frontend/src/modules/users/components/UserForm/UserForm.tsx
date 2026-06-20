import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import useAuth from "../../../auth/hooks/useAuth";

import useToast from "../../../shared/hooks/useToast";
import {
  EditUserSchema,
  type EditUserSchemaType,
} from "../../schemas/user-schema";
import type { UserResponseType } from "../../types/users-types";
import { sendRequest } from "../../../../utils/http/http";

import FormWrapper from "../../../shared/components/form/FormWrapper/FormWrapper";
import Button from "../../../shared/components/Button";
import LinkButton from "../../../shared/components/LinkButton";
import InputElement from "../../../shared/components/form/InputElement";
import ImageUpload from "../../../shared/components/form/ImageUpload";
import TextAreaElement from "../../../shared/components/form/TextAreaElement";

interface UserFormProps {
  userData: UserResponseType | undefined;
}
export default function UserForm({ userData }: UserFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { addToast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) =>
      sendRequest<UserResponseType>("/api/users/me", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      addToast("Profile data changed", "success");
      navigate(`/users/${data.id}`);
    },
    onError: (error) => {
      setError("root", { message: error.message });
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
    control,
  } = useForm<EditUserSchemaType>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      username: userData?.username,
      description: userData?.description,
      avatar: undefined,
    },
  });

  const submitHandler = (newUserData: EditUserSchemaType) => {
    if (!isDirty) {
      setError("root", { message: "You must provide changes!" });
      return;
    }
    const formData = new FormData();
    if (
      newUserData.username !== undefined &&
      userData?.username !== newUserData.username
    )
      formData.append("username", newUserData.username);

    if (
      newUserData.description !== undefined &&
      userData?.description !== newUserData.description
    )
      formData.append("description", newUserData.description);

    if (newUserData.avatar) formData.append("avatar", newUserData.avatar);

    mutate(formData);
  };

  return (
    <FormWrapper
      onSubmit={handleSubmit(submitHandler)}
      formTitle="Edit Profile"
      rootError={errors.root?.message || null}
    >
      <InputElement {...register("username")}>Username</InputElement>
      <TextAreaElement {...register("description")}>
        Description
      </TextAreaElement>
      <Controller
        name="avatar"
        control={control}
        render={({
          field: { name, value, onChange },
          fieldState: { error },
        }) => (
          <ImageUpload
            name={name}
            changeValue={onChange}
            errorMessage={error?.message}
            imageValue={value}
            accept=".jpg,.jpeg,.png"
          >
            Select new avatar
          </ImageUpload>
        )}
      />
      <div>
        <Button type="submit" disabled={isSubmitting || isPending}>
          Edit profile
        </Button>
        <LinkButton to={`/users/${userData?.id}`}>Cancel</LinkButton>
      </div>
    </FormWrapper>
  );
}
