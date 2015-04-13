//<input ng-model="foo">
//https://docs.angularjs.org/guide/directive
/*

*/

angular.module('Icecomm',[])
.directive('icecomm', icecommDirective)
.directive('icecommLocal', icecommLocalDirective)
.directive('icecommPeer', icecommPeerDirective)
.directive('icecommConnect', icecommConnectDirective)
.directive('icecommLeave', icecommLeaveDirective);

function icecommDirective() {
  return {
    restrict: 'AE',
    scope: {},
    bindToController: true,
    controller: function($attrs, $element) {
      var debugOptions = {debug: Boolean($attrs.debug)};
      var comm = new Icecomm($attrs.apikey, debugOptions);
      this.comm = comm;
      this.connect = comm.connect;
    },
    controllerAs: 'comm'
  }
}

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

function icecommPeerDirective($sce) {
  return {
    restrict: 'E',
    require: '^icecomm',
    replace: false,
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
}

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

function icecommLeaveDirective() {
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
}