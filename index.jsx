/**
 * Created by vivekp on 22-06-2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import arrowUp from 'images/arrow_upward.svg';
import arrowDown from 'images/arrow_downward.svg';
// import HTML5Backend from 'react-dnd-html5-backend';
// import  {DragDropContext} from 'react-dnd';
// import Row from './RowWithDnd.jsx';
import './style.css';

const Styles = {
    tableHeaderRow: {
        borderBottom: '1px solid rgb(224, 224, 224)'
    },
    tableHeaderColumn: {
        fontWeight: 500,
        paddingLeft: '0',
        fontSize: '14px',
        padding: '11px 5px',
        height: '34px',
        textAlign: 'left',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        color: 'rgb(158, 158, 158)',
        position: 'relative',
        cursor: 'pointer',
        backgroundColor: 'inherit'
    },
    tableBodyRow: {
    // borderBottom: '1px solid rgb(224, 224, 224)'
        cursor: 'pointer'
    },
    tableBodyColumn: {
        paddingLeft: '0',
        padding: '11px 5px',
        textAlign: 'left',
        fontSize: '13px',
        whiteSpace: 'pre-wrap',
        textOverflow: 'ellipsis',
        backgroundColor: 'inherit',
        maxWidth: '300px'
    },
    arrowUp: {
        backgroundImage: `url(${arrowUp})`,
        backgroundPosition: 'right 20% center',
        color: '#000',
        backgroundRepeat: 'no-repeat'

    },
    arrowDown: {
        backgroundImage: `url(${arrowDown})`,
        backgroundPosition: 'right 20% center',
        color: '#000',
        backgroundRepeat: 'no-repeat'
    }
};

class TableComponent extends React.Component {
    constructor(props) {
        super(props);
        const tableHeaders = [];
        _.each(this.props.tableHeaders, header => {
            if (header.sortable) {
                tableHeaders.push({ key: header.key, order: '' });
            }
        });
        this.state = {
            tableHeaders
        };
        this.getHeaders = this.getHeaders.bind(this);
        this.getRows = this.getRows.bind(this);
        this.onSort = this.onSort.bind(this);
    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {
        if (this.props.tableHeaders !== nextProps.tableHeaders) {
            const tableHeaders = [];
            _.each(nextProps.tableHeaders, header => {
                if (header.sortable) {
                    tableHeaders.push({ key: header.key, order: '' });
                }
            });
            this.setState({ tableHeaders });
        }
    }
    onSort(key) {
        const headers = JSON.parse(JSON.stringify(this.state.tableHeaders));
        // const order = '';
        _.each(this.state.tableHeaders, (header, i) => {
            if (header && key === header.key) {
                if (headers[i].order === '') {
                    headers[i].order = 'asc';
                    this.props.sortBy(key, 'asc');
                    this.setState({ tableHeaders: headers });
                    return false;
                } else if (headers[i].order === 'asc') {
                    headers[i].order = 'desc';
                    this.props.sortBy(key, 'desc');
                    this.setState({ tableHeaders: headers });
                    return false;
                }

                headers[i].order = 'asc';
                this.props.sortBy(key, 'asc');
                this.setState({ tableHeaders: headers });
                return false;
            }
            return '';
        });
    }

    onRowSelection(rowNo) {
    // this.setState({selected:rowNo});
        if (typeof this.props.onRowSelection === 'function') {
            this.props.onRowSelection(rowNo);
        }
    }

    getRows(tableBodyRowStyle, tableBodyColumnStyle, dnd) {
        if (!dnd) {
            return _.map(this.props.tableData, (data, i) => (<div
              className="Table-row" style={tableBodyRowStyle}
              onClick={() => this.onRowSelection(i)}
            >
              {_.map(this.props.tableHeaders, header => {
                  const style = Object.assign({}, tableBodyColumnStyle, header.style);
                  return (<div
                    className="Table-row-item"
                    data-header={header.key}
                    style={style}
                  >{data[header.key]}</div>);
              })}
            </div>));
        }
        return '';
    // return _.map(this.state.tableData,(data,i)=>{
    //   <Row style={tableBodyRowStyle} onClick={()=>this.onRowSelection(i)}
    //        tableHeaders={this.props.tableHeaders}
    //        data={data}
    //        moveRow={this.moveRow}/>
    // })
    }

    getHeaders() {
        const tableHeaderColumnStyle = Object.assign({},
            Styles.tableHeaderColumn, this.props.tableHeaderColumnStyle);
        return _.map(this.props.tableHeaders, (header, i) => {
            let arrowCss = {};
            if (this.state.tableHeaders[i] && header.key === this.state.tableHeaders[i].key) {
                if (this.state.tableHeaders[i].order === 'asc') {
                    arrowCss = Styles.arrowUp;
                } else if (this.state.tableHeaders[i].order === 'desc') {
                    arrowCss = Styles.arrowDown;
                } else {
                    arrowCss = {};
                }
            }
            const className = `Table-row-item ${header.className}`;
            const style = Object.assign({}, tableHeaderColumnStyle, header.style, arrowCss);
            return (<div
              className={className} style={style} key={header.key}
              onClick={() => this.onSort(header.key)}
            >
              {header.key === 'image' ? (<span style={{ width: '60px' }}>{header.label}</span>) : header.label}</div>);
        });
    }

  // moveRow(id, afterId) {
  //   const rows = _.clone(this.state.tableData);
  //   const currentRow = _.filter(rows, function (r) { return r.id === id;})[0];
  //   const afterRow = _.filter(rows, function (r) { return r.id === afterId;})[0];
  //   const afterRow = _.filter(rows, function (r) { return r.id === afterId;})[0];
  //   const currentRowIndex = rows.indexOf(currentRow);
  //   const afterRowIndex = rows.indexOf(afterRow);
  //
  //   // remove the current row
  //   rows.splice(currentRowIndex, 1);
  //   // put it after
  //   rows.splice(afterRowIndex, 0, currentRow);
  //
  //   this.setState({tableData: rows});
  // }

    render() {
        const tableHeaderRowStyle = Object.assign({},
            Styles.tableHeaderRow, this.props.tableHeaderRowStyle);
        const tableBodyRowStyle = Object.assign({},
            Styles.tableBodyRow, this.props.tableBodyRowStyle);
        const tableBodyColumnStyle = Object.assign({},
            Styles.tableBodyColumn, this.props.tableBodyColumnStyle);
        return (
          <div className="Table">
            <div className="Table-row Table-header" style={tableHeaderRowStyle}>
              {this.getHeaders()}
            </div>
            {this.getRows(tableBodyRowStyle, tableBodyColumnStyle, this.props.dragAndDrop)}
          </div>);
    }
}

TableComponent.propTypes = {
    tableData: PropTypes.arrayOf(PropTypes.object),
    tableHeaders: PropTypes.arrayOf(PropTypes.object),
    dragAndDrop: PropTypes.bool,
    onRowSelection: PropTypes.func,
    tableHeaderRowStyle: PropTypes.shape(PropTypes.object),
    tableBodyRowStyle: PropTypes.shape(PropTypes.object),
    tableHeaderColumnStyle: PropTypes.shape(PropTypes.object),
    tableBodyColumnStyle: PropTypes.shape(PropTypes.object),
    sortBy: PropTypes.func

};

export default TableComponent;
