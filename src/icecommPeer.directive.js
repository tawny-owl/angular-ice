(function() {
  'use strict';

  angular.module('icecomm.peer', [])
  .directive('icecommPeer', icecommPeer);

  function icecommPeer($sce) {
    return {
      restrict: 'E',
      require: '^icecomm',
      replace: false,
      template:
      '<video ng-repeat="peer in peers" class="icecomm-peer"' +
        'autoplay ng-src="{{peer.stream}}"></video>',
      link: function($scope, ele, atts, icecomm) {
        var comm = icecomm.comm;
        $scope.peers = [];
        comm.on("connected", function(peer){
          $scope.$apply(function () {
            peer.stream = $sce.trustAsResourceUrl(peer.stream);
            $scope.peers.push(peer);
          });
        });

        comm.on("disconnect", function(peer){
          // $scope.$apply(function () {
            $scope.peers.splice($scope.peers.indexOf(peer),1);
          // });
        });
      }
    };
  }
})();