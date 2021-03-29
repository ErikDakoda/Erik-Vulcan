import React from 'react';
import PropTypes from 'prop-types';
import {Components, replaceComponent} from 'meteor/vulcan:core';
import {intlShape} from 'meteor/vulcan:i18n';
import AddIcon from 'mdi-material-ui/Plus';


const NewButton = ({
                     className,
                     collection,
                     type,
                     color,
                     variant,
                     size,
                   }, {intl}) => (

    <Components.ModalTrigger
        className={className}
        component={<Components.TooltipButton titleId="datatable.new"
                                             icon={<AddIcon/>}
                                             type={type}
                                             color={color}
                                             variant={variant}
                                             size={size}
        />}
    >
      <Components.EditForm collection={collection}/>
    </Components.ModalTrigger>
);


NewButton.propTypes = {
  className: PropTypes.string,
  collection: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['simple', 'fab', 'button', 'submit', 'icon', 'menu']),
  color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary']),
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  size: PropTypes.oneOf(['icon', 'xsmall', 'small', 'medium', 'large']),
};

NewButton.defaultProps = {
  type: 'fab',
  color: 'primary',
};

NewButton.contextTypes = {
  intl: intlShape
};


NewButton.displayName = 'NewButton';


replaceComponent('NewButton', NewButton);
