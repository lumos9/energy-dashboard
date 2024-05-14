"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ThemeProvider } from "@/components/theme-provider";
import { SocketProvider } from "@/contexts/SocketContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
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
                    {children}
                </SocketProvider>
            </ThemeProvider>
        </>
    );
};

export default Providers;
