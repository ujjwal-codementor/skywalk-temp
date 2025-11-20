import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Props {
  payments: any[];
}

export default function PaymentHistory({ payments }: Props) {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs break-all">{p.invoiceId}</TableCell>
                <TableCell>{p.status ?? (p.isCancelPayment ? "cancel" : "paid")}</TableCell>
                <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  {p.invoiceLink && (
                    <a href={p.invoiceLink} target="_blank" rel="noreferrer" className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 inline-block">Invoice</a>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}



