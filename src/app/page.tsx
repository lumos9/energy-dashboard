"use client"

import CustomTooltip from '@/components/custom-tooltip';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsageGraph } from '@/components/usage-graph';
import React, { PureComponent } from 'react';
import data from '../../public/data.json';  // Adjust the path as necessary

export default function Home() {
  const cumulativeSum_from_grid = data.values.reduce((accumulator, current) => {
    return accumulator + 0 //current.grid_energy_consumption;
  }, 0); // The initial value of the accumulator is 0

  const cumulativeSum_to_grid = data.values.reduce((accumulator, current) => {
    return accumulator + 0 //current.solar_sent_to_grid;
  }, 0); // The initial value of the accumulator is 0
  return (
    <div className='w-full flex flex-col p-4 md:p-8 gap-8'>
      <div className="w-full flex flex-col lg:flex-row items-center lg:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="w-full lg:w-auto flex flex-row items-center space-x-2 overflow-x-auto">
          <Button variant={"outline"}>Today</Button>
          <Button variant={"outline"}>Weekly</Button>
          <Button variant={"outline"}>Monthly</Button>
          <Button variant={"outline"}>Yearly</Button>
          <CalendarDateRangePicker />
          {/* <Button>Download</Button> */}
        </div>
      </div>
      {/* <div className='text-muted-foreground'>Stats for 05 April 2024</div> */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Energy From Grid
            </CardTitle>
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg> */}
          </CardHeader>
          <CardContent className='flex flex-col gap-1'>
            <div className="text-2xl font-bold">{cumulativeSum_from_grid.toFixed(2)} kWh</div>
            {/* <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Energy To Grid
            </CardTitle>
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg> */}
          </CardHeader>
          <CardContent className='flex flex-col gap-1'>
            <div className="text-2xl font-bold">{Math.abs(cumulativeSum_to_grid).toFixed(2)} kWh</div>
            {/* <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Net Energy
            </CardTitle>
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg> */}
          </CardHeader>
          <CardContent className='flex flex-col gap-1'>
            <div className="text-2xl font-bold">{Math.abs(cumulativeSum_to_grid + cumulativeSum_from_grid).toFixed(2)} kWh</div>
            {/* <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
          </CardContent>
        </Card>
      </div>
      <UsageGraph chartData={data.values} />
    </div>
  )
}
