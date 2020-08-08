import React, { forwardRef } from 'react';
import { TextField } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  input: {
    backgroundColor: '#fff',
  },
}));

const PhoneInput: React.RefForwardingComponent<HTMLInputElement> = (
  props,
  ref,
) => {
  const classes = useStyles();

  return (
    <TextField
      {...props}
      InputProps={{
        className: classes.input,
      }}
      inputRef={ref}
      fullWidth
      size="small"
      variant="outlined"
      label="Telefone"
      name="phone"
      id="phone-input"
    />
  );
};
export default forwardRef(PhoneInput);
