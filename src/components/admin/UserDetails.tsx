import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  user: any;
}

export default function UserDetails({ user }: Props) {
  if (!user) return null;
  const initials = (user.fullName || user.email || "?")
    .split(" ")
    .map((p: string) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <Card className="bg-white">
      <CardHeader className="flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <CardTitle className="text-xl">{user.fullName || "Unnamed User"}</CardTitle>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Phone</div>
            <div className="font-medium">{user.phone || "-"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Created</div>
            <div className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}</div>
          </div>
          <div className="md:col-span-2">
            <div className="text-muted-foreground">Address</div>
            <div className="font-medium whitespace-pre-wrap break-words">{user.address || "-"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



