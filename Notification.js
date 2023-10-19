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

  getNotifications(f) {
    if (this.debug) this.app.debug("getNotifications(f)...");
    var matches = {};

    this._getNotifications(this.app.getSelfPath('notifications'), matches, f);
    return(matches);
  }

  _getNotifications(notifications, matches, f) {
    if (this.debug) this.app.debug("_getNotification(_,_,_)...");
    var retval = {};

    for (var key in notifications) {
      if ((notifications[key] !== null) && (typeof notifications[key] == 'object') && (!Array.isArray(notifications[key]))) {
        if ((notifications[key].value) && (notifications[key].path)) {
          if ((!f) || (f(notifications[key]))) {
            matches[notifications[key].path] = notifications[key];
          }
        } else {
          this._getNotifications(notifications[key], f, matches);
        }
      }
    }

    return(retval);
  }

}
