"use strict;"

module.exports = class Notification {

    constructor(handler, id, options={}) {
        this.handler = handler;
        this.id = id;
        this.options = options;
    }

    issue(key, message, options={}) {
        var state = (this.options && this.options.state)?this.options.state:"normal";
        var method = (this.options && this.options.method)?this.options.method:[];

        state = (options.state)?options.state:state;
        method = (options.method)?options.method:method;
        
        var delta = { "context": "vessels." + this.id, "updates": [ { "source": { "label": "self.notificationhandler" }, "values": [ { "path": key, "value": null } ] } ] };
        delta.updates[0].values[0].value = { "state": state, "message": message, "method": method, "timestamp": (new Date()).toISOString() };
        this.handler(this.id, delta);
    }

    cancel(key) {
        var delta = { "context": "vessels." + this.id, "updates": [ { "source": { "label": "self.notificationhandler" }, "values": [ { "path": key, "value": null } ] } ] };
        this.handler(this.id, delta);
    }

}
