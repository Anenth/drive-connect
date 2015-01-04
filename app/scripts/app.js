'use strict';

var React = window.React = require('react'),
mountNode = document.getElementById('app'),
ConnectButton = require('./ui/Gdrive-connect'),
FilesList = require('./ui/Gdrive-filelist');

var GdriveApp = React.createClass({
  getInitialState: function() {
    return { files: null};
  },

  updateFiles: function(files){
    this.setState({
      files: files
    });
  },

  render: function() {
    return(
      <div>

        <div className='text-center'>
          <ConnectButton
            updateFiles={this.updateFiles}/>
        </div>

        <FilesList
          files={this.state.files}/>

      </div>
    );
  }
});


React.render(<GdriveApp />, mountNode);

