import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText
} from "@mui/material";

const MuiSelect = ({
    label,
    value,
    onChange,
    options = [],
    fullWidth = true,
    required = false,
    disabled = false,
    error = false,
    helperText = "",
}) => {
    const selectedValue = value || options?.[0]?.value || "";
    return (
        <FormControl
            fullWidth={fullWidth}
            required={required}
            error={error}
        >
            <InputLabel>{label}</InputLabel>

            <Select
                value={selectedValue}
                label={label}
                onChange={onChange}
                disabled={disabled}
                displayEmpty
            >

                {/* Options */}
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>

            {helperText && (
                <FormHelperText>{helperText}</FormHelperText>
            )}
        </FormControl>
    );
};

export default MuiSelect;
