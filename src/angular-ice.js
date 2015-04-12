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
    controller: function($attrs) {
      var debugOptions = Boolean($attrs.debug);
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
        console.log(connectOptions);
        comm.connect(atts.room, connectOptions);
      }
      function createConnectOptions() {
        var connectOptions = {};
        console.log(atts.audio);
        console.log(typeof atts.audio);
        if (atts.video === 'false') {
          connectOptions.video = false;
        }
        if (atts.audio === 'false') {
          console.log('entered');
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
    // scope: true,
    template: '<button ng-click="leave()">{{text}}</div>',
    link: function($scope, ele, atts, icecomm) {
      var comm = icecomm.comm;
      $scope.text = atts.text || "Disconnect";

      $scope.leave = function() {
        ele.remove("video.icecomm-local");
        // ele.remove("video.icecomm-peer");
        comm.leave();
      }
    }
  };
});
