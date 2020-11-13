interface ContextSettings {
    userID: number;
    contentID: number;
}

type onResponseCallback = () => void;

interface RequestOptions {
    onSuccess: onResponseCallback | undefined;
    onFailure: onResponseCallback | undefined;
}

interface RemoteSettings {
    paths: Map<string, string>;
    scheme: 'http' | 'https';
    domain: string;
}

class Backend {
    sendEnabled = false;
    remoteOpts: RemoteSettings;

    bundleRoute(routeID: string): string | undefined{
        const ro = this.remoteOpts;
        const urlRoute = ro.paths.get(routeID);
        // route not found
        if (! urlRoute){return undefined;}
        return (ro.scheme + '://' + ro.domain + urlRoute);
    }

    sendJson(routeID: string, data: Record<string, any>, opts: RequestOptions | undefined){
        if (! this.sendEnabled){return;}
        const xhr = new XMLHttpRequest();
        const destURL = this.bundleRoute(routeID);
        // do not send anything if the url could not be bundled
        if (! destURL){return;}
        xhr.open('POST', destURL);
        xhr.onreadystatechange = () => {
            // will tell us if the request was successful
            if (xhr.readyState === XMLHttpRequest.DONE){
                const okRequest = (xhr.status === 200);
                if (!opts){return;}
                if (typeof opts.onSuccess == "function"){opts.onSuccess();}
                if (typeof opts.onFailure == "function"){opts.onFailure();}
            }
        }
        // setup our json header
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send(JSON.stringify(data));
    }

    constructor(){
        this.remoteOpts = {
            paths: new Map<string, string>(),
            scheme: 'http', domain: 'localhost'
        };
        this.remoteOpts.paths.set('logRoute', '/api/test');
    }
}

export default class ComponentTelemetry {

    wasSent = false;
    doSendRemote = false;
    commandHistory: string[];
    contextSettings: ContextSettings;
    backend: Backend;

    pushHistory(cmdHistory: string[]){
        // data packet
        // t is the payload id; t = 0 is a command history
        // c is the content itself
        const cs = this.contextSettings;
        const payload = {
            uid: cs.userID, id: cs.contentID, t: 0, c: cmdHistory
         };
         
    }

    logCommand(cmd: string){
        // will log a command (e.g. "r1")
        // reset and undo are also commands:
        // . reset = 'rr'; undo = 'u'
        // . start simulation = 's'; .end simulation ='e'
        // . any invalid command begins with '<'
        if (! this.doSendRemote){return;}
        // otherwise we just keep pushing data
        this.commandHistory.push(cmd);
        // for now we hust have HTTP backended log interface, so we
        // . just send log when a simulation ends
        if (cmd == 'e'){
            // attempt to send remote data
            if (this.wasSent == true){
                // last payload was successfully sent
                this.commandHistory = [];
                this.wasSent = false;
            }
            this.pushHistory(this.commandHistory);
        }
    }

    constructor(){
        this.contextSettings = {userID: 0, contentID: 0};
        this.commandHistory = [];
        this.backend = new Backend();
    }
}