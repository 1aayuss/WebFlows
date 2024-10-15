import { ReactNode } from "react"

export const PrimaryButton = ({ children, onClick, size = "small", color = "white" }: {
    children: ReactNode,
    onClick: () => void,
    size?: "big" | "small"
    color?: "white" | "orange"
}) => {
    return <div onClick={onClick} className={`${size === "small" ? "text-sm" : "text-lg"} ${size === "small" ? "px-4 py-1.5" : "px-6 py-2"} ${color === "orange" ? "bg-[#e66e51] text-white" : "bg-white"} cursor-pointer hover:shadow-lg  rounded-md text-center flex justify-center flex-col font-semibold font-poppins`}>
        {children}
    </div>
}