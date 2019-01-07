/**
 * Created by isaac on 16/7/18.
 */
import React from 'react';

export default function (editAction, deleteAction) {
  return [
    {
      field: '$index', name: 'Index', width: 50
    },
    {
      field: 'id', name: 'ID', width: 200
    },
    {
      field: 'name', name: 'Name', width: 150
    },
    {
      field: 'version', name: 'Version', width: 200
    },
    {
      name: 'Operation',
      width: 166,
      display: (model) => {
        return (<div>
          <button className="ui primary button" onClick={editAction.bind(null, model)} >Edit</button>
          <button className="ui orange button" onClick={deleteAction.bind(null, model)} >Delete</button>
        </div>);
      }
    }
  ];
}
