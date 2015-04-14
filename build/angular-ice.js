(function() {
  'use strict';

  angular.module('Icecomm',[
  'icecomm.controller',
  'icecomm.connect',
  'icecomm.local',
  'icecomm.peer',
  'icecomm.leave'
  ]);
})();
(function() {
  'use strict';

  angular.module('icecomm.controller', [])
  .directive('icecomm', icecomm);

  function icecomm() {
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
})();
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
(function() {
  'use strict';

  angular.module('icecomm.local', [])
  .directive('icecommLocal', icecommLocal);

  function icecommLocal($sce) {
    return {
      restrict: 'E',
      replace: true,
      require: '^icecomm',
      template: '<video ng-if="local" autoplay class="icecomm-local"' +
        'ng-src={{local.stream}}></video>',
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
})();
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