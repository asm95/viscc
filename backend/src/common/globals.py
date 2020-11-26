import os

from common.dotenv import DotEnv
from common.util import AppData

from models.main import DBManager

G_ENV = DotEnv('.env').as_dict()
G_DATA = AppData('etc/state.json').load()


class AppGlobals(object):
    dbm: DBManager
    master_key: str = ''
