import Image from "next/image";
export default function Logo() {
    return (
        <a href="#" className="flex items-center gap-1 select-none cursor-pointer">
            <div>
                <Image className="select-none pointer-events-none" src="/images/logo.svg" alt="Logo" width={50} height={50} />
            </div>
            <div className="font-poppins font-semibold text-neutral-700 mt-1.5">
                WebFlows
            </div>
        </a>
    );
}