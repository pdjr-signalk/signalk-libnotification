"use strict;"

/**********************************************************************
 *
 */

module.exports = class Notification {

    constructor(app, id, options={}) {
        this.app = app;
        this.id = id;
        this.options = options;
    }

    static create(message, state="normal", method=[], extras={}) {
      return(Object.keys(extras).reduce((key, a) => { a[key] = extras[key]; return(a); }, { message : message, state: state, method: method }));
    }

    static match(pattern, app) {
      var retval = false;
      if (pattern) {
        var parts = pattern.split(/\:/);
        var value = app.getSelfPath(parts[0]);
        retval = (parts[1])?((value) && (value.state) && (value.state == parts[1])):(value);
      }
      return(retval);
    }
      
    issue(key, message, options={}) {
        if (!key.match(/^notifications\./)) key = "notifications." + key;
        var state = (options.state)?options.state:((this.options.state)?this.options.state:"normal");
        var method = (options.method)?options.method:((this.options.method)?this.options.method:[]);

        var delta = { "context": "vessels." + this.app.selfId, "updates": [ { "source": { "label": "self.notificationhandler" }, "values": [ { "path": key, "value": null } ] } ] };
        delta.updates[0].values[0].value = { "state": state, "message": message, "method": method, "timestamp": (new Date()).toISOString() };
        this.app.handleMessage(this.id, delta);
    }

    cancel(key) {
        if (!key.match(/^notifications\./)) key = "notifications." + key;
        var delta = { "context": "vessels." + this.app.selfId, "updates": [ { "source": { "label": "self.notificationhandler" }, "values": [
            { "path": key, "value": null },
            { "path": key, "value": { "state": "normal", "method": [], "message": "Setting notification to 'normal'", "timestamp": (new Date()).toISOString() } }
        ] } ] };
        this.app.handleMessage(this.id, delta);
    }

}
