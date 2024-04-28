import { FormAction } from "../components/form-action";

export default async function HomePage() {
  return (
    <div className="space-y-6 border border-transparent rounded-md p-6 shadow-md w-full max-w-lg">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Form Actions</h1>
        <p className="text-lg">Click on the button below to submit the form</p>
      </div>
      <div className="[&>div]:space-y-6 [&_form]:space-y-3">
        <FormAction />
      </div>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  };
};
