import { ReactNode } from "react"

export const SecondaryButton = ({ children, onClick, size = "small", color = "white" }: {
    children: ReactNode,
    onClick: () => void,
    size?: "big" | "small"
    color?: "white" | "orange"
}) => {
    return <div onClick={onClick} className={`${size === "small" ? "text-sm" : "text-xl"} ${size === "small" ? "px-4 py-1.5" : "px-10 py-4"} ${color === "orange" ? "bg-[#e66e51] text-white" : "bg-white"} cursor-pointer hover:shadow-sm  hover:border-neutral-400 rounded-md border text-center flex justify-center flex-col font-semibold font-poppins`}>
        {children}
    </div>
}