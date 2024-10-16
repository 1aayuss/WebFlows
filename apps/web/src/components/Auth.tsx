"use client"
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SignupSchema } from "@repo/types";
import { z } from "zod";
import Link from "next/link";
import { BACKEND_URL } from "../../config";

type SignupSchemaType = z.infer<typeof SignupSchema>;

export const Auth = ({ type }: { type: "signup" | "login" }) => {

    const router = useRouter();

    const [postInputs, setPostInputs] = useState<SignupSchemaType>({
        name: "",
        username: "",
        password: ""
    });

    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/auth/${type === "signup" ? "signup" : "signin"}`, postInputs);
            const jwt = response.data.token;
            localStorage.setItem("token", jwt);
            router.push("/dashboard");
        } catch (e) {
            alert("Something went wrong");
        }
    }

    return (
        <div className="h-screen flex flex-col justify-center items-center ">
            <div className="p-6 w-1/2 border-2 border-zinc-900 rounded ">

                <div className="text-3xl font-poppins font-medium">
                    {type === "signup" ? "Create an account" : "Sign in"}
                </div>

                <hr className="h-[0.5px] my-1 mt-4 bg-zinc-900 border-0 dark:bg-zinc-900" />

                {type === "signup" && (
                    <LabelledInput
                        label="Full Name"
                        placeholder="Name"
                        onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                name: e.target.value
                            });
                        }}
                    />
                )}

                <LabelledInput
                    label="Email"
                    placeholder="Email"
                    onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            username: e.target.value
                        });
                    }}
                />

                <LabelledInput
                    label="Password"
                    placeholder="Password"
                    onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        });
                    }}
                    type="password"
                />

                <button
                    type="button"
                    onClick={sendRequest}
                    className="mt-8 w-full text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-0 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                >
                    {type === "signup" ? "Sign up" : "Sign in"}
                </button>

                <div className="text-slate-500 text-sm text-center">
                    {type === "login" ? "Don't have an account?" : "Already have an account?"}
                    <Link href={type === "login" ? "/signup" : "/login"} className="pl-2 underline">
                        {type === "login" ? "SignUp" : "login"}
                    </Link>
                </div>
            </div>
        </div>
    );
};

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return (
        <div>
            <label className="block mb-2 text-sm text-black font-medium font-sans pt-4">{label}</label>
            <input
                onChange={onChange}
                type={type || "text"}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={placeholder}
                required
            />
        </div>
    );
}
