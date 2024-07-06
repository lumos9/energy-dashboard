"use client"

import * as React from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    solar_produced: {
        label: "Solar Produced",
        //color: "hsl(var(--chart-1))",
        color: "#feb921"
    },
    solar_usage: {
        label: "Solar Usage",
        //color: "hsl(var(--chart-2))",
        color: "#6cb32f"
    },
    battery_usage: {
        label: "Battery Usage",
        //color: "hsl(var(--chart-5))",
        color: "#b0b0b0"
    },
    grid_usage: {
        label: "Grid Usage",
        //color: "hsl(var(--chart-3))",
        color: "#f84d3b"
    },
    excess_solar_sent_to_battery: {
        label: "Solar -> Battery",
        //color: "hsl(var(--chart-4))",
        color: "#2e86de"
    },
    excess_solar_sent_to_grid: {
        label: "Solar -> Grid",
        //color: "hsl(var(--chart-5))",
        color: "#0c3cff"
    },
} satisfies ChartConfig

export function UsageGraph({ chartData }: any) {
    const [timeRange, setTimeRange] = React.useState("90d")

    // const filteredData = chartData.filter((item) => {
    //     const date = new Date(item.date)
    //     const now = new Date()
    //     let daysToSubtract = 90
    //     if (timeRange === "30d") {
    //         daysToSubtract = 30
    //     } else if (timeRange === "7d") {
    //         daysToSubtract = 7
    //     }
    //     now.setDate(now.getDate() - daysToSubtract)
    //     return date >= now
    // })

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Energy Usage</CardTitle>
                    <CardDescription>
                        Showing total Usage
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <ComposedChart accessibilityLayer data={chartData} stackOffset="sign">
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="end_time"
                            tickLine
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickCount={chartData.length}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                // Extract hours and minutes
                                const hours = date.getHours().toString().padStart(2, '0');
                                const minutes = date.getMinutes().toString().padStart(2, '0');
                                // Format time in 24-hour format
                                return `${hours}:${minutes}`;
                                // return date.toLocaleDateString("en-US", {
                                //     hour: "numeric",
                                //     second: "numeric"
                                // })
                            }}
                        />
                        <YAxis tickLine axisLine={false} />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[200px]"
                                    labelFormatter={(value) => {
                                        return value;
                                        // return new Date(value).toLocaleDateString("en-US", {
                                        //     month: "short",
                                        //     day: "numeric",
                                        // })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <defs>
                            <linearGradient id="fillSolarProduced" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-solar_produced)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-solar_produced)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="solar_produced"
                            type="natural"
                            fill="url(#fillSolarProduced)"
                            stroke="var(--color-solar_produced)"
                            stackId="b"
                        />
                        <Bar dataKey={"solar_usage"} stackId={"a"} fill={"var(--color-solar_usage)"} radius={[0, 0, 0, 0]} />
                        <Bar dataKey={"battery_usage"} stackId={"a"} fill={"var(--color-battery_usage)"} radius={[0, 0, 0, 0]} />
                        <Bar dataKey={"grid_usage"} stackId={"a"} fill={"var(--color-grid_usage)"} radius={[4, 4, 0, 0]} />
                        <Bar dataKey={"excess_solar_sent_to_battery"} stackId={"a"} fill={"var(--color-excess_solar_sent_to_battery)"} />
                        <Bar dataKey={"excess_solar_sent_to_grid"} stackId={"a"} fill={"var(--color-excess_solar_sent_to_grid)"} radius={[4, 4, 0, 0]} />
                    </ComposedChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}


{/* <AreaChart data={chartData}>
<defs>
    <linearGradient id="fillSolarProduced" x1="0" y1="0" x2="0" y2="1">
        <stop
            offset="5%"
            stopColor="var(--color-solar_produced)"
            stopOpacity={0.8}
        />
        <stop
            offset="95%"
            stopColor="var(--color-solar_produced)"
            stopOpacity={0.1}
        />
    </linearGradient>
    <linearGradient id="fillSolarUsage" x1="0" y1="0" x2="0" y2="1">
        <stop
            offset="5%"
            stopColor="var(--color-solar_usage)"
            stopOpacity={0.8}
        />
        <stop
            offset="95%"
            stopColor="var(--color-solar_usage)"
            stopOpacity={0.1}
        />
    </linearGradient>
    <linearGradient id="fillBatteryUsage" x1="0" y1="0" x2="0" y2="1">
        <stop
            offset="5%"
            stopColor="var(--color-battery_usage)"
            stopOpacity={0.8}
        />
        <stop
            offset="95%"
            stopColor="var(--color-battery_usage)"
            stopOpacity={0.1}
        />
    </linearGradient>
    <linearGradient id="fillGridUsage" x1="0" y1="0" x2="0" y2="1">
        <stop
            offset="5%"
            stopColor="var(--color-grid_usage)"
            stopOpacity={0.8}
        />
        <stop
            offset="95%"
            stopColor="var(--color-battery_usage)"
            stopOpacity={0.1}
        />
    </linearGradient>
    <linearGradient id="fillSolarToBattery" x1="0" y1="0" x2="0" y2="1">
        <stop
            offset="5%"
            stopColor="var(--color-excess_solar_sent_to_battery)"
            stopOpacity={0.8}
        />
        <stop
            offset="95%"
            stopColor="var(--color-excess_solar_sent_to_battery)"
            stopOpacity={0.1}
        />
    </linearGradient>
    <linearGradient id="fillSolarToGrid" x1="0" y1="0" x2="0" y2="1">
        <stop
            offset="5%"
            stopColor="var(--color-excess_solar_sent_to_grid)"
            stopOpacity={0.8}
        />
        <stop
            offset="95%"
            stopColor="var(--color-excess_solar_sent_to_grid)"
            stopOpacity={0.1}
        />
    </linearGradient>
</defs>
<CartesianGrid vertical={false} />
<XAxis
    dataKey="end_time"
    tickLine
    axisLine={false}
    tickMargin={8}
    minTickGap={16}
    tickCount={chartData.length}
    tickFormatter={(value) => {
        const date = new Date(value)
        // Extract hours and minutes
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        // Format time in 24-hour format
        return `${hours}:${minutes}`;
        // return date.toLocaleDateString("en-US", {
        //     hour: "numeric",
        //     second: "numeric"
        // })
    }}
/>
<YAxis tickLine axisLine={false} />
<ChartTooltip
    cursor={false}
    content={
        <ChartTooltipContent
            labelFormatter={(value) => {
                return value;
                // return new Date(value).toLocaleDateString("en-US", {
                //     month: "short",
                //     day: "numeric",
                // })
            }}
            indicator="dot"
        />
    }
/>
{/* <Area
    dataKey="solar_produced"
    type="natural"
    fill="url(#fillSolarProduced)"
    stroke="var(--color-solar_produced)"
    stackId="a"
/> */}
{/* <Area
    dataKey="solar_usage"
    type="natural"
    fill="url(#fillSolarUsage)"
    stroke="var(--color-solar_usage)"
    stackId="b"
/>
<Area
    dataKey="battery_usage"
    type="natural"
    fill="url(#fillBatteryUsage)"
    stroke="var(--color-battery_usage)"
    stackId="c"
/>
<Area
    dataKey="grid_usage"
    type="natural"
    fill="url(#fillGridUsage)"
    stroke="var(--color-grid_usage)"
    stackId="d"
/>
<Area
    dataKey="excess_solar_sent_to_battery"
    type="natural"
    fill="url(#fillSolarToBattery)"
    stroke="var(--color-excess_solar_sent_to_battery)"
    stackId="e"
/>
<Area
    dataKey="excess_solar_sent_to_grid"
    type="natural"
    fill="url(#fillSolarToGrid)"
    stroke="var(--color-excess_solar_sent_to_grid)"
    stackId="f"
/> */}



{/* <ChartLegend content={<ChartLegendContent />} />
</AreaChart > */}
