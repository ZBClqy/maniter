import { DefaultOptions,ManiterConfig,Options } from '../types/index'
import { createHistoryEvent } from '../utils/pv'
 
let eventList:string[]=['click','dblclick','contextmenu','mousedown','mouseup','mouseenter','mouseout','mouseover']
export default class Maniter {
    public data:Options;
    constructor(options:Options){
        this.data = Object.assign(this.initDef(),options);
        this.installManiter()
    }

    private initDef ():DefaultOptions {
        window.history['pushState']=createHistoryEvent('pushState');
        window.history['replaceState']=createHistoryEvent('replaceState');
        return <DefaultOptions>{
            sdkVersion:ManiterConfig.version,
            historyManiter:false,
            hashManiter:false,
            domManiter:false,
            jsError:false,
        }
    }

    public setUserId <T extends DefaultOptions['uuid']>(uuid:T){
        this.data.uuid = uuid
    }

    public setExtra <T extends DefaultOptions['extra']>(extra:T){
        this.data.extra = extra
    }

    public sendManiter<T>(data:T){
        this.reportManiter(data)
    }

    private targetKeyReport() {
        eventList.forEach(ev => {
            window.addEventListener(ev, (event) => {
                const target = event.target as HTMLElement
                const targetKey = target.getAttribute('target-key')
                if(targetKey){
                    this.reportManiter({
                        event:ev,
                        targetKey
                    })
                }
            })
        })
    }

    private captureEvents <T>(mouseEventList:string[],targetKey:string,data?:T){
        mouseEventList.forEach(eventName=>{
            window.addEventListener(eventName,(event)=>{
                console.log("监听到了")
                this.reportManiter({
                    eventName,
                    targetKey,
                    data
                })
            })
        })
    }

    private installManiter (){
        if(this.data.historyManiter){
            this.captureEvents(['popstate','pushState','replaceState'],'history');
        }
        if(this.data.hashManiter){
            this.captureEvents(['hashchange'],'hash')
        }
        if(this.data.domManiter){
            this.targetKeyReport()
        }
        if(this.data.jsError){
            this.jsError()
        }
    }

    private jsError(){
        this.errorEvent()
        this.promiseReject()
    }

    private errorEvent(){
        window.addEventListener('error',(event)=>{
            this.reportManiter({
                event:'error',
                targetKey:'message',
                message:event.message,
            })
        })
    }

    private promiseReject (){
        window.addEventListener('unhandledrejection',(event)=>{
            event.promise.catch(error=>{
                this.reportManiter({
                    event:'promise',
                    targetKey:'message',
                    message:error
                })
            })
        })
    }

    private reportManiter<T>(data:T){
        const params = Object.assign(this.data,data,{ time:new Date().getTime() })
        let header = {
            type:'application/x-www-form-urlencoded',
        };
        let blob = new Blob([JSON.stringify(params)],header);
        navigator.sendBeacon(this.data.requestUrl,blob)
    }
}