'use strict';

var React = require('react');

var GdriveFilesList = React.createClass({

  getInitialState: function() {
    return {
    };
  },
  selector : {
    listName: 'list__item'
  },

  deleteFile: function(e) {
    var $target = $(e.target).closest('.'+this.selector.listName);
    var file = this.props.files[$target.data('id')];
    if(confirm('Are you sure you want to delete ' + file.title + ' ?')){
      var xhr = new XMLHttpRequest();
      xhr.open("DELETE", "https://www.googleapis.com/drive/v2/files/" + file.id, true);
      xhr.setRequestHeader("Authorization", "Bearer " + this.props.token);
      xhr.onload = function (evt) {
        $target.fadeOut('fast');
      };
     xhr.send();
    }
  },


  render: function() {
    var files;
    if(this.props.files) {
      files = this.props.files.map(function(file, index){
        return(
        <li
          className={this.selector.listName}
          key={index}
          data-id={index}>
          <a
            href={file.alternateLink}
            target='_blank'>

            <img
              className='list__icon'
              src={file.iconLink}/>

            {file.title}

          </a>
          <button
            className='glyphicon glyphicon-trash list__delete-icon'
            type='button'
            onClick={this.deleteFile} >
          </button>
        </li>
      )}, this);
    }
    return (
      <ul className='list--file'>
      {files ? files : 'No files or Drive not connect (Click on the above button to connect Drive)'}
      </ul>
    );
  }
});


module.exports = GdriveFilesList;
