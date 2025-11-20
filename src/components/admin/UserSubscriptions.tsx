import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Props {
  subscriptions: any[];
}

export default function UserSubscriptions({ subscriptions }: Props) {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs break-all">{s.id}</TableCell>
                <TableCell>{s.planType || s.subscriptionType}</TableCell>
                <TableCell>{s.status}</TableCell>
                <TableCell>{(s.startDate || s.serviceStartTime) ? new Date(s.startDate || s.serviceStartTime).toLocaleDateString() : "-"}</TableCell>
                <TableCell>{(s.endDate || s.serviceEndTime) ? new Date(s.endDate || s.serviceEndTime).toLocaleDateString() : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}



