#Angular-Ice
Angular-Ice is an open-source module that makes it incredibly easy to integrate WebRTC's video/audio chat into your angular apps.

````
<body ng-app="Main" icecomm apikey="YOUR_API_KEY">

  <icecomm-connect room="custom room"></icecomm-connect>
  <icecomm-local></icecomm-local>
  <icecomm-peer></icecomm-peer>

</body>
````

#Getting Started
The following script files needs to be inserted
````
  <script src="https://cdn.icecomm.io/icecomm.js" ></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js" ></script>
  <script src="./src/angular-ice.js"></script>
````
To connect to a room, you can either insert a custom directive element or attribute:
````
<icecomm-connect room="custom room"/ text="Connect to custom room">
````
Modify the 'room' attribute to connect to your specificed room. You can change the text of the button rendered by changing the 'text' attribute.
or
````
<button icecomm-connect ng-click="icecomm.connect('custom room')">
```
To determine where the bottom w