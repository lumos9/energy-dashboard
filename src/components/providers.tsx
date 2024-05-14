"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ThemeProvider } from "@/components/theme-provider";
import { SocketProvider } from "@/contexts/SocketContext";
import Aside from "./aside";
import Header from "./header";

const Providers = ({ children, withSidebar = false }: { children: React.ReactNode, withSidebar: boolean }) => {
    return (
        <>
            <ProgressBar
                height="4px"
                color="#fffd00"
                options={{ showSpinner: false }}
                shallowRouting
            />
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                <SocketProvider>
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <div className="flex-1 flex flex-row">
                            {withSidebar && <Aside />}
                            <main className="w-full flex-1">{children}</main>
                        </div>
                    </div>
                </SocketProvider>
            </ThemeProvider>
        </>
    );
};

export default Providers;
