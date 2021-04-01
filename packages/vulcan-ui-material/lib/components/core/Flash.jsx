import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
  Components,
  replaceComponent,
  registerSetting,
  getSetting
} from 'meteor/vulcan:core';
import {intlShape} from 'meteor/vulcan:i18n';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from 'mdi-material-ui/Close';
import Slide from '@material-ui/core/Slide';
import DOMPurify from 'dompurify';


registerSetting('flash.infoHideSeconds', 5, 'Seconds to display flash info messages');
registerSetting('flash.errorHideSeconds', 15, 'Seconds to display flash error messages');


const styles = theme => ({

  root: {
    maxWidth: 600,
    '& code': {
      fontSize: '0.9rem',
    },
  },

});

const useStyles = makeStyles(styles);


const Flash = (props, context) => {
  const [isOpen, setIsOpen] = useState(true);
  const classes = useStyles(props);
  const intl = context.intl;

  const {message, type, _id} = props.message;
  const infoOrError = ['error', 'danger', 'warning'].includes(type) ? 'error' : 'info';
  const hideDuration = getSetting(`flash.${infoOrError}HideSeconds`) * 1000;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;

    setIsOpen(false);
    setTimeout(() => {
      props.dismissFlash(props.message._id);
    }, 500);
  };

  return (
      <Snackbar
          key={message.content}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={isOpen}
          TransitionComponent={Slide}
          classes={{root: classes.root}}
          autoHideDuration={hideDuration}
          onClose={handleClose}
          ContentProps={{
            'aria-describedby': _id,
          }}
          action={[
            <IconButton
                key="close"
                aria-label={intl.formatMessage({id: 'global.close'})}
                color="inherit"
                onClick={handleClose}
            >
              <CloseIcon/>
            </IconButton>,
          ]}
      >
        <Components.Alert
            onClose={handleClose}
            variant={type}
        >
          <span id={_id}
                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(message)}}
          />
        </Components.Alert>
      </Snackbar>
  );
};


Flash.propTypes = {
  message: PropTypes.object.isRequired,
  dismissFlash: PropTypes.func.isRequired,
};


Flash.contextTypes = {
  intl: intlShape.isRequired,
};


Flash.displayName = 'Flash';


replaceComponent('Flash', Flash);
export default Flash;
