import json
from typing import Union
from enum import Enum

import bcrypt
import jwt

from sqlalchemy import Column, Integer, String, Boolean
from .main import Base

from common.globals import G_ENV, AppGlobals


class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    passwd = Column(String)
    org_id = Column(String)
    role = Column(Integer)
    is_admin = Column(Boolean)
    prefs = Column(String)


class UserRoles(Enum):
    ADMIN = 0
    PROFESSOR = 1
    STUDENT = 2


def usr_bake_password(password: str) -> str:
    master_key = G_ENV.get('APP_SECRET_KEY')
    pass_str = password + master_key
    return bcrypt.hashpw(pass_str, bcrypt.gensalt())


def usr_check_password(password: str, db_password: str) -> bool:
    master_key = G_ENV.get('APP_SECRET_KEY')
    pass_str = password + master_key
    return bcrypt.checkpw(pass_str, db_password)


def usr_get_from_creds(username: str, password: str) -> Union[User, None]:
    """get user data from provided credentials"""
    dbm = AppGlobals.dbm
    usr_entry = dbm.session.query(User).filter_by(name=username).first()
    if usr_check_password(password, usr_entry.passwd):
        return usr_entry


def usr_bake_token(user: User) -> str:
    payload = {'uid': user.id}
    encoded = jwt.encode(payload, AppGlobals.master_key, algorithm='HS256').decode('utf-8')
    return encoded


def usr_check_token(token: str) -> Union[dict, None]:
    try:
        encoded = jwt.decode(token, AppGlobals.master_key, algorithms=['HS256'])
        return encoded
    except (Exception, ) as e:
        pass
    return None


def usr_unpack_prefs(user: User) -> dict:
    return json.loads(user.prefs)


def usr_save_prefs(user_id: int, prefs: dict) -> bool:
    dbm = AppGlobals.dbm
    usr_obj = dbm.session.query(User).get(user_id)  # type: Union[User, None]
    if user_id < 0: return False

    try:
        usr_obj.prefs = UserSettings.serialize(prefs)
        dbm.session.commit()
    except (Exception, ):
        return False

    return True


class UserSettings(object):
    _default = {
        'langCode': 0,
        'acceptPrivacy': False,
        'userProfile': {
            'isLogged': False,
            'prettyName': 'Admin',
            'orgID': '0000'
        }
    }

    @classmethod
    def default(cls) -> dict:
        return cls._default.copy()

    @staticmethod
    def serialize(store: dict) -> str:
        return json.dumps(store, ensure_ascii=False)
