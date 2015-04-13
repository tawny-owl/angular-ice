angular.module('icecomm.local', [])
.directive('icecommLocal', icecommLocalDirective);


function icecommLocalDirective($sce) {
  return {
    restrict: 'E',
    replace: true,
    require: '^icecomm',
    template: '<video ng-if="local" autoplay class="icecomm-local" ng-src={{local.stream}}></video>',
    link: function($scope, ele, atts, icecomm) {
      var comm = icecomm.comm;
      comm.on("local",function(peer){
        $scope.$apply(function () {
          peer.stream = $sce.trustAsResourceUrl(peer.stream);
          $scope.local = peer;
        });
      });
    }
  };
}