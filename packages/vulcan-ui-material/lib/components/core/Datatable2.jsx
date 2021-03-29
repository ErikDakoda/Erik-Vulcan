import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  registerComponent,
  withCurrentUser,
  Utils,
  withMulti2,
  getCollection,
  instantiateComponent,
  withComponents,
} from 'meteor/vulcan:core';
import compose from 'recompose/compose';
import { intlShape } from 'meteor/vulcan:i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import _sortBy from 'lodash/sortBy';
import classNames from 'classnames';

/*

Datatable2 Component using withMulti2

*/
const baseStyles = theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  container: {},
  header: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchWrapper: {},
  addButtonWrapper: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(-8),
  },
  addButton: {},
  table: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  denseTable: theme.utils.denseTable,
  flatTable: theme.utils.flatTable,
  denserTable: theme.utils.denserTable,
  tableHead: {},
  tableBody: {},
  tableFooter: {},
  tablePagination: {},
  tableRow: {},
  tableHeadCell: {},
  tableCell: {},
  clickRow: {
    cursor: 'pointer',
  },
  editCell: {
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
    textAlign: 'right',
  },
  editButton: {},
});

class Datatable2 extends PureComponent {
  
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      offset: 0,
      limit: 25,
      currentSort: {},
    };
  }

  toggleSort = column => {
    let currentSort;
    if (!this.state.currentSort[column]) {
      currentSort = { [column]: 1 };
    } else if (this.state.currentSort[column] === 1) {
      currentSort = { [column]: -1 };
    } else {
      currentSort = {};
    }
    this.setState({ currentSort });
  };

  updateSearch = (search) => {
    if (this.props.updateSearch) {
      this.props.updateSearch(search);
    } else {
      this.setState({ search });
    }
  }
  
  setPaginationTerms = (paginationTerms) => {
    if (this.props.setPaginationTerms) {
      this.props.setPaginationTerms(paginationTerms);
    } else {
      this.setState(paginationTerms);
    }
  }
  
  getInput() {
    return {
      search: this.state.search,
      offset: this.state.offset,
      limit: this.state.limit,
      ...this.props.options?.input,
    };
  }

  render() {
    const { Components } = this.props;
    
    if (this.props.data) {
      return (
        <Components.DatatableContents2
          columns={this.props.data.length ? Object.keys(this.props.data[0]) : undefined}
          results={this.props.data}
          count={this.props.data.length}
          totalCount={this.props.data.length}
          showEdit={false}
          showNew={false}
          {...this.props}
          input={this.getInput()}
          updateSearch={this.updateSearch}
          setPaginationTerms={this.setPaginationTerms}
        />
      );
    } else {
      const { className, options, showSearch, showNew, classes, TableProps, SearchInputProps } = this.props;

      const collection = this.props.collection || getCollection(this.props.collectionName);

      const listOptions = {
        ...options,
        collection,
        input: this.getInput(),
      };
  
      const DatatableWithMulti = compose(withMulti2(listOptions))(Components.DatatableContents2);
      
      return (
        <div
          className={classNames(
            'datatable',
            `datatable-${collection._name}`,
            classes.root,
            className
          )}>
          {/* DatatableAbove Component part*/}
          {(showSearch || showNew) && (
            <div className={classes.header}>
              {showSearch && (
                <div className={classes.searchWrapper}>
                  <Components.SearchInput
                    value={this.state.search}
                    updateQuery={this.updateSearch}
                    className={classes.search}
                    labelId={'datatable.search'}
                    {...SearchInputProps}
                  />
                </div>
              )}
              {showNew && (
                <div className={classes.addButtonWrapper}>
                  <Components.NewButton
                    className={classes.addButton}
                    collection={collection}
                  />
                </div>
              )}
            </div>
          )}
  
          <DatatableWithMulti
            {...this.props}
            collection={collection}
            currentUser={this.props.currentUser}
            toggleSort={this.toggleSort}
            currentSort={this.state.currentSort}
            input={this.getInput()}
            updateSearch={this.updateSearch}
            setPaginationTerms={this.setPaginationTerms}
            {...TableProps}
          />

        </div>
      );
    }
  }
}

Datatable2.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  collection: PropTypes.object,
  options: PropTypes.object,
  columns: PropTypes.array,
  showEdit: PropTypes.bool,
  editComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  showNew: PropTypes.bool,
  showSearch: PropTypes.bool,
  emptyState: PropTypes.node,
  currentUser: PropTypes.object,
  classes: PropTypes.object,
  data: PropTypes.array,
  footerData: PropTypes.array,
  dense: PropTypes.string,
  queryDataRef: PropTypes.func,
  rowClass: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  handleRowClick: PropTypes.func,
  intlNamespace: PropTypes.string,
  toggleSort: PropTypes.func,
  currentSort: PropTypes.object,
  paginate: PropTypes.bool,
  updateSearch: PropTypes.func,
  setPaginationTerms: PropTypes.func,
  container: PropTypes.elementType,
  Components: PropTypes.object.isRequired,
  TableProps: PropTypes.object,
  TablePaginationProps: PropTypes.object,
  SearchInputProps: PropTypes.object,
};

Datatable2.defaultProps = {
  showNew: true,
  showEdit: true,
  showSearch: true,
  paginate: false,
};

registerComponent('Datatable2', Datatable2, withCurrentUser, withComponents, [withStyles, baseStyles]);

const DatatableTitle2 = ({ title }) => (
  <Toolbar>
    <Typography variant="h6" id="tableTitle">
      {title}
    </Typography>
  </Toolbar>
);
registerComponent('DatatableTitle2', DatatableTitle2);

const DatatableContentsInnerLayout2 = Table;
registerComponent('DatatableContentsInnerLayout2', DatatableContentsInnerLayout2);

/*

DatatableContents2 Component

*/

const wrapColumns = c => ({ name: c });

const getColumns = (columns, results, data) => {
  if (columns) {
    // convert all columns to objects
    const convertedColums = columns.map(column =>
      typeof column === 'object' ? column : { name: column }
    );
    const sortedColumns = _sortBy(convertedColums, column => column.order);
    return sortedColumns;
  } else if (results && results.length > 0) {
    // if no columns are provided, default to using keys of first array item
    return Object.keys(results[0])
      .filter(k => k !== '__typename')
      .map(wrapColumns);
  } else if (data) {
    // note: withMulti HoC also passes a prop named data, but in this case
    // data should be the prop passed to the Datatable
    return Object.keys(data[0]).map(wrapColumns);
  }
  return [];
};

const DatatableContents2 = ({
  collection,
  error,
  columns,
  results = [],
  loading,
  loadMore,
  count,
  totalCount,
  networkStatus,
  refetch,
  showEdit,
  editComponent,
  emptyState,
  currentUser,
  classes,
  footerData,
  dense,
  queryDataRef,
  rowClass,
  handleRowClick,
  intlNamespace,
  title,
  toggleSort,
  currentSort,
  paginate,
  updateSearch,
  setPaginationTerms,
  input,
  container,
  Components,
  TableProps,
  TablePaginationProps,
}) => {
  if (queryDataRef) queryDataRef(this.props);
  
  if (!loading && !results?.length) {
    return emptyState || null;
  }

  let sortedColumns = getColumns(columns, results);

  const denseClass = dense && classes[dense + 'Table'];

  // Pagination functions
  
  const getPage = () => {
    return typeof totalCount === 'undefined' ? 0 : Math.floor(input.offset / input.limit);
  }
  
  const onChangePage = (event, page) => {
    const paginationTerms = {
      limit: input.limit,
      offset: page * input.limit,
    };
    setPaginationTerms(paginationTerms);
  };

  const onChangeRowsPerPage = (event) => {
    const paginationTerms = {
      limit: event.target.value || input.limit,
      offset: input.offset,
    }
    setPaginationTerms(paginationTerms);
  };
  
  const Container = container|| TableContainer;
  
  return (
    <React.Fragment>
      {error && <Components.Alert variant="danger">{error.message}</Components.Alert>}
      {title && <Components.DatatableTitle2 title={title} />}
      <Container className={classes.container}>
        {loading && <Components.Loading overlaid />}
        <Components.DatatableContentsInnerLayout2 className={classNames(classes.table, denseClass)} {...TableProps}>
          {sortedColumns && (
            <TableHead className={classes.tableHead}>
              <TableRow className={classes.tableRow}>
                {_sortBy(sortedColumns, column => column.order).map((column, index) => (
                  <Components.DatatableHeader2
                    key={index}
                    collection={collection}
                    intlNamespace={intlNamespace}
                    column={column}
                    classes={classes}
                    toggleSort={toggleSort}
                    currentSort={currentSort}
                  />
                ))}
                {(showEdit || editComponent) && <TableCell className={classes.tableHeadCell} />}
              </TableRow>
            </TableHead>
          )}
  
          {results && (
            <TableBody className={classes.tableBody}>
              {results.map((document, index) => (
                <Components.DatatableRow2
                  collection={collection}
                  Components={Components}
                  columns={sortedColumns}
                  document={document}
                  refetch={refetch}
                  key={index}
                  showEdit={showEdit}
                  editComponent={editComponent}
                  currentUser={currentUser}
                  classes={classes}
                  rowClass={rowClass}
                  handleRowClick={handleRowClick}
                />
              ))}
            </TableBody>
          )}
  
          {footerData && (
            <TableFooter className={classes.tableFooter}>
              <TableRow className={classes.tableRow}>
                {_sortBy(columns, column => column.order).map((column, index) => (
                  <TableCell
                    key={index}
                    className={classNames(classes.tableCell, column.footerClass)}>
                    {footerData[index]}
                  </TableCell>
                ))}
                {(showEdit || editComponent) && <TableCell className={classes.tableCell} />}
              </TableRow>
            </TableFooter>
          )}
        </Components.DatatableContentsInnerLayout2>
      </Container>
      {paginate && (
        <TablePagination
          className={classes.tablePagination}
          component="div"
          count={totalCount || 0}
          rowsPerPage={input.limit}
          page={getPage()}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
          {...TablePaginationProps}
        />
      )}
      {!paginate && loadMore && (
        <Components.LoadMore
          className={classes.loadMore}
          count={count}
          totalCount={totalCount}
          loadMore={loadMore}
          networkStatus={networkStatus}
        />
      )}
    </React.Fragment>
  );
};

registerComponent('DatatableContents2', DatatableContents2);

/*

DatatableHeader2 Component

*/
const DatatableHeader2 = (
  { collection, intlNamespace, column, classes, toggleSort, currentSort },
  { intl }
) => {
  const columnName = typeof column === 'string' ? column : column.name || column.label;
  let formattedLabel = '';

  if (column.label) {
    formattedLabel = column.label;
  } else if (collection) {
    const schema = collection.simpleSchema()._schema;
    /*
    use either:

    1. the column name translation
    2. the column name label in the schema (if the column name matches a schema field)
    3. the raw column name.
    */
    const defaultMessage = schema[columnName]
      ? schema[columnName].label
      : Utils.camelToSpaces(columnName);
    formattedLabel =
      (typeof columnName === 'string' &&
        intl.formatMessage({
          id: `${collection._name}.${columnName}`,
          defaultMessage: defaultMessage,
        })) ||
      defaultMessage;

    // if sortable is a string, use it as the name of the property to sort by. If it's just `true`, use
    // column.name
    const sortPropertyName = typeof column.sortable === 'string' ? column.sortable : column.name;

    if (column.sortable) {
      return (
        <Components.DatatableSorter2
          name={sortPropertyName}
          label={formattedLabel}
          toggleSort={toggleSort}
          currentSort={currentSort}
          sortable={column.sortable}
        />
      );
    }
  } else if (intlNamespace) {
    formattedLabel =
      (typeof columnName === 'string' &&
        intl.formatMessage({
          id: `${intlNamespace}.${columnName}`,
          defaultMessage: columnName,
        })) ||
      columnName;
  } else {
    formattedLabel = intl.formatMessage({ id: columnName, defaultMessage: columnName });
  }

  return (
    <TableCell classes={{ head: classNames(classes.tableHeadCell, column.headerClass) }}>
      {formattedLabel}
    </TableCell>
  );
};

DatatableHeader2.contextTypes = {
  intl: intlShape,
};

registerComponent('DatatableHeader2', DatatableHeader2);

/*

DatatableSorter2 Component

*/

const DatatableSorter2 = ({ name, label, toggleSort, currentSort, sortable }) => (
  <TableCell
    className="datatable-sorter"
    sortDirection={!currentSort[name] ? false : currentSort[name] === 1 ? 'asc' : 'desc'}>
    <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
      <TableSortLabel
        active={!currentSort[name] ? false : true}
        direction={currentSort[name] === 1 ? 'desc' : 'asc'}
        onClick={() => toggleSort(name)}>
        {label}
      </TableSortLabel>
    </Tooltip>
  </TableCell>
);

registerComponent('DatatableSorter2', DatatableSorter2);

/*

DatatableRow2 Component

*/
const DatatableRow2 = (
  {
    collection,
    columns,
    document,
    refetch,
    showEdit,
    editComponent,
    currentUser,
    rowClass,
    handleRowClick,
    Components,
    classes,
  },
  { intl }
) => {
  if (typeof rowClass === 'function') {
    rowClass = rowClass(document);
  }

  return (
    <TableRow
      className={classNames(
        'datatable-item',
        classes.tableRow,
        rowClass,
        handleRowClick && classes.clickRow
      )}
      onClick={handleRowClick && (event => handleRowClick(event, document))}
      hover
    >
      {_sortBy(columns, column => column.order).map((column, index) => (
        <Components.DatatableCell2
          key={index}
          column={column}
          document={document}
          currentUser={currentUser}
          classes={classes}
          Components={Components}
          collection={collection}
        />
      ))}

      {(showEdit || editComponent) && (
        <TableCell variant="head" className={classes.editCell}>
          {editComponent && instantiateComponent(editComponent, { collection, document, refetch })}
          {showEdit && (
            <Components.EditButton
              collection={collection}
              document={document}
              buttonClasses={{ button: classes.editButton }}
            />
          )}
        </TableCell>
      )}
    </TableRow>
  );
};

registerComponent('DatatableRow2', DatatableRow2);

DatatableRow2.contextTypes = {
  intl: intlShape,
};

/*

DatatableCell2 Component

*/
const DatatableCell2 = ({ column, document, currentUser, Components, collection, classes }) => {
  const Component =
    column.component || Components[column.componentName] || Components.DatatableDefaultCell2;

  const columnName = typeof column === 'string' ? column : column.name;
  const className =
    typeof columnName === 'string' ? `datatable-item-${columnName.toLowerCase()}` : '';
  const cellClass =
    typeof column.cellClass === 'function'
      ? column.cellClass({ column, document, currentUser })
      : typeof column.cellClass === 'string'
      ? column.cellClass
      : null;
  const cellStyle =
    typeof column.cellStyle === 'function'
      ? column.cellStyle({ column, document, currentUser })
      : typeof column.cellStyle === 'object'
      ? column.cellStyle
      : null;

  return (
    <TableCell variant={column.variant}
               className={classNames(classes.tableCell, cellClass, className)}
               style={cellStyle}
    >
      <Component column={column} document={document} currentUser={currentUser} Components={Components} collection={collection} />
    </TableCell>
  );
};

registerComponent('DatatableCell2', DatatableCell2);

/*

DatatableDefaultCell2 Component

*/
const DatatableDefaultCell2 = ({ column, document, Components, ...rest }) => (
  <Components.CardItemSwitcher value={document[column.name]} document={document} fieldName={column.name} Components={Components} {...column} {...rest} />
);

registerComponent('DatatableDefaultCell2', DatatableDefaultCell2);
