import bcrypt
import click

from common.logging import Logger
from common.globals import AppGlobals
from common.flask import app_load_db
from models.user import User, UserRoles, UserSettings, usr_bake_password


@click.group()
def cli():
    pass


def task_db_init():
    log = Logger()
    log.info('Connecting to database...')
    result = app_load_db()
    if result['exists']:
        log.err('DB file already exists!')
        return
    dbm = AppGlobals.dbm
    dbm.connect()
    dbm.init_all()
    # configuring base data
    root_user = User(
        id=0, name='admin', passwd=usr_bake_password('222'), org_id='0', role=UserRoles.ADMIN.value,
        is_admin=True, prefs=UserSettings.serialize(UserSettings.default())
    )
    user_prefs = UserSettings.default()
    user_org_id = '15/0000001'
    user_profile = user_prefs['userProfile']
    user_profile['prettyName'] = 'Cristiano'
    user_profile['orgID'] = user_org_id
    example_student = User(
        id=1, name='criss', passwd=usr_bake_password('333'), org_id=user_org_id, role=UserRoles.STUDENT.value,
        is_admin=False, prefs=UserSettings.serialize(user_prefs)
    )
    dbm.session.add_all([root_user, example_student])
    dbm.session.commit()
    log.info('Done!')


@cli.command('db')
@click.argument('db_command', type=str, default='')
def cli_db(db_command: str):
    if db_command == 'init':
        task_db_init()
    elif db_command == '':
        print('Available commands are: init')
        return


if __name__ == '__main__':
    cli()
