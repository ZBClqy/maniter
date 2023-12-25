export interface DefaultOptions {
    uuid: string | undefined,//用来标识访问用户的id
    requestUrl: string | undefined,//用来标识向后端发起提交请求的url
    historyManiter:boolean,//用于表示当前是否为history模式
    hashManiter:boolean,//用于表示当前是否为hash模式
    domManiter:boolean,//用于表示是否开启dom监视
    sdkVersion:string|number,//当前sdk版本
    extra:Record<string,any>|undefined,//用户配置的额外参数
    jsError:boolean,//是否开启js或者promise报错监控
}

export interface Options extends DefaultOptions{
    requestUrl:string,//用来标识向后端发起提交请求的url
}

export enum ManiterConfig {
    version='1.0.0'
}