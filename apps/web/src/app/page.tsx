"use client"
import { useRouter } from "next/navigation"
import LandingNavbar from "@/components/LandingNavbar";
import { PrimaryButton } from "@/components/PrimaryButton";
import Image from "next/image";
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  return (
      <div className="h-screen w-screen bg-zinc-100">
        <LandingNavbar></LandingNavbar>
        <div className="flex justify-center ">
          <div className="mt-10 flex flex-col items-center gap-y-6">
            <Image src="/images/hero.svg" alt="hero" className="" width={450} height={450}></Image>
            <div className="text-3xl font-poppins font-semibold text-neutral-800">
              Connect. Automate. Relax. with WebFlows.
            </div>
            <PrimaryButton color="orange" onClick={async () => { router.push("/signup") }} size="big">
              <div className="flex items-center gap-x-2">
                Get started for Free
                <ArrowRight size={20} strokeWidth={3} />
              </div></PrimaryButton>
          </div>
        </div>
      </div>
  );
}
