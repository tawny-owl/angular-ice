(function() {
  'use strict';

  angular.module('icecomm.connect', [])
  .directive('icecommConnect', icecommConnectDirective);

  function icecommConnectDirective() {
    return {
      restrict: 'E',
      require: '^icecomm',
      replace: true,
      scope: true,
      template: '<button ng-click="connect()">{{text}}</div>',
      link: function($scope, ele, atts, comm) {
        $scope.text = atts.text || "Connect";
        $scope.connect = function() {
          var connectOptions = createConnectOptions();
          comm.connect(atts.room, connectOptions);
        }
        function createConnectOptions() {
          var connectOptions = {};
          if (atts.video === 'false') {
            connectOptions.video = false;
          }
          if (atts.audio === 'false') {
            connectOptions.audio = false;
          }
          if (!atts.stream === 'false') {
            connectOptions.stream = false;
          }
          if (!atts.limit) {
            connectOptions.limit = atts.limit;
          }
          return connectOptions;
        }
      }
    };
  }
})();