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
  },

  componentDidMount: function() {
    this.checkAuth();
  },

  checkAuth: function() {
    gapi.auth.authorize(
      {'client_id': this.CLIENT_ID, 'scope': this.SCOPES, 'immediate': true},
      this.handleAuthResult);
  },

  disconnect: function() {
    var self = this;
    $.ajax({
      type: 'GET',
      url: 'https://accounts.google.com/o/oauth2/revoke?token=' +
         gapi.auth.getToken().access_token,
      async: false,
      contentType: 'application/json',
      dataType: 'jsonp',
      success: function(result) {
        self.updateFiles();
      },
      error: function(e) {
       console.error(e);
      }
    });
  },

  handleAuthResult: function(authResult) {
    if (authResult && !authResult.error) {

      this.loadClient(this.loadFiles);

    } else {
      gapi.auth.authorize(
        {'client_id': this.CLIENT_ID, 'scope': this.SCOPES, 'immediate': false},
        this.handleAuthResult);
    }
  },

  handleButtonClick: function() {
    this.setState({
      loading: true,
    });

    if(!this.state.connected) {
      this.checkAuth();
    }else{
      this.disconnect();
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
    this.retrieveFiles(initialRequest, this.updateFiles);

  },

  updateFiles: function(items) {
    if(items) {
      this.props.updateFiles(items);
      this.setState({
        loading: false,
        connected: true,
      });
    }else{
      this.props.updateFiles(null);
      this.setState({
        loading: false,
        connected: false,
      });
    }
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
        disabled={this.state.loading}
        onClick={this.handleButtonClick}>
        {this.state.connected ? 'Disconnect from ' : this.state.loading ? 'Connecting to' : 'Connect to ' } Google Drive
      </button>
    );
  }
});


module.exports = GdriveConnect;
