//<input ng-model="foo">
//https://docs.angularjs.org/guide/directive
/*

*/

angular.module('Icecomm',[])
.directive('icecomm', function() {
  return {
    restrict: 'AE',
    scope: {},
    bindToController: true,
    controller: function($attrs, $element) {
      var debugOptions = {debug: Boolean($attrs.debug) };
      var _this = this;
      this.comm = new Icecomm($attrs.apikey, debugOptions);
    },
    controllerAs: 'icecomm'
  }
})
.directive('icecommLocal', function($sce) {
  return {
    restrict: 'E',
    replace: true,
    require: '^icecomm',
    template: '<video ng-if="local" autoplay class="icecomm-local" ng-src={{local.stream}}></video>',
    link: function($scope, ele, atts, icecomm) {
      console.log('something');
      var comm = icecomm.comm;
      comm.on("local",function(peer){
        $scope.$apply(function () {
          peer.stream = $sce.trustAsResourceUrl(peer.stream);
          $scope.local = peer;
        });
      });
    }
  };
})
.directive('icecommPeer', function($sce) {
  return {
    restrict: 'E',
    require: '^icecomm',
    replace: true,
    template:
        '<video ng-repeat="peer in peers" class="icecomm-peer" autoplay ng-src="{{peer.stream}}"></video>',
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
    }
  };
})
.directive('icecommConnect', function() {
  return {
    restrict: 'E',
    require: '^icecomm',
    replace: true,
    scope: true,
    template: '<button ng-click="connect()">{{text}}</div>',
    link: function($scope, ele, atts, icecomm) {
      var comm = icecomm.comm;
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
        return connectOptions;
      }
    }
  };
})
.directive('icecommLeave', function() {
  return {
    restrict: 'E',
    require: '^icecomm',
    replace: true,
    template: '<button ng-if="local" ng-click="leave()">{{text}}</div>',
    link: function($scope, ele, atts, icecomm) {
      var comm = icecomm.comm;
      $scope.text = atts.text || "Disconnect";
      $scope.leave = function() {
        comm.leave();
        $scope.local = null;
      }
    }
  };
});
