import LinkButton from "../components/LinkButton";
export default function ErrorPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-2 md:gap-4 lg:gap-6">
      <h1 className="font-header uppercase text-md font-bold md:text-xl lg:text-2xl xl:text-3xl text-error">
        An error occurred!
      </h1>
      <p className="text-md md:text-lg lg:text-xl xl:text-2xl">
        Something went wrong!
      </p>
      <LinkButton to="/">Return to main page</LinkButton>
    </main>
  );
}
