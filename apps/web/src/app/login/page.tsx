"use client"
import { BrowserRouter } from "react-router-dom";
import { Auth } from "../../components/Auth";
export default function Page() {
    return (
        <BrowserRouter>
            <div className="h-screen w-screen bg-zinc-100">
                <Auth type="login"></Auth>
            </div>
        </BrowserRouter>

    )
}