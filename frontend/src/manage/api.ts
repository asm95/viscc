
import axios from 'axios'

import AppM from '@/manage/app'


// axios instance
const apiHost = document.location.host.replace('8080', '8081')
const apiIns = axios.create({
    baseURL: `http://${apiHost}`,
})
const baseRoute = '/api'

interface APIResponse {
    ok: boolean;
    msg?: string;
    data: any;
}

type APICallback = (r: APIResponse) => void


export class UserA {
    prettyName = ''

    login(login: string, password: string, cb: APICallback){
        apiIns.post(`${baseRoute}/user/login`, {
            usr: login, pwd: password
        })
        .then((r) => {
            const d = r.data as APIResponse;
            if (d.ok == true){
                this.prettyName = 'Admin'
            }
            cb(d);
        });
    }

    pushChanges(cb: APICallback){
        // send configuration data to server
        apiIns.post(`${baseRoute}/user/info`, {
            action: 'save', data: AppM.conf,
            authToken: AppM.getAuthToken()
        })
        .then((r) => {
            const d = r.data as APIResponse;
            cb(d);
        })
        .catch((r) => {
            console.log(r);
            const res: APIResponse = {ok: false, data: undefined};
            cb(res);
        });
    }
}

export class TelemetryA {
    pushHistory (contentID: number, data: string[], cb: APICallback){
        apiIns.post(`${baseRoute}/dog/push`, {
            data: {cid: contentID, d: data},
            authToken: AppM.getAuthToken()
        }).then((r) => {
            const d = r.data as APIResponse;
            cb(d);
        });
    }
}