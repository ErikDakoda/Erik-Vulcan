import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent } from 'meteor/vulcan:core';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = React.forwardRef((props, ref) => {
  const { children, variant = 'error', ...rest } = props;
  const severity = ['error', 'danger'].includes(variant) ? 'error' :
      ['primary', 'secondary', 'info', 'light', 'dark'].includes(variant) ? 'info' :
          variant; // 'success' or 'warning'

  return (
      <MuiAlert
          ref={ref}
          severity={severity}
          variant="filled"
          {...rest}
      >
        {children}
      </MuiAlert>
  );
});

Alert.propTypes = {
  variant: PropTypes.oneOf(
      ['error', 'danger', 'success', 'warning', 'primary', 'secondary', 'info', 'light', 'dark']),
};

Alert.displayName = 'Alert';

registerComponent({ name: 'Alert', component: Alert });
