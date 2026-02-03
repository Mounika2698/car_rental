// client/src/components/common/Dialog.js
import React from "react";
import {
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
} from "@mui/material";

/**
 * Usage:
 * import { Dialog, DialogTitle, DialogContent } from "../components/common/Dialog";
 */

export const Dialog = ({ children, sx = {}, ...props }) => {
  return (
    <MuiDialog sx={sx} {...props}>
      {children}
    </MuiDialog>
  );
};

export const DialogTitle = ({ children, sx = {}, ...props }) => {
  return (
    <MuiDialogTitle sx={sx} {...props}>
      {children}
    </MuiDialogTitle>
  );
};

export const DialogContent = ({ children, sx = {}, ...props }) => {
  return (
    <MuiDialogContent sx={sx} {...props}>
      {children}
    </MuiDialogContent>
  );
};
