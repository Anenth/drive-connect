'use strict';

var React = require('react'),
config = require('../config');
// googleClientApi = require( 'google-client-api' );

var GdriveConnect = React.createClass({
  SCOPES: config.GOOGLE_API_SCOPES,
  CLIENT_ID: config.GOOGLE_CLIENT_ID,

  getInitialState: function() {
    return {
      connected: false
    };
  },

  componentWillMount: function() {
    var self = this;
    // require( 'google-client-api' )( function( gapi ) {
    //   debugger;

    //   function loadClient(callback) {
    //     gapi.client.load('drive', 'v2', callback);
    //   }
    //   function callback() {
    //     console.log(gapi);
    //     self.checkAuth()
    //   }
    //   loadClient(callback);
    // this.api = gapi;
    // });
  },

  componentDidMount: function() {
    // this.checkAuth();
  },

  componentWillUnmount: function() {
  },


  checkAuth: function() {
    gapi.auth.authorize(
        {'client_id': this.CLIENT_ID, 'scope': this.SCOPES, 'immediate': false},
        this.handleAuthResult);
  },

  handleAuthResult: function(authResult) {
    if (authResult && !authResult.error) {
      this.setState({
        connected: true,
        token: authResult.access_token
      });

      this.loadFiles();

    } else {
      this.setState({connected: false})
    }
  },

  handleButtonClick: function() {
    if(!this.state.connected) {
      this.checkAuth();
    }else{

    }
  },

  loadFiles: function() {
    // $.getJSON('https://www.googleapis.com/drive/v2/files', function(data){
    //   console.log(data);
    // })

    var xhr = new XMLHttpRequest(),
    self = this;
    xhr.open("GET", "https://www.googleapis.com/drive/v2/files", true);
    xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
    xhr.onload = function (evt) {
      var response = JSON.parse(xhr.responseText);
      self.props.updateFiles(response.items, self.state.token);
   };
   xhr.send();

  },

  render: function() {
    return (
      <button
        className='btn btn-default'
        onClick={this.handleButtonClick}>
        {this.state.connected ? 'Disconnect from ' : 'Connect to ' } Google Drive
      </button>
    );
  }
});


module.exports = GdriveConnect;
