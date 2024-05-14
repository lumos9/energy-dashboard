// contexts/SocketContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
    socket: Socket | null;
    isConnectionLoading: boolean;
    isConnected: boolean;
    message: string;

}

function formatUTCDateToLocal(utcDate: Date) {
    // Format time part with dynamic local timezone
    const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        //second: "2-digit",
        hour12: true,
        timeZoneName: "short",
    };
    return new Intl.DateTimeFormat("en-US", options).format(utcDate);
}

function formatUTCDateAndTimeToLocal(utcDate: Date) {
    // Create an array to map month numbers to month names
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    // Extract components from the utcDate
    const day = utcDate.getUTCDate().toString().padStart(2, "0");
    const monthIndex = utcDate.getUTCMonth(); // 0-based index
    const year = utcDate.getUTCFullYear();

    // Format time with dynamic local timezone
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short",
    };

    // Format the time part according to the local timezone
    const timeString = new Intl.DateTimeFormat("en-US", timeOptions).format(
        utcDate
    );

    // Construct the full date string
    const dateString = `${day}-${monthNames[monthIndex]}-${year} @ ${timeString}`;

    return dateString;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnectionLoading, setIsConnectionLoading] =
        useState<boolean>(true); // Initialize with a random boolean
    const [isConnected, setIsConnected] = useState<boolean>(false); // Initialize with a random boolean
    const [message, setMessage] = useState("");


    useEffect(() => {
        // Initialize socket connection
        // const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_IO_SERVER_URL, {
        //   // your connection options here
        //   withCredentials: true,
        //   // additional options if any
        // });

        const newSocket = io();
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("connected to websocket server");
            setIsConnectionLoading(false);
            setIsConnected(true);
            newSocket.emit("init");
            console.log("requested initial data....");
        });

        newSocket.on("message", (data: string) => {
            console.log("received message from server: " + data);
            setMessage(data);
        });

        newSocket.on("disconnect", () => {
            console.log("disconnected to websocket server");
            setIsConnected(false);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnectionLoading,
                isConnected,
                message
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};
