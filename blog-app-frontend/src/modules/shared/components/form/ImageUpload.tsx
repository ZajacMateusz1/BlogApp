import { type ChangeEvent, type ComponentPropsWithRef } from "react";

interface ImageUploadProps extends ComponentPropsWithRef<"input"> {
  name: string;
  children: string;
  errorMessage?: string;
  imageValue: File | undefined;
  changeValue: (file: File | undefined) => void;
}
export default function ImageUpload({
  name,
  children,
  errorMessage,
  imageValue,
  changeValue,
  ...props
}: ImageUploadProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    changeValue(file);
  };
  return (
    <div className="flex flex-col items-center gap-2">
      <input
        id={name}
        onChange={handleChange}
        className="hidden"
        type="file"
        {...props}
      />
      <label
        htmlFor={name}
        className="bg-primary text-white text-base p-1 rounded-md hover:cursor-pointer sm:text-lg lg:p-2 xl:text-xl"
      >
        {children}
      </label>
      {errorMessage && (
        <p className="text-error text-xs sm:text-sm md:text-base xl:text-lg">
          {errorMessage}
        </p>
      )}
      {imageValue && (
        <div>
          <p>Selected file:</p>
          {imageValue.name}
        </div>
      )}
    </div>
  );
}
