import { CalendarDays, Clock, Sun, ThermometerSun, UtilityPole } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Calendar } from "./ui/calendar";

export default function CustomTooltip({ active, payload, label }: any) {
    function formatDateAndTime(timeString: string) {
        // Split the input string to get start and end times
        const [startTimeString, endTimeString] = timeString.split(' to ');

        // Convert strings to Date objects
        const startTime = new Date(startTimeString);
        const endTime = new Date(endTimeString);

        // Define month names for formatting
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // Format the date in "05 April 2023" style
        const formattedDate = `${startTime.getDate()} ${months[startTime.getMonth()]} ${startTime.getFullYear()}`;

        // Function to format time in 12-hour format with AM/PM
        const formatTime = (date: Date) => {
            let hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            return `${hours}:${minutes} ${ampm}`;
        };

        // Format the time range in "12:00 - 12:15 AM" style
        const formattedTimeRange = `${formatTime(startTime)} - ${formatTime(endTime)}`;

        // Return both formatted strings
        return {
            formattedDate,
            formattedTimeRange
        };
    }
    if (active && payload && payload.length) {
        const result = formatDateAndTime(label);
        return (
            // style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            <Card className="text-xs md:text-lg">
                <CardHeader className="flex flex-col items-start gap-2">
                    <CardTitle className="text-md font-medium">
                        <div className="flex flex-row gap-3 items-center">
                            <CalendarDays />
                            <p>{result.formattedDate}</p>
                        </div>
                    </CardTitle>
                    <div className="flex flex-row gap-3 items-center">
                        <Clock />
                        <p>{result.formattedTimeRange}</p>
                    </div>
                    <Separator />
                </CardHeader>
                <CardContent className='flex flex-col gap-1'>
                    <div className="flex flex-col gap-2 items-start">
                        <div className="flex flex-row gap-3 items-center">
                            <ThermometerSun />
                            <p>{`${payload[0]?.value ? payload[0].value : ""} °F`}</p>
                        </div>
                        <div className="flex flex-row gap-3 items-center">
                            <UtilityPole />
                            <p>{`${payload[1]?.value ? payload[1].value : "0"} kWh`}</p>
                        </div>
                        <div className="flex flex-row gap-3 items-center">
                            <Sun />
                            <p>{`${payload[2]?.value ? payload[2].value : "0"} kWh`}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }
    return null;
};