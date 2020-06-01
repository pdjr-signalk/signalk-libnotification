"use strict;"

module.exports = class Notification {

    constructor(app, id, options={}) {
        this.app = app;
        this.id = id;
        this.options = options;
    }

    issue(key, message, options={}) {
        var state = (options.state)?options.state:((this.options.state)?this.options.state:"normal");
        var method = (options.method)?options.method:((this.options.method)?this.options.method:[]);

        var delta = { "context": "vessels." + this.app.selfId, "updates": [ { "source": { "label": "self.notificationhandler" }, "values": [ { "path": key, "value": null } ] } ] };
        delta.updates[0].values[0].value = { "state": state, "message": message, "method": method, "timestamp": (new Date()).toISOString() };
        this.app.handleMessage(this.id, delta);
    }

    cancel(key) {
        var delta = { "context": "vessels." + this.app.selfId, "updates": [ { "source": { "label": "self.notificationhandler" }, "values": [ { "path": key, "value": null } ] } ] };
        this.app.handleMessage(this.id, delta);
    }

}
