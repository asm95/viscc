import os
from functools import partial
from typing import Union

from flask import (
    Flask, request, abort, render_template, url_for, send_from_directory
)
from flask.wrappers import Response

from common.dotenv import DotEnv
from common.util import DictObject
from common.config import ConfigRequirements, Config
from common.globals import AppGlobals, G_ENV
from models.main import DBManager

__version__ = '0.0.3'


class View(object):
    id = ''  # type: str
    name = ''  # type: str
    tmpl_path = ''  # type: str
    version = ''  # type: str
    mount = ''  # type: str

    class Cookies(object):
        def get(self, key: str, dv=None):
            return request.cookies.get('%s:%s' % (self.vw.id, key), dv)

        def set(self, resp: Response, key: str, val):
            resp.set_cookie('%s:%s' % (self.vw.id, key), str(val))
            return val

        def __init__(self, vw: 'View'):
            self.vw = vw

    def get_user(self, uid: str):
        """
        Stub of getting a logged user

        Will always return false until it's implemented to return something.
        A typical solution is to search in a database for the user's existence
        :param uid:
        :return: a user or None if not exists
        """
        return None

    @classmethod
    def route(cls, path: str, method: str = None, methods: list = None):
        """
        Defines a route that will be available in the website
        :param path: route string
        :param method: what HTTP method it accept (only one can be provided)
        :param methods: a list of HTTP methods that the route accepts
        :return: route function that can be appended to flask.app
        """
        methods = methods or ['get']
        if isinstance(method, str):
            methods = [method]
        methods = [x.upper() for x in methods]

        def decorator(f):
            def wrapper(*args, **kwargs):
                if request.method not in methods:
                    abort(404)
                return f(*args, **kwargs)

            wrapper.name = f.__name__
            wrapper.route = path
            wrapper.methods = methods
            return staticmethod(wrapper)

        return decorator

    def render_template(self, name_or_list, **context):
        """
        renders the template considering the 'mount' string

        If the View is mounted at /app, then calls to this function will assume the jinja2 template file will be stored
        at $TEMPLATES_FOLDER/app/<path_to_template>

        :param name_or_list: template name or list with fallback alternatives
        :param context: variables that the template will render
        :return: rendered template HTTP response (regular string)
        """
        context['featured_section'] = dict(
            name=self.name,
            route=self.url_for(self.vw_home) if hasattr(self, 'vw_home') else None,
            version=self.version
        )
        # will use the `mount` property as the template path if `tmpl_path` is not specified
        base_path = (self.tmpl_path and '/' + self.tmpl_path) or self.mount
        template_path = '/'.join([base_path, name_or_list]) if self.mount is not '' else name_or_list
        return render_template(template_path, **context)

    def url_for(self, view_func, **params) -> str:
        """
        acts like Flask.url_for but always prepend the 'mount' on the generated path

        generate the string that flask.url_for will be able to find the function and thus, generate the correct endpoint
        with filled placeholders
        :param view_func: function to get the route
        :param params: params that the view needs in the path string
        :return: generated url for the view function
        """
        endpoint = self.__class__.__name__ + '.' + view_func.name
        return url_for(endpoint, **params)

    def get_views(self) -> list:
        """
        Get a list of views from a View class

        This is necessary to be able to register with Flask.app. Calls to this functions will only work after the class
        has been instantiated. This is because some classes might ask for some custom initialization that can only
        be performed by the user, and not flaskworks itself.
        :return: a list
        """
        route_list = list()
        for item_name in dir(self):
            if '__' in item_name or item_name in ('db',):
                continue
            item = getattr(self, item_name)
            if callable(item) and hasattr(item, 'route'):
                item.route = self.mount + item.route  # mount string only will available after the class has been
                # created
                # some functions wouldn't like to be bounded to the view's class
                f = partial(item, self) if not hasattr(item, 'unbound') else partial(item)
                # useful with Flask.url_for
                # we use item_name instead of function name to avoid injections name collision
                # the injections create new views on the class without being necessary to be explicit in code
                f.endpoint = self.__class__.__name__ + '.' + item_name
                route_list.append(f)
        return route_list

    @classmethod
    def require_login(cls, ):
        """
        Decorator that verifies if a user is logged-in
        :return:
        """

        def decorator(f):
            def wrapper(*args, **kwargs):
                self = args[0]
                usr_obj = self.get_user(self.cookies.get('uid'))
                if usr_obj is None:
                    vw_func = getattr(self, f.__name__)
                    return self.vw_login(self, redirect=cls.url_for(self, vw_func)) if \
                        hasattr(self, 'vw_login') else abort(404)
                return f(*args, **kwargs)

            # View.route uses the function name's being wrapped
            # if __name__ is not assigned, url_for would return <ViewClassName>.wrapper instead of the function (f) name
            wrapper.__name__ = f.__name__
            return wrapper

        return decorator


class PrefixMiddleware(object):
    """
    If you have an application that needs to be behind a specific path then this WSGI add-in is perfect.

    An usual example is when you have an app that needs to be hosted at www.example.com/myapp. We consider the prefix to
    be '/myapp'. When you add this mix-in class, all paths of your flask application will be "moved" under this prefix.
    No additional configuration is needed. Be aware to use flask.url_for or flaskworks.View.url_for to generate all URLs
    on the client, otherwise, things won't work.
    """

    def __init__(self, app, prefix=''):
        self.app = app
        self.prefix = prefix

    def __call__(self, environ, start_response):

        if environ['PATH_INFO'].startswith(self.prefix):
            environ['PATH_INFO'] = environ['PATH_INFO'][len(self.prefix):]
            environ['SCRIPT_NAME'] = self.prefix
            return self.app(environ, start_response)
        else:
            start_response('404', [('Content-Type', 'text/plain')])
            return ["This url does not belong to the app.".encode()]


def load_config(env_path_or_kv: Union[str, dict]) -> Config:
    req_types = ConfigRequirements.Type
    wants = ConfigRequirements.Require
    kv_env = DotEnv('.env').as_dict() if isinstance(env_path_or_kv, str) else env_path_or_kv
    conf = Config(kv_env, ConfigRequirements({
        'APP_HOST': wants(req_types.STR, True),
        'APP_PORT': wants(req_types.INT, True),
        'APP_BASE_URL': wants(req_types.STR, False),
        'APP_DEBUG': wants(req_types.BOOL, False),
        'APP_ALLOW_CORS': wants(req_types.BOOL, False),
        'APP_SECRET_KEY': wants(req_types.STR, True),
        'USE_CDN': wants(req_types.BOOL, False),
        'CDN_HOST': wants(req_types.STR, False),
        'USE_MONGO': wants(req_types.BOOL, False)
    }))
    return conf


def vw_render_message(title: str, body: str, code: int = 200):
    ctx = dict(featured_section=None)
    return render_template('common/message.html', title=title, body=body, **ctx), code


def vw_render_404_page(message: str = '', title: str = ''):
    """
    renders a custom 404 page that should be in templates folder
    :return: rendered 404 page
    """
    title = title or 'Ooops! Page not found'
    return vw_render_message(title, message, 404)


def vw_serve_static(file_path: str):
    f_path = os.path.join('static', os.path.dirname(file_path))
    f_name = os.path.basename(file_path)
    return send_from_directory(f_path, f_name)


def app_register_routes(app: Flask, views: list):
    # register routes flaskworks bundled routes
    app.route('/s/<path:file_path>', methods=['GET'])(vw_serve_static)
    # register class based routes
    for view in views:
        app.add_url_rule(view.func.route, view.endpoint, view, methods=view.func.methods)


def _use_cors(res: Response):
    res.headers['Access-Control-Allow-Origin'] = '*'
    res.headers['Access-Control-Allow-Methods'] = 'GET, POST'
    res.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return res


def app_load_db() -> dict:
    db_name = G_ENV.get('APP_DB_NAME', 'app')
    db_file_name = '{name}.{ext}'.format(name=db_name, ext='db')
    db_path = os.path.join('etc', db_file_name)
    AppGlobals.dbm = DBManager(db_path)
    return {'ok': True, 'exists': os.path.isfile(db_path)}


def app_runner(app: Flask, config: dict):
    app.wsgi_app = PrefixMiddleware(app.wsgi_app, prefix=config.get('APP_BASE_URL', ''))
    app.secret_key = config.get('APP_SECRET_KEY')
    sk = DictObject(min=12, max=24, type='str')
    if not sk.min <= len(app.secret_key) <= sk.max:
        print('(E) Application secret key should be at least %d characters and maximum %d' % (
            sk.min, sk.max,
        ))
        exit(1)
    if config.get('APP_ALLOW_CORS'):
        app.after_request(_use_cors)
    app_load_db()
    AppGlobals.dbm.connect()
    AppGlobals.master_key = app.secret_key
    app.run(
        host=config.get('APP_HOST'),
        port=config.get('APP_PORT'),
        debug=config.get('APP_DEBUG', False),
        load_dotenv=False
    )
