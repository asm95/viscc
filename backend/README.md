### Installing

Create a new Python virtual environment, install dependencies and bootstrap the
application

```bash
# make sure you're in root directory
test -f app.py && echo "you're in the server-side root directory!" 
# create env
python3 -m venv venv
# switch to it
source venv/bin/activate
# install deps
python3 -m pip install -r requirements.txt
```

### Dependencies

This project use the following packages:

- SQLAlchemy: [homepage](https://www.sqlalchemy.org/), [repository](https://github.com/sqlalchemy/sqlalchemy), License: MIT
- Flask: [homepage](https://flask.palletsprojects.com/), [repository](https://github.com/pallets/flask), License: BSD 3-Clause
