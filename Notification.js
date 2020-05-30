"use strict;"

module.exports = class Notification {

    constructor(handler, id, options={}) {
        this.handler = handler;
        this.id = id;
        this.options = options;
    }

    static issue(key, message, state, method) {
        state = (state)?state:((this.options.state)?this.options.state:"normal");
        method = (method?((Array.isArray(method))?method:[method]):this.options.method;
        var delta = { "context": "vessels." + this.id, "updates": [ { "source": { "label": "self.notificationhandler" }, "values": [ { "path": key, "value": null } ] } ] };
        delta.updates[0].values[0].value = { "state": state, "message": message, "method": method, "timestamp": (new Date()).toISOString() };
        this.handler(this.id, delta);
    }

    static cancel(key) {
        var delta = { "context": "vessels." + this.id, "updates": [ { "source": { "label": "self.notificationhandler" }, "values": [ { "path": key, "value": null } ] } ] };
        this.handler(this.id, delta);
    }

}
