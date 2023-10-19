"use strict;"

const { isObject } = require("lodash");

/**********************************************************************
 * Copyright 2022 Paul Reeve <preeve@pdjr.eu>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you
 * may not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

module.exports = class Notification {

  constructor(app, debug=false) {
    this.app = app;
    this.debug = debug;
  }

  makeNotification(path, value, options={}) {
    var notification = { ...value, ...options };
    notification.id = (notification.id) || crypto.randomUUID();
    notification.path = path;
    notification.data = { value: this.app.getSelfPath(path + ".value") };
    notification.actions = notification.actions || [];
    return(notification); 
  }

  getNotification(id) {
    if (this.debug) this.app.debug("getNotification(%s)...", id);

    const notifications = this.app.getSelfPath('notifications');
    return(_getNotification(notifications, id));
  }

  getNotifications(f=()=>true) {
    if (this.debug) this.app.debug("getNotifications(f)...");

    return(this._getNotifications(this.app.getSelfPath('notifications'), f));
  }

  _getNotifications(notifications, f) {
    if (this.debug) this.app.debug("_getNotification(%s,f)...", notifications);
    var retval = {};

    for (var i = 0; i < Object.keys(notifications).length; i++) {
      if ((notifications[i] !== null) && (typeof notifications[i] == 'object') && (!Array.isArray(notifications[i]))) {
        if ((notifications[i].value) && (notifications[i].value.path)) {
          if (f(notifications[i].value)) {
            retval[notifications[i].value.path] = notifications[i].value;
          }
        }
      } else {
        retval = { ...retval, ...this._getNotifications(notifications[i], f) };
      }
    }
    return(retval);
  }

}
