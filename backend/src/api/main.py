from typing import Any
from datetime import datetime as dt, timedelta


from flask import request, jsonify

from common.flask import View
from common.util import unpack
from models.user import (
    UserSettings, usr_get_from_creds, usr_bake_token, usr_check_token, usr_unpack_prefs, usr_save_prefs
)


class Response(object):
    ok: bool
    msg: str

    def __init__(self, ok: bool = True, msg: str = '', data: Any = None):
        self.ok = ok
        self.msg = msg
        self.data = data

    def as_dict(self,) -> dict:
        out_data = self.data if isinstance(self.data, dict) else {}
        return dict(ok=self.ok, msg=self.msg, data=out_data)


def get_json_contents(schema: dict) -> Response:
    in_json = request.json or dict()
    parsed = dict()
    if in_json is None and schema:
        return Response(ok=False, msg='empty request')

    for k, spec in schema.items():
        value = in_json.get(k, spec.get('dv', None))
        if value is None and spec.get('req', False):
            return Response(ok=False, msg='expected key \'%s\'' % k)
        v_type = spec.get('t', 'str')
        try:
            if v_type == 'int':
                parsed[k] = int(value)
            elif v_type == 'float':
                parsed[k] = float(value)
            else:
                parsed[k] = str(value)
        except (Exception, ) as e:
            return Response(ok=False, msg='Failed to convert \'%s\' to \'%s\'. Reason: %s' % (
                k, v_type, str(e)
            ))

    return Response(ok=True, data=parsed)


def require_login(f):
    def wrap(*args, **kwargs):
        self = args[0]  # type: ApiView
        in_json = request.json or dict()
        auth_token = in_json.pop('authToken', '')
        token_data = usr_check_token(auth_token)
        kwargs['token_data'] = token_data
        if not token_data:
            return self.api_res(Response(ok=False, msg='invalid auth-token'))
        return f(*args, **kwargs)
    return wrap


class G(object):
    usr_default_settings: str = UserSettings.default()


class ApiView(View):
    @staticmethod
    def api_res(res: Response):
        res = jsonify(res.as_dict())
        return res


class UserAPI(ApiView):
    """
    Conventions:
        vw_* = view function - renders a response that contains a page that will be consumed by the client (HTML)
        rt_* = api route - renders JSON response

    Views:
        all views are next to each other
        index view always is the last one
    """
    name = 'UserAPI'
    mount = '/api/user'

    @View.route('/info', method='post')
    @require_login
    def rt_info(self, token_data: dict):
        new_prefs = request.json.get('data')
        user_id = int(token_data.get('uid', '-1'))
        # for now, just believe in what the client is saying
        if not new_prefs:
            return self.api_res(Response(ok=False, msg='invalid preferences'))
        if user_id < 0:
            return self.api_res(Response(ok=False, msg='invalid user ID'))
        if not usr_save_prefs(user_id, new_prefs):
            return self.api_res(Response(ok=False, msg='failed to save preferences'))
        return self.api_res(Response())

    @View.route('/login', method='post')
    def vw_home(self,):
        in_data = get_json_contents(schema={
            'usr': dict(req=True, t='str'), 'pwd': dict(req=True, t='str')
        })
        if not in_data.ok:
            return self.api_res(in_data)
        user, pwd = unpack(in_data.data, ('usr', 'pwd'))
        usr_info = usr_get_from_creds(user, pwd)
        if usr_info:
            res = Response(data={
                'auth_token': usr_bake_token(usr_info),
                'prefs': usr_unpack_prefs(usr_info)
            })
            return self.api_res(res)

        return self.api_res(Response(ok=False, msg='invalid user'))

    def __init__(self, ):
        self.cookies = View.Cookies(self)
