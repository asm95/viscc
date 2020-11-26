from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.session import Session
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class TaskTelemetry(Base):
    __tablename__ = 'task_telemetry'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    resource_id = Column(Integer)
    date = Column(DateTime)
    log_data = Column(String)


class DBManager(object):
    session: Session

    def init_all(self, ):
        Base.metadata.create_all(self.engine)

    def connect(self):
        maker = sessionmaker(bind=self.engine)
        self.session = maker()

    def __init__(self, db_path: str):
        self.engine = create_engine(
            'sqlite:///{path}'.format(path=db_path), echo=False,
            # avoid thread error
            connect_args={'check_same_thread': False}
        )
