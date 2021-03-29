import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import {
  registerComponent,
  instantiateComponent,
  Utils,
  debug
} from 'meteor/vulcan:core';
import {intlShape} from 'meteor/vulcan:i18n';
import {Link} from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import withTheme from '@material-ui/core/styles/withTheme';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import classNames from 'classnames';


const styles = theme => ({

  root: {
    display: 'contents',
  },

  popper: {
    transition: theme.transitions.create(['opacity'], {
      duration: theme.transitions.duration.complex,
    }),
  },

  tooltip: {},

  buttonWrap: {
    transition: theme.transitions.create(['opacity'], {
      duration: theme.transitions.duration.complex,
    }),
    position: 'relative',
    display: 'inline-flex',
  },

  hidden: {
    opacity: 0,
  },

  button: {},

  buttonOrSubmit: {},

  fab: {},

  menu: {},

  iconButton: {},

  popoverPopper: {
    zIndex: 1700,
  },

  popoverTooltip: {
    zIndex: 1701,
  },

  iconWrap: {
    position: 'relative',
  },

  icon: {
    width: 24,
    height: 24,
  },

  xsmall: {
    width: 32,
    height: 32,
  },

  small: {
    width: 40,
    height: 40,
  },

  medium: {
    width: 48,
    height: 48,
  },

  large: {
    width: 56,
    height: 56,
  },

  dangerButton: {
    ...theme.utils.dangerButton,
  },

  progress: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
  },

  buttonProgress: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: -4,
    right: -4,
    bottom: -4,
    left: -4,
  },

});

const TooltipButton = (props, {intl}) => {
  const {
    title,
    titleId,
    titleValues,
    label,
    labelId,
    placement,
    icon,
    linkTo,
    loading,
    disabled,
    hidden,
    type,
    size,
    danger,
    className,
    classes,
    theme,
    enterDelay,
    leaveDelay,
    buttonRef,
    parent,
    children,
    cursor,
    TooltipProps,
    ...properties
  } = props;

  const popperRef = useRef(null);
  const scheduleUpdate = () => {
    if (popperRef.current) {
      popperRef.current.scheduleUpdate();
      debug('TooltipButton scheduled an update');
    }
  };

  const iconWithClass = instantiateComponent(icon, {className: classNames('icon', classes.icon)});
  const popperClass = classNames('popper', classes.popper, parent === 'popover' && classes.popoverPopper, hidden && classes.hidden);
  const tooltipClass = classNames('tooltip', classes.tooltip, parent === 'popover' && classes.popoverTooltip);
  const buttonWrapClass = classNames('button-wrap', classes.buttonWrap, hidden && classes.hidden);
  const buttonWrapStyle = cursor ? {cursor: cursor} : null;

  const tooltipEnterDelay = typeof enterDelay === 'number' ? enterDelay : theme.utils.tooltipEnterDelay;
  const tooltipLeaveDelay = typeof leaveDelay === 'number' ? leaveDelay : theme.utils.tooltipLeaveDelay;
  let titleText = title || (titleId ? intl.formatMessage({id: titleId}, titleValues) : '');
  let labelText = label || (labelId ? intl.formatMessage({id: labelId}, titleValues) : '');
  if (type === 'button' || type === 'menu') {
    if (!labelText) labelText = titleText;
    if (titleText === labelText) titleText = '';
  }
  const slug = Utils.slugify(titleId || labelId);
  const dangerClass = danger && classes.dangerButton;

  return (
      <span className={classNames('tooltip-button', classes.root, className)}>

      <Tooltip id={`tooltip-${slug}`}
               title={titleText}
               placement={placement}
               arrow
               enterDelay={tooltipEnterDelay}
               leaveDelay={tooltipLeaveDelay}
               classes={{
                 tooltip: tooltipClass,
                 popper: popperClass,
               }}
               PopperProps={{popperRef}}
               {...TooltipProps}
      >
        <span className={buttonWrapClass} style={buttonWrapStyle}>
          {
            type === 'menu'

                ?

                <MenuItem
                    className={classNames(slug, classes.button, classes.menu, dangerClass)}
                    {...properties}
                    button={true}
                    disabled={loading || disabled}
                >
                  <ListItemIcon>
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={labelText}/>
                </MenuItem>

                :

                type === 'fab' && !!icon

                    ?

                    <>
                      <Fab
                          className={classNames(slug, classes.button, classes.fab, dangerClass)}
                          {...properties}
                          component={linkTo ? Link : 'button'}
                          to={linkTo}
                          size={size}
                          aria-label={title}
                          ref={buttonRef}
                          disabled={loading || disabled}
                      >
                        {iconWithClass}
                      </Fab>
                      {loading && <CircularProgress size="auto"
                                                    className={classes.progress}/>}
                    </>

                    :

                    ['button', 'submit'].includes(type)

                        ?

                        <Button
                            className={classNames(slug, classes.button, classes.buttonOrSubmit, dangerClass)}
                            {...properties}
                            component={linkTo ? Link : type}
                            to={linkTo}
                            size={size}
                            aria-label={title}
                            ref={buttonRef}
                            disabled={loading || disabled}
                        >
                          {
                            iconWithClass &&

                            <span
                                className={classNames('icon-wrap', classes.iconWrap)}>
                              {iconWithClass}
                              {loading && <CircularProgress size="auto"
                                                            className={classes.buttonProgress}/>}
                            </span>
                          }
                          {labelText}
                        </Button>

                        :

                        !!icon

                            ?

                            <>
                              <IconButton
                                  className={classNames(slug, classes.button, classes.iconButton, classes[size], dangerClass)}
                                  component={linkTo ? Link : 'button'}
                                  to={linkTo}
                                  {...properties}
                                  aria-label={title}
                                  ref={buttonRef}
                                  disabled={(loading && !(disabled === false)) || disabled}
                              >
                                {iconWithClass}
                              </IconButton>
                              {loading && <CircularProgress size="auto"
                                                            className={classes.progress}/>}
                            </>

                            :

                            linkTo ?

                                <Link to={linkTo} {...properties}>
                                  {children}
                                </Link>

                                :

                                children
          }
        </span>
      </Tooltip>

    </span>
  );

};

TooltipButton.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  titleId: PropTypes.string,
  titleValues: PropTypes.object,
  label: PropTypes.node,
  labelId: PropTypes.string,
  type: PropTypes.oneOf(['simple', 'fab', 'button', 'submit', 'icon', 'menu']),
  size: PropTypes.oneOf(['icon', 'xsmall', 'small', 'medium', 'large']),
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary']),
  danger: PropTypes.bool,
  placement: PropTypes.oneOf(['bottom-end', 'bottom-start', 'bottom',
    'left-end', 'left-start', 'left', 'right-end', 'right-start', 'right', 'top-end', 'top-start', 'top']),
  icon: PropTypes.node,
  linkTo: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  className: PropTypes.string,
  classes: PropTypes.object,
  buttonRef: PropTypes.func,
  theme: PropTypes.object,
  enterDelay: PropTypes.number,
  leaveDelay: PropTypes.number,
  parent: PropTypes.oneOf(['default', 'popover']),
  children: PropTypes.node,
  cursor: PropTypes.string,
  TooltipProps: PropTypes.object,
};

TooltipButton.defaultProps = {
  placement: 'bottom',
  parent: 'default',
  size: 'medium',
};

TooltipButton.contextTypes = {
  intl: intlShape.isRequired,
};

TooltipButton.displayName = 'TooltipButton';

registerComponent('TooltipButton', TooltipButton, [withStyles, styles], withTheme);

export default TooltipButton;
