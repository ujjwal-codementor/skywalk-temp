"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CalendarCheck, CreditCard, ListChecks, User as UserIcon } from "lucide-react";

interface Props {
  selected: string;
  onSelect: (key: string) => void;
}

const items: { key: string; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "general", label: "General", Icon: UserIcon },
  { key: "payments", label: "Payments", Icon: CreditCard },
  { key: "bookings", label: "Bookings", Icon: CalendarCheck },
  { key: "subscriptions", label: "Subscriptions", Icon: ListChecks },
];

export default function UserSidebar({ selected, onSelect }: Props) {
  return (
    <aside className="w-64 shrink-0">
      <Card className="bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sections</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <nav className="flex flex-col">
            {items.map(({ key, label, Icon }) => {
              const active = selected === key;
              return (
                <Button
                  key={key}
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "justify-start w-full mb-1",
                    active && "font-medium"
                  )}
                  onClick={() => onSelect(key)}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              );
            })}
          </nav>
        </CardContent>
      </Card>
    </aside>
  );
}



