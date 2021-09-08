# Farming

This work is devoted to God.

Experiment to create an app with similar capabilities like a Meteor app, with following differences:

* Usage of async/await everywhere (instead of Fibers partially on the server).
  This seems to increase interoperability between JavaScript code.
  Also async/await is implemented as part of V8 and other JavaScript engines.
* Usage of npm packages.
    * ws for the WebSocket server implementation.
    * express for the web server.
    * passport for the account system.
* Usage of create-react-app for the client part, which uses Webpack as the build system.
