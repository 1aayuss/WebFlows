"use client";

export const Input = ({
    label,
    placeholder,
    onChange,
    type = "text",
    required = true,
    defaultValue = ""
}: {
    label: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: "text" | "password";
    required?: boolean;
    defaultValue?: string;
}) => {
    return (
        <div>
            <div className="text-sm pb-1 pt-2">
                {required && <span className="text-red-500">*</span>} <label>{label}</label>
            </div>
            <input
                className="border rounded px-4 py-2 w-full border-black"
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                defaultValue={defaultValue}
                required={required} // Ensures HTML form validation for required inputs
            />
        </div>
    );
};
