import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  
  export default function EventTable() {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Hackathon 2025</TableCell>
            <TableCell>12 Mar 2025</TableCell>
            <TableCell>Completed</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
  