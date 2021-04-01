import React from 'react';
import FormInput from '../base-controls/FormInput';
import { registerComponent } from 'meteor/vulcan:core';
import { scrubNumberValue } from './Number';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PercentIcon from 'mdi-material-ui/Percent';


const styles = theme => ({

  icon: {
    color: [theme.palette.common.midBlack, '!important'],
    width: 20,
  },

});


const useStyles = makeStyles(styles);


const Percent = ({ refFunction, value, handleChange, ...properties }) => {
  const classes = useStyles();
  return <FormInput {...properties}
                    ref={refFunction}
                    scrubValue={scrubNumberValue}
                    type="number"
                    value={value * 100}
                    handleChange={value => handleChange(value / 100)}
                    addonAfter={() => <PercentIcon className={classes.icon}/>}
  />;
};


registerComponent('FormComponentPercent', Percent);
