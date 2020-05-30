# signalk-libnotification
Notification library for use by Signal K node server plugins.
```
const Notification = require("./signalk-libnotification/Notification.js");

const notification = new Notification(app.handleMessage, plugin.id, { "state": "alert", "method": [ "sound" ] });

var notificationPath = "notifications.mydummy";
var notificationMessage = "Just a dummy notification";

notification.issue(notificationPath, notificationMessage);
notification.cancel(notificationPath);
```

__Notification(*appHandler*, *pluginId* [, *options* ])__
Returns a Notification object configured for the local context.

*appHandler* is a reference to the local application message handler (usually ```app.handleMessage```).

*pluginId* is an identifier used by *messageHandler* to decorate issued notifications in a way that shows the originating application (usually ```plugin.id```).

*options* is a structure which can be used to pass default values for the 'state' and 'method' fields of generated notifications.
If this is not supplied, the default values 'normal' and [] are used.
Any values supplied here can be overridden each time a new notification is issued.

__issue(*path* [, *message*] [, *options*])__
Writes a notification decorated with *message* into the specified Signal K *path*.
