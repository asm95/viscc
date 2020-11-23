import os
from typing import Any
from datetime import datetime as dt, timedelta


from flask import request, jsonify

from common.flask import View
from common.util import unpack


class Response(object):
    ok: bool
    msg: str

    def __init__(self, ok: bool = True, msg: str = '', data: Any = None):
        self.ok = ok
        self.msg = msg
        self.data = data

    def as_dict(self,) -> dict:
        return dict(ok=self.ok, msg=self.msg)


def get_json_contents(schema: dict) -> Response:
    in_json = request.json
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
                parsed[k] = value
        except (Exception, ) as e:
            return Response(ok=False, msg='Failed to convert \'%s\' to \'%s\'. Reason: %s' % (
                k, v_type, str(e)
            ))

    return Response(ok=True, data=parsed)


class UserAPI(View):
    """
    Conventions:
        vw_* = view function - renders a response that contains a page that will be consumed by the client (HTML)
        crl_* = crawler function - delas with

    Views:
        all views are next to each other
        index view always is the last one
    """
    name = 'UserAPI'
    mount = '/api/user'

    def api_res(self, res: Response, cookies: dict = None):
        res = jsonify(res.as_dict())
        if cookies:
            for k, v in cookies.items():
                self.cookies.set(res, k, v)
        return res

    @View.route('/login', method='post')
    def vw_home(self,):
        in_data = get_json_contents(schema={
            'usr': dict(req=True, ), 'pwd': dict(req=True)
        })
        if not in_data.ok:
            return self.api_res(in_data)
        user, pwd = unpack(in_data.data, ('usr', 'pwd'))
        if user == 'admin' and pwd == '123':
            return self.api_res(Response(), cookies={'token': 'abc'})

        return self.api_res(Response(ok=False, msg='invalid user'))

    def __init__(self, ):
        self.cookies = View.Cookies(self)
