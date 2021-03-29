import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import { registerComponent, Components, withComponents, formatLabel } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from 'mdi-material-ui/Pencil';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import classNames from 'classnames';
import get from 'lodash/get';
import _without from 'lodash/without';


const getLabel = (field, fieldName, collection, intl) => {
  const schema = collection?.simpleSchema()._schema;
  return formatLabel({
    intl,
    fieldName: fieldName,
    collectionName: collection && collection._name,
    schema: schema,
  });
};


const CardItem = ({ document, label, value, fieldName, collection, typeName, Components, classes }) =>
  <TableRow className={classes.tableRow}>
    <TableCell className={classNames(classes.tableHeadCell, 'datacard-label')} variant="head">
      {label}
    </TableCell>
    <TableCell className={classNames(classes.tableCell, 'datacard-value')}>
      <Components.CardItemSwitcher
        document={document}
        value={value}
        typeName={typeName}
        Components={Components}
        fieldName={fieldName}
        collection={collection}
      />
    </TableCell>
  </TableRow>;


const CardEdit = (props, context) => {
  const classes = props.classes;
  const editTitle = context.intl.formatMessage({ id: 'cards.edit' });
  return (
    <TableRow className={classes.tableRow}>
      <TableCell className={classes.tableCell} colSpan="2">
        <Components.ModalTrigger label={editTitle}
                                 component={
                                   <IconButton aria-label={editTitle}>
                                     <EditIcon/>
                                   </IconButton>
                                 }
        >
          <CardEditForm {...props} />
        </Components.ModalTrigger>
      </TableCell>
    </TableRow>
  );
};


CardEdit.contextTypes = { intl: intlShape };


const CardEditForm = ({ collection, document, closeModal, editFormProps }) =>
  <Components.SmartForm
    collection={collection}
    documentId={document._id}
    showRemove={true}
    successCallback={document => {
      closeModal();
    }}
    {...editFormProps}
  />;


const styles = theme => ({
  root: {},
  table: {
    maxWidth: '100%',
  },
  tableBody: {},
  tableRow: {},
  tableCell: {},
  tableHeadCell: {},
});


const Card2 = ({
                title,
                className,
                collection,
                document,
                currentUser,
                fields,
                showEdit = true,
                Components,
                classes,
                editFormProps,
              }, { intl }) => {
  
  const fieldNames = fields ? fields : _without(Object.keys(document), '__typename');
  
  let canUpdate = false;
  
  // new APIs
  const permissionCheck = get(collection, 'options.permissions.canUpdate');
  // openCRUD backwards compatibility
  const check = get(collection, 'options.mutations.edit.check') || get(collection, 'options.mutations.update.check');
  
  if (Users.isAdmin(currentUser)) {
    canUpdate = true;
  } else if (permissionCheck) {
    canUpdate = Users.permissionCheck({
      check: permissionCheck,
      user: currentUser,
      context: { Users },
      operationName: 'update',
    });
  } else if (check) {
    canUpdate = check && check(currentUser, document, { Users });
  }
  
  const typeName = collection && collection.typeName.toLowerCase();
  const semantizedClassName = classNames(
    classes.root,
    'datacard',
    typeName && `datacard-${typeName}`,
    document && document._id && `datacard-${document._id}`,
    className,
  );
  
  return (
    <div className={semantizedClassName}>
      {title && <div className="datacard-title">{title}</div>}
      <Table className={classNames(classes.table, 'table')} style={{ maxWidth: '100%' }} size="small">
        <TableBody>
          {canUpdate ? <CardEdit collection={collection} document={document} classes={classes} editFormProps={editFormProps}/> :
            null}
          {fieldNames.map((fieldName, index) =>
            <CardItem
              key={index}
              document={document}
              label={getLabel(document[fieldName], fieldName, collection, intl)}
              value={document[fieldName]}
              fieldName={fieldName}
              collection={collection}
              typeName={typeName}
              Components={Components}
              classes={classes}
            />,
          )}
        </TableBody>
      </Table>
    </div>
  );
};


Card2.displayName = 'Card2';


Card2.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
  collection: PropTypes.object,
  document: PropTypes.object,
  currentUser: PropTypes.object,
  fields: PropTypes.array,
  showEdit: PropTypes.bool,
  editFormProps: PropTypes.object,
  classes: PropTypes.object.isRequired,
};


Card2.contextTypes = {
  intl: intlShape,
};


registerComponent('Card2', Card2, withComponents, [withStyles, styles]);
