/*!
 * f
 *
 *
 * @author
 * @version 1.0.5
 * Copyright 2018.  licensed.
 */
/// <reference path="angular.min.js" />
var formIsValid = false;
(function() {
  var url = "http://94.57.252.34:7777/gsbsc-web/services/jaxrs/";
  // var url = 'http://demoserver.tacme.net:15300/gsbsc-web/services/jaxrs/';
  var $api = function($http) {
    var _isAuthenticated = false;

    var _getUserLogin = function(username, password) {
      var form = new FormData();
      form.append("username", username);
      form.append("password", password);

      var config = {
        headers: {
          "content-type": "multipart/form-data",
          accept: "application/json",
          authorization: "pvk5p8jngniT+XHU5EgtiQ=="
        }
      };

      var wURL = url + "login";

      return $http.post(wURL, form, config).then(
        function(response) {
          if (response.data.success === "Y") {
            _isAuthenticated = true;
          }
          return response.data.success === "Y";
        },
        function(error) {
          return error.data;
        }
      );
    };

    var _getFilterationData = function() {
      var config = {
        headers: {
          "content-type": "multipart/form-data",
          accept: "application/json",
          authorization: "pvk5p8jngniT+XHU5EgtiQ=="
        }
      };

      var wURL = url + "dashboard/filter";

      return $http.post(wURL, "", config).then(
        function(response) {
          return response.data;
        },
        function(error) {
          return error.data;
        }
      );
    };

    var _getDashboardVisionData = function(form, dashboard) {
      var config = {
        headers: {
          "content-type": "multipart/form-data",
          accept: "application/json",
          authorization: "pvk5p8jngniT+XHU5EgtiQ=="
        }
      };

      var wURL = url + dashboard;
      console.log(wURL);
      return $http.post(wURL, form, config).then(
        function(response) {
          return response.data;
        },
        function(error) {
          return error.data;
        }
      );
    };

    return {
      getUserLogin: _getUserLogin,
      isAuthenticated: function() {
        return _isAuthenticated;
      },
      getFilterationData: _getFilterationData,
      getDashboardVisionData: _getDashboardVisionData
    };
  };

  var module = angular.module("MainModule");
  module.factory("$api", $api);
})();
