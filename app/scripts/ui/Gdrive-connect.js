'use strict';

var React = require('react/addons'),
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
      {'client_id': this.CLIENT_ID, 'scope': this.SCOPES, 'immediate': true},
      this.handleAuthResult);
  },

  handleAuthResult: function(authResult) {
    if (authResult && !authResult.error) {

      this.setState({
        connected: true,
        token: authResult.access_token
      });

      this.loadClient(this.loadFiles);

    } else {
      gapi.auth.authorize(
        {'client_id': this.CLIENT_ID, 'scope': this.SCOPES, 'immediate': false},
        this.handleAuthResult);
      this.setState({connected: false})
    }
  },

  handleButtonClick: function() {
    if(!this.state.connected) {
      this.checkAuth();
    }else{

    }
  },

  loadClient: function(callback) {
   gapi.client.load('drive', 'v2', callback);
  },

  retrievePageOfFiles: function(request, result, callback) {
    request.execute(function(resp) {
      result = result.concat(resp.items);
      var nextPageToken = resp.nextPageToken;
      if (nextPageToken) {
        request = gapi.client.drive.files.list({
          'pageToken': nextPageToken
        });
        retrievePageOfFiles(request, result, callback);
      } else {
        callback(result);
      }
    });
  },

  retrieveFiles: function(request, callback) {
    request.execute(function(resp) {
        callback(resp.items);
      });
  },

  loadFiles: function() {
    var initialRequest = gapi.client.drive.files.list();
    this.retrieveFiles(initialRequest, this.props.updateFiles);

  },

  render: function() {
    var cx = React.addons.classSet;
    var btnClasses = cx({
      'btn'           : true,
      'btn-success'   : !this.state.connected,
      'btn-warning'   : this.state.connected
    });

    return (
      <button
        className={btnClasses}
        onClick={this.handleButtonClick}>
        {this.state.connected ? 'Disconnect from ' : 'Connect to ' } Google Drive
      </button>
    );
  }
});


module.exports = GdriveConnect;
