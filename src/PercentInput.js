import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit';

const PercentInput = ({
  variant = 'outlined',
  readOnly = false,
  inputProps = {},
  InputProps = {},
  ...props
}) => {
  
  return (
    <TextField
      margin="normal"
      type="number"
      variant={variant}
      fullWidth
      InputLabelProps={{ shrink: true }}
      InputProps={{
        ...InputProps,
        startAdornment: readOnly 
          ? <InputAdornment position="start">=</InputAdornment> 
          : <InputAdornment position="start"><IconButton><EditIcon /></IconButton></InputAdornment>,
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      }}
      inputProps={{
        step: 1, 
        min: 0, 
        max: 100,
        readOnly: readOnly,
        style: {
          textAlign: 'right',
        },
      }}
      FormHelperTextProps={{ style: { textAlign: 'right' } }}
      {...props}
    />
  );
};

export default PercentInput;