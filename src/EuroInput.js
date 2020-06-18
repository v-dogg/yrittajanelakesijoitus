import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit';
import NumberFormat from 'react-number-format';


function EuroNumberFormat(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator=' '
      isNumericString
    />
  );
}

EuroNumberFormat.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const EuroInput = ({
  variant = 'outlined',
  readOnly = false,
  inputProps = {},
  InputProps = {},
  ...props
}) => {
  
  return (
    <TextField
      margin="normal"
      variant={variant}
      fullWidth
      InputLabelProps={{ shrink: true }}
      InputProps={{
        ...InputProps,
        startAdornment: readOnly 
          ? <InputAdornment position="start">=</InputAdornment> 
          : <InputAdornment position="start"><IconButton><EditIcon /></IconButton></InputAdornment>,
        endAdornment: <InputAdornment position="end">€</InputAdornment> ,
        inputComponent: EuroNumberFormat
      }}
      inputProps={{
        ...inputProps,
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

export default EuroInput;