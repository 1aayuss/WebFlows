"use client";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { SecondaryButton } from "./SecondaryButton";

export default function LandingNavbar() {
    const router = useRouter();
    return (
        <nav className="flex justify-between px-4 md:px-6 border bg-white">
            <div>
                <Logo></Logo>
            </div>
            <div className="flex gap-2 items-center">
                <SecondaryButton onClick={async () => { router.push("/login") }}>Login</SecondaryButton>
                <SecondaryButton onClick={async () => { router.push("/signup") }} color="orange">Signup</SecondaryButton>
            </div>
        </nav>
    );
}