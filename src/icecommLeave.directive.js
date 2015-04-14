(function() {
  'use strict';

  angular.module('icecomm.leave', [])
  .directive('icecommLeave', icecommLeave);

  function icecommLeave() {
    return {
      restrict: 'E',
      require: '^icecomm',
      replace: true,
      template: '<button ng-if="local && hide" ng-click="leave()">' +
        '{{text}}</button>',
      link: function($scope, ele, atts, icecomm) {
        var comm = icecomm.comm;
        $scope.test = false;
        $scope.text = atts.text || "Disconnect";
        $scope.hide = atts.prestream === 'hide';
        $scope.leave = function() {
          comm.leave();
          $scope.local = null;
        }
      }
    };
  }
})();