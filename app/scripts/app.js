'use strict';

var React = window.React = require('react'),
mountNode = document.getElementById('app'),
ConnectButton = require('./ui/Gdrive-connect'),
FilesList = require('./ui/Gdrive-filelist');

var GdriveApp = React.createClass({
  getInitialState: function() {
    return { files: null};
  },

  updateFiles: function(files, token){
    this.setState({
      files: files,
      token: token
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
          files={this.state.files}
          token={this.state.token}/>

      </div>
    );
  }
});


React.render(<GdriveApp />, mountNode);

