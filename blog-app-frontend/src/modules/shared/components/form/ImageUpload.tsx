import { useEffect, type ChangeEvent, type ComponentPropsWithRef } from "react";

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
  const previewUrl = imageValue ? URL.createObjectURL(imageValue) : null;
  useEffect(() => {
    if (!previewUrl) return;
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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
      {previewUrl && (
        <div className="w-full">
          <p className="font-semibold text-xs sm:text-sm md:text-base xl:text-lg">
            Preview:
          </p>
          <img
            className="w-full max-h-64 object-contain"
            src={previewUrl}
            alt="Image preview"
          />
        </div>
      )}
    </div>
  );
}
