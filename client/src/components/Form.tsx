import {
  InputHTMLAttributes,
  ReactNode,
  useMemo,
  useState,
} from "react";
import { Button } from "./Button";
import { EnterIcon } from "./icons/";

export function Form({
  icon,
  inputData,
  buttonText = "Save Changes",
  disabledTooltip,
  handleSubmit,
}: {
  icon?: ReactNode;
  inputData: InputHTMLAttributes<HTMLInputElement>;
  helpText?: string;
  buttonText?: string;
  disabledTooltip?: string | ReactNode;
  handleSubmit: (
    data: Record<string, string>
  ) => Promise<Record<string, string>>;
}) {
  const [value, setValue] = useState(inputData.defaultValue);
  const [saving, setSaving] = useState(false);
  const saveDisabled = useMemo(() => {
    return saving || !value || value === inputData.defaultValue;
  }, [saving, value, inputData.defaultValue]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        await handleSubmit({
          youtubeUrl: value as string,
        });
        setTimeout(() => {
          setSaving(false);
        }, 5000);
      }}
      className="relative flex justify-center items-center w-full"
    >
      <div className="relative flex items-center gap-4 w-1/2 overflow-hidden">
        {icon && (
          <div className="absolute inset-y-0 left-0 m-0 gap-2 p-3 h-full w-5">
            {icon}
          </div>
        )}

        {typeof inputData.defaultValue === "string" ? (
          <input
            {...inputData}
            type="url"
            required
            disabled={disabledTooltip ? true : false}
            onChange={(e) => setValue(e.target.value)}
            className={`peer inline-block transition-all w-full rounded-md border border-gray-200 bg-white py-3 px-12 shadow-lg focus:border-black focus:outline-none focus:ring-0 sm:text-sm min-w-3/4
              ${
                disabledTooltip
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : ""
              }`}
          />
        ) : (
          <div className="h-[2.35rem] w-full max-w-md animate-pulse rounded-md bg-gray-200" />
        )}
        <Button
          className="peer-focus:border-black rounded-md max-w-fit absolute inset-y-0 right-0  m-0 gap-2 h-full"
          icon={<EnterIcon className=" " />}
          text={buttonText}
          //   loading
          loading={saving}
          disabled={saveDisabled}
        />
      </div>
    </form>
  );
}
