"use client"
import LandingNavbar from "@/components/LandingNavbar";
import { DarkButton } from "@/components/DarkButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL, HOOKS_URL } from "../../../config";
import { LinkButton } from "@/components/LinkButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import router from "next/router";
import { Clipboard } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Flow {
    "id": string,
    "icon": string,
    "createdAt": string,
    "flowName": string,
    "updatedAt": string,
    "triggerId": string,
    "userId": number,
    "actions": {
        "id": string,
        "flowId": string,
        "actionId": string,
        "sortingOrder": number,
        "type": {
            "id": string,
            "name": string
            "icon": string
        }
    }[],
    "trigger": {
        "id": string,
        "flowId": string,
        "triggerId": string,
        "type": {
            "id": string,
            "name": string,
            "icon": string
        }
    }
}

function useFlows() {
    const [loading, setLoading] = useState(true);
    const [flows, setFlows] = useState<Flow[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/flow`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
            .then(res => {
                setFlows(res.data.flows);
                setLoading(false)
            })
    }, []);

    return {
        loading, flows
    }
}

const truncateUrl = (url: string) => {
    const maxLength = 30; // Length after which the URL is truncated
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
};

const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("Webhook URL copied to clipboard!");
};


export default function Dashboard() {
    const { loading, flows } = useFlows();
    const router = useRouter();

    return <div>
        <LandingNavbar />
        <div className="flex justify-center pt-8">
            <div className="max-w-screen-lg	 w-full">
                <div className="flex justify-between pr-8 ">
                    <div className="text-2xl font-bold">
                        My Flows
                    </div>
                    <DarkButton onClick={() => {
                        router.push("/flow/create");
                    }}>Create</DarkButton>
                </div>
            </div>
        </div>
        {loading ? "Loading..." : <div className="flex justify-center"> <FlowTable flows={flows} /> </div>}
    </div>
}

function FlowTable({ flows }: { flows: Flow[] }) {
    return (
        <div className="p-8 max-w-screen-lg w-full">
            {/* Table header */}
            <div className="flex border-b py-2 font-semibold text-gray-700">
                <div className="flex-1"></div>
                <div className="flex-1">Name</div>
                <div className="flex-1">Last Edit</div>
                <div className="flex-1">Webhook URL</div>
                <div className="flex-1">Action</div>
            </div>

            {/* Table rows */}
            {flows.map((flow: Flow) => {
                const fullUrl = `${HOOKS_URL}/hooks/catch/${flow.userId}/${flow.id}`;
                return (
                    <div key={flow.id} className="flex border-b py-4 items-center">
                        {/* Icons */}
                        <div className="flex-1 flex items-center space-x-2">
                            {/* Trigger Icon */}
                            <Image
                                alt="trigger-icon"
                                width={20}
                                height={20}
                                src={flow.trigger.type.icon + ".svg"}
                                className="w-5 h-5 object-cover"
                            />
                            {/* Actions Icons */}
                            {flow.actions.map((action: { id: string; flowId: string; actionId: string; sortingOrder: number; type: { id: string; name: string; icon: string } } ) => (
                                <Image
                                    key={action.id}
                                    alt="action-icon"
                                    src={action.type.icon + ".svg"}
                                    width={20}
                                    height={20}
                                    className="w-5 h-5 object-cover"
                                />
                            ))}
                        </div>

                        {/* Flow Name */}
                        <div className="flex-1">{flow.flowName}</div>

                        {/* Created At */}
                        <div className="flex-1">
                            {formatDistanceToNow(new Date(flow.updatedAt), { addSuffix: true })}
                        </div>

                        {/* Webhook URL */}
                        <div className="flex-1 flex items-center space-x-2">
                            <span className="text-blue-500">
                                {truncateUrl(fullUrl)}
                            </span>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => copyToClipboard(fullUrl)}
                            >
                                <Clipboard className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Go Button */}
                        <div className="flex-1">
                            <LinkButton onClick={() => router.push(`/flow/${flow.id}`)}>
                                Go
                            </LinkButton>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
