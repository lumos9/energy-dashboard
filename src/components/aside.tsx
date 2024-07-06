import { DollarSign, LayoutDashboard, SettingsIcon } from "lucide-react"

export default function Aside() {
    return (
        <aside className="hidden md:block md:w-72 z-10 border-r p-8">
            {/* <h3>Sidebar Content</h3> */}
            <ul className="flex flex-col gap-2">
                <li className="cursor-pointer transition-colors rounded-lg px-4 py-2 hover:bg-secondary flex flex-row gap-3 items-center">
                    <LayoutDashboard />
                    <div>Dashboard</div>
                </li>
                <li className="cursor-pointer transition-colors rounded-lg px-4 py-2 hover:bg-secondary flex flex-row gap-3 items-center">
                    <DollarSign />
                    <div>Billing</div>
                </li>
                <li className="cursor-pointer transition-colors rounded-lg px-4 py-2 hover:bg-secondary flex flex-row gap-3 items-center">
                    <SettingsIcon />
                    <div>Settings</div>
                </li>
            </ul>
        </aside>
    )
}
