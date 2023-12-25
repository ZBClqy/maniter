(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Maniter = factory());
})(this, (function () { 'use strict';

    var ManiterConfig;
    (function (ManiterConfig) {
        ManiterConfig["version"] = "1.0.0";
    })(ManiterConfig || (ManiterConfig = {}));

    const createHistoryEvent = (type) => {
        const origin = history[type];
        return function () {
            const res = origin.apply(this, arguments);
            const event = new Event(type);
            window.dispatchEvent(event);
            return res;
        };
    };

    let eventList = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover'];
    class Maniter {
        constructor(options) {
            this.data = Object.assign(this.initDef(), options);
            this.installManiter();
        }
        initDef() {
            window.history['pushState'] = createHistoryEvent('pushState');
            window.history['replaceState'] = createHistoryEvent('replaceState');
            return {
                sdkVersion: ManiterConfig.version,
                historyManiter: false,
                hashManiter: false,
                domManiter: false,
                jsError: false,
            };
        }
        setUserId(uuid) {
            this.data.uuid = uuid;
        }
        setExtra(extra) {
            this.data.extra = extra;
        }
        sendManiter(data) {
            this.reportManiter(data);
        }
        targetKeyReport() {
            eventList.forEach(ev => {
                window.addEventListener(ev, (event) => {
                    const target = event.target;
                    const targetKey = target.getAttribute('target-key');
                    if (targetKey) {
                        this.reportManiter({
                            event: ev,
                            targetKey
                        });
                    }
                });
            });
        }
        captureEvents(mouseEventList, targetKey, data) {
            mouseEventList.forEach(eventName => {
                window.addEventListener(eventName, (event) => {
                    console.log("监听到了");
                    this.reportManiter({
                        eventName,
                        targetKey,
                        data
                    });
                });
            });
        }
        installManiter() {
            if (this.data.historyManiter) {
                this.captureEvents(['popstate', 'pushState', 'replaceState'], 'history');
            }
            if (this.data.hashManiter) {
                this.captureEvents(['hashchange'], 'hash');
            }
            if (this.data.domManiter) {
                this.targetKeyReport();
            }
        }
        reportManiter(data) {
            const params = Object.assign(this.data, data, { time: new Date().getTime() });
            let header = {
                type: 'application/x-www-form-urlencoded',
            };
            let blob = new Blob([JSON.stringify(params)], header);
            navigator.sendBeacon(this.data.requestUrl, blob);
        }
    }

    return Maniter;

}));
