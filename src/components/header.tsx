import { Loader, Lock, XCircle } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useSocket } from "../contexts/SocketContext";

export default function Header() {
    const { isConnectionLoading, isConnected } = useSocket();

    return (
        <header className="w-full px-8 flex items-center justify-between h-16 border-b-2">
            <div className="w-72 md:border-r h-full flex items-center px-8">
                <div>{"Green Energy"}</div>
            </div>
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-row gap-5">
                    {isConnectionLoading ? (
                        <div className="flex flex-row gap-2 justify-center items-center">
                            <Loader
                                className="w-4 h-4 animate-spin"
                                color="#ffaa00"
                            />
                            <div className="text-sm font-medium text-muted-foreground">
                                Connecting...
                            </div>
                        </div>
                    ) : (
                        <>
                            {isConnected ? (
                                <TooltipProvider>
                                    <TooltipTrigger asChild>
                                        <div className="flex flex-row gap-2 justify-center items-center">
                                            <Lock
                                                className="w-4 h-4"
                                                color="#96d35f"
                                            />
                                            <div className="text-sm font-medium text-muted-foreground">
                                                Connected
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            Connected to recieve real-time
                                            updates
                                        </p>
                                    </TooltipContent>
                                </TooltipProvider>
                            ) : (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex flex-row gap-2 justify-center items-center">
                                            <XCircle
                                                className="w-4 h-4"
                                                color="#ff6251"
                                            />
                                            <div className="text-sm font-medium text-muted-foreground">
                                                Disconnected
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Cannot recieve real-time updates</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </>
                    )}
                    <ModeToggle />
                </div><div className="flex flex-row gap-5">
                    {isConnectionLoading ? (
                        <div className="flex flex-row gap-2 justify-center items-center">
                            <Loader
                                className="w-4 h-4 animate-spin"
                                color="#ffaa00"
                            />
                            <div className="text-sm font-medium text-muted-foreground">
                                Connecting...
                            </div>
                        </div>
                    ) : (
                        <TooltipProvider>
                            {isConnected ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex flex-row gap-2 justify-center items-center">
                                            <Lock
                                                className="w-4 h-4"
                                                color="#96d35f"
                                            />
                                            <div className="text-sm font-medium text-muted-foreground">
                                                Connected
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            Connected to recieve real-time
                                            updates
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex flex-row gap-2 justify-center items-center">
                                            <XCircle
                                                className="w-4 h-4"
                                                color="#ff6251"
                                            />
                                            <div className="text-sm font-medium text-muted-foreground">
                                                Disconnected
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Cannot recieve real-time updates</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </TooltipProvider>
                    )}
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}
