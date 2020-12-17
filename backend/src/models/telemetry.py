from datetime import datetime as dt, timedelta
import json

from common.globals import G_ENV, AppGlobals
from models.main import TaskTelemetry


def log_telemetry_data(user_id: int, res_id: int, log_data: dict):
    """
    log telemetry data to database
    :param user_id: user id
    :param res_id: resource id
    :param log_data: log data as json serializable
    :return: True if added
    """
    dbm = AppGlobals.dbm
    dbm.session.add(TaskTelemetry(
        user_id=user_id, resource_id=res_id, date=dt.utcnow(), log_data=json.dumps(log_data)
    ))
    dbm.session.commit()
