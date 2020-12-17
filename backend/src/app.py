from flask import Flask, render_template

from common.flask import (
    load_config, app_runner, app_register_routes
)
from common.util import lapply
from common.globals import G_ENV

from api.main import UserAPI, TelemetryAPI

app = Flask(
    # app is bound to script name
    __name__,
    # adding this, avoids you having to prefix eveything template
    template_folder='templates',
    # where your static files such as CSS/JS files will be stored
    # it's always better to use a CDN or webserver such as Apache
    # or nginx for better performance (in production)
    static_folder='static'
)

# class based view
wapp = UserAPI()
# loads config
config = load_config(G_ENV).as_dict()


def bootstrap_app():
    """
    compile all subapp's set of views in a single global array

    each sub-app generate it's own set of views, and we have to call app_register_routes for each of sub-app
    :return:
    """
    lapply(
        app_register_routes,
        [
            wapp.get_views(),
            TelemetryAPI().get_views(),
            # more views can be injected here
        ], func_args=app
    )


def run_app():
    app_runner(app, config)


bootstrap_app()

if __name__ == '__main__':
    run_app()
