// client/src/components/common/Table.js
import React from "react";
import {
  Table as MuiTable,
  TableHead as MuiTableHead,
  TableBody as MuiTableBody,
  TableRow as MuiTableRow,
  TableCell as MuiTableCell,
} from "@mui/material";

/**
 * Usage:
 * import { Table, TableHead, TableBody, TableRow, TableCell } from "../components/common/Table";
 */

export const Table = ({ children, sx = {}, ...props }) => {
  return (
    <MuiTable sx={sx} {...props}>
      {children}
    </MuiTable>
  );
};

export const TableHead = ({ children, sx = {}, ...props }) => {
  return (
    <MuiTableHead sx={sx} {...props}>
      {children}
    </MuiTableHead>
  );
};

export const TableBody = ({ children, sx = {}, ...props }) => {
  return (
    <MuiTableBody sx={sx} {...props}>
      {children}
    </MuiTableBody>
  );
};

export const TableRow = ({ children, sx = {}, ...props }) => {
  return (
    <MuiTableRow sx={sx} {...props}>
      {children}
    </MuiTableRow>
  );
};

export const TableCell = ({ children, sx = {}, ...props }) => {
  return (
    <MuiTableCell sx={sx} {...props}>
      {children}
    </MuiTableCell>
  );
};
