import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

/**
 * Reusable Date Picker Component
 * @param {string} label - Label for the input
 * @param {object} value - Dayjs object
 * @param {function} onChange - Callback function
 * @param {object} minDate - Minimum selectable date
 */
export const RentalDatePicker = ({ label, value, onChange, minDate }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label={label}
                value={value}
                onChange={onChange}
                minDate={minDate}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        sx: {
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                bgcolor: 'white',
                            }
                        }
                    },
                }}
            />
        </LocalizationProvider>
    );
};