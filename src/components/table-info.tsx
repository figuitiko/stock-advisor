import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  headings: string[];
  rows: string[][];
  caption?: string;
};
export const TableInfo = ({ headings, rows, caption }: Props) => {
  return (
    <Table className="caption-top">
      {caption && <TableCaption className="text-start">{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {headings.map((heading, idx) => (
            <TableHead key={idx}>{heading}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, idx) => (
          <TableRow key={idx}>
            {row.map((cell, idx) => (
              <TableCell key={idx}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
