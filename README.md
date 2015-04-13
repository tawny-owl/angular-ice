#Angular-Ice
Angular-Ice is an open-source module that makes it incredibly easy to integrate WebRTC's video/audio chat into your angular apps.

#Example
Here is a fully-function multi-person conference application build with Angular-Ice
````
<body ng-app="Main" icecomm apikey="YOUR_API_KEY">
  <icecomm-connect room="custom room"></icecomm-connect>
  <icecomm-local></icecomm-local>
  <icecomm-peer></icecomm-peer>
  <icecomm-leave></icecomm-leave>
</body>
````
The full code can be seen in the examples folder.
#Getting Started
The following script files needs to be inserted in this order
````
  <script src="https://cdn.icecomm.io/icecomm.js" ></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js" ></script>
  <script src="https://cdn.icecomm.io/angular-ice/angular-ice.min.js"></script>
````
The following directive needs to be inserted into the body element
````
<body ng-app="myAPP" icecomm apikey="YOUR_API_KEY>
````
If you do not yet have an Icecomm API Key, you can get one on [icecomm.io](http://icecomm.io/signup).
#TL;DR
There are four customizable directives.
````
  <icecomm-connect></icecomm-connect>
  <icecomm-local></icecomm-local/>
  <icecomm-peer></icecomm-peer>
  <icecomm-leave></icecomm-leave>
````

* icecomm-connect inserts a button, when clicked, connects a user to a room where they can share media among the other peers in the room
* icecomm-local provides the location for where to load your local video when icecomm-connect is clicked
* icecomm-peer provides the location for where to load remote peers when connected
* icecomm-leave inserts a button that leaves a user from a room
#How do I connect to a room?
To connect to a room, insert this custom directive into your html
````
<icecomm-connect room="custom room" text="Connect to custom room" limit="2">
````
Modify the 'room' attribute to connect to your specificed room. You can change the text of the button rendered by changing the 'text' attribute. You can limit the number of people in the room by setting the limit attribute.
#Where does my local video appear
Your video will appear where the icecomm-local directive is located
````
<icecomm-local></icecomm-local>
````
#Where do remote peers appear?
Remote peers appear where the icecomm-peer directive is located.
````
<icecomm-peer></icecomm-peer>
````
#How do I leave a room?
To leave the room and remove all videos, the client needs to leave the room. A custom directive has been made which renders a button that provides clients a method to leave their current room.
````
<icecomm-leave></icecomm-leave>
````
Custom attributes can be added to the icecomm-leave directive. A user can specify the text to shown in the button.
````
<icecomm-leave text="Leave"></icecomm-leave>
````
If the user wants the directive to only appear once local stream has rendered, the prestream attribute can be set to 'hide' as shown below.
````
<icecomm-leave prestream="hide"></icecomm-leave>
````