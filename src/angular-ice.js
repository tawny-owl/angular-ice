//<input ng-model="foo">
//https://docs.angularjs.org/guide/directive
/*

*/

angular.module('Icecomm',[])
.directive('icecomm', function() {
  return {
    restrict: 'AE',
    scope: {

    },
    bindToController: true,
    controller: function($attrs) {
      this.comm = new Icecomm( $attrs.apikey );
    },
    controllerAs: 'icecomm'
  }
})
.directive('icecommLocal', function($sce) {
  return {
    restrict: 'E',
    replace: true,
    require: '^icecomm',
    template:
      '<div ng-if="!!local">'+
        '<video autoplay class="icecomm-local" ng-src={{local.stream}}></video>'+
      '</div>',
    link: function($scope, ele, atts, icecomm) {
      console.log('something');
      var comm = icecomm.comm;
      $scope.peers = [];
      comm.on("local",function(peer){
        $scope.$apply(function () {
          peer.stream = $sce.trustAsResourceUrl(peer.stream);
          $scope.local = peer;
        });
      });

      $scope.close = function(){
        comm.leave();
      };
      $scope.roomEvent = function(e,value){
        if(e.which !== 13) return;
        $scope.connect(room.value);
        room.value = "";
      };
      ele.find("button.close").bind("click",$scope.close);
      ele.on('$destroy', $scope.close);
    }
  };
})
.directive('icecommPeer', function($sce) {
  return {
    restrict: 'E',
    require: '^icecomm',
    replace: true,
    template: '<div>'+
      '<ul><li ng-repeat="peer in peers">'+
        '<video class="icecomm-peer" autoplay ng-src="{{peer.stream}}"></video>'+
      '</li></ul>'+
    '</div>',
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
        $scope.$apply(function () {
          $scope.peers.splice($scope.peers.indexOf(peer),1);
        });
      });

      $scope.close = function(){
        comm.leave();
      };

      ele.find("button.close").bind("click",$scope.close);
      ele.on('$destroy', $scope.close);
    }
  };
})
.directive('icecommConnect', function() {
  return {
    restrict: 'E',
    require: '^icecomm',
    replace: true,
    template: '<button ng-click="connect()">{{text}}</div>',
    link: function($scope, ele, atts, icecomm) {
      var comm = icecomm.comm;
      $scope.text = atts.text || "Connect";

      $scope.connect = function() {
        comm.connect(atts.room);
      }
    }
  };
});
