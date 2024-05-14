"use client"

import CustomTooltip from '@/components/custom-tooltip';
import { Minus, RectangleVertical } from 'lucide-react';
import React, { PureComponent } from 'react';
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
    ComposedChart,
    Line,
    Label
} from 'recharts';


export default function UsageGraph({ data }: any) {
    const colors: any = {
        from_grid: '#FAFAFA',
        to_grid: '#209A22',
        temp: '#ff7300',
    }
    const dateFormatter = (tickItem: string) => {
        // Assuming tickItem is "2023-04-05 00:00:00 to 2023-04-05 00:15:00"
        // Extracts the time part after 'to'
        //console.log(tickItem);
        const endTime = tickItem.split(' to ')[1]; // gives "2023-04-05 00:15:00"
        const timePart = endTime.split(' ')[1]; // gives "00:15:00"
        return timePart.substr(0, 5); // gives "00:15"
    };

    const getIconForType = (type: any) => {
        let content;
        switch (type) {
            case 'line':
                content = <Minus />;
                break;
            case 'rect':
                content = <RectangleVertical />;
                break;
            default:
                content = null;
        }
        return content;
    }

    // Helper function to format Tailwind text color class
    function getTextColorClass(color: any) {
        return `text-[${color}]`;
    }

    const renderLegend = (props: any) => {
        const { payload } = props;
        return (
            <ul className='flex flex-row mt-6 items-center gap-8 justify-center text-sm font-medium'>
                {
                    payload.map((entry: any, index: any) => (
                        //${getTextColorClass(colors[entry.value])}
                        <li key={`item-${index}`} style={{ color: colors[entry.value] }} className={`flex flex-row items-center gap-1`}>
                            {getIconForType(entry.type)}
                            <div>{entry.value}</div>
                        </li>
                    ))
                }
            </ul>
        );
    }

    const renderCustomDot = (props: any) => {
        const { cx, cy, stroke, payload, value } = props;
        return (
            value ? <circle cx={cx} cy={cy} r={0} fill='transparent' stroke={stroke} strokeWidth={2} /> : null
        );
    }

    return (
        <ResponsiveContainer width="100%" height={500}>
            <ComposedChart
                data={data.values}
                stackOffset="sign"
                margin={{
                    top: 0,
                    right: 20,
                    left: 20,
                    bottom: 0,
                }}
            >
                <CartesianGrid stroke='false' />
                <XAxis fontSize={12} dataKey="time_period" tickFormatter={dateFormatter} axisLine={false} tickLine={false} />
                <YAxis className='hidden md:block' yAxisId='left' axisLine={false}>
                    <Label className='text-xs md:text-md' value="kWh" position="left" angle={-90} />
                </YAxis>
                <YAxis className='hidden md:block' yAxisId='right' axisLine={false} orientation="right">
                    <Label className='text-xs md:text-md' value="Temp (°F)" position="right" angle={90} />
                </YAxis>
                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                <Legend className='hidden md:flex flex-row gap-8 mt-4' content={renderLegend} />
                <ReferenceLine yAxisId={"left"} y={0} stroke="#272626" />
                <Line yAxisId="right" type="monotone" dataKey="temp" stroke={colors.temp} dot={false} />
                {/* <Bar yAxisId="left" dataKey="from_grid" fill="currentColor"
                        radius={[4, 4, 0, 0]}
                        className="fill-primary" stackId="stack" /> */}
                <Bar yAxisId="left" dataKey="energy_used" fill={colors.from_grid} stackId="stack" />
                <Bar yAxisId="left" dataKey="solar_sent_to_grid" fill={colors.to_grid} stackId="stack" />
                {/* <Line type="monotone" dataKey="temp" stroke="#ff7300" /> */}
            </ComposedChart>
        </ResponsiveContainer>
    )
}
