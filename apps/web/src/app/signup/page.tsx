"use client"
// import { BrowserRouter } from "react-router-dom";
import { Auth } from "../../components/Auth";
export default function Page() {
    return (
        <div className="h-screen w-screen bg-zinc-100">
            <Auth type="signup"></Auth>
        </div>

    )
}