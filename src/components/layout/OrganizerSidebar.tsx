import React from "react";
import { NavLink } from "react-router-dom";
import { Users, Vote, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const sidebarNavItems = [
  {
    title: "Manage Voters",
    href: "/organizer/voters",
    icon: Users,
  },
  {
    title: "Manage Polls",
    href: "/organizer/polls",
    icon: Vote,
  },
];

export function OrganizerSidebar() {
  return (
    <aside className="hidden border-r bg-background md:block w-64">
      <div className="flex flex-col gap-2 py-4">
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold tracking-tight">
            Organizer Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">Manage your elections</p>
        </div>
        <Separator className="my-2" />
        <ScrollArea className="flex-1 px-2">
          <nav className="grid items-start gap-2 px-2 py-2">
            {sidebarNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "transparent"
                  )
                }
                end
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
}
