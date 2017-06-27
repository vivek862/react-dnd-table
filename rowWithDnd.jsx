/**
 * Created by vivekp on 22-06-2017.
 */
/* eslint-disable */
import React from 'react';
import _ from 'lodash';
import { DragSource, DropTarget } from 'react-dnd';

const Types = {
    ROW: 'row'
};

const rowSource = {
    beginDrag(props) {
        return { id: props.id };
    }
};

const rowTarget = {
    hover(props, monitor) {
        const draggedId = monitor.getItem().id;

        if (draggedId !== props.id) {
            props.moveRow(draggedId, props.id);
        }
    }
};

const sourceCollect = function (connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
};

const targetCollect = function (connect) {
    return {
        connectDropTarget: connect.dropTarget()
    };
};

const RowWithDnd = props => {
    const opacity = this.props.isDragging ? 0 : 1;
    const connectDragSource = this.props.connectDragSource;
    const connectDropTarget = this.props.connectDropTarget;
    return (
      connectDragSource(connectDropTarget(
        <div className="Table-row" style={this.props.tableBodyRowStyle} onClick={this.props.onClick}>
          {_.map(props.tableHeaders, header => {
              const style = Object.assign({}, this.props.tableBodyColumnStyle, header.style);
              return (<div
                className="Table-row-item"
                data-header={header.key}
                style={style}
              >{this.props.data[header.key]}</div>);
          })}
        </div>
      ))
    );
};

const source = DragSource(Types.ROW, rowSource, sourceCollect)(RowWithDnd);
const row = DropTarget(Types.ROW, rowTarget, targetCollect)(source);

export default row;
