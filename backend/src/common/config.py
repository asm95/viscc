"""
Provides an interface for specifying configuration requirements

In order to ensure the user has provided valid ``(key,value)`` pairs for correct functioning of the application, it is
essential to have a class that will verify if all the required values were provided and they have the right type.
Example of types are primitives such as integer, boolean, string, etc.
"""

from collections import OrderedDict
from typing import Mapping, Callable, List, Tuple


__version__ = '0.0.5'


class ConfigRequirements(object):
    class Type:
        INT, STR, BOOL = (None, None, None)  # type: ConfigRequirements.Type

        def parse(self, val: object):
            return self.parse_fn(val)

        def __init__(self, display_name: str, parse: Callable):
            self.display_name = display_name
            self.parse_fn = parse

    class Require:
        def __init__(self, type: 'ConfigRequirements.Type', required: bool = False):
            self.type = type
            self.required = required

    def get(self, key):
        return self.req.get(key)

    def items(self):
        return self.req.items()

    def keys(self):
        return self.req.keys()

    @staticmethod
    def will_unpack(mapping_list: List[Tuple]):
        return OrderedDict(mapping_list)

    def __init__(self, req: Mapping[str, Require]):
        self.req = req
        self.has_order = isinstance(req, OrderedDict)


class Config(object):
    """
    A configuration object check if a given configuration is valid.

    A configuration requirement (see :class:`ConfigRequirements`) must be provided in order to instantiate this
    class. Once that, you may call :func:`parse_requirements` in order to check if they are valid.
    If no error is raised during the parse, then the values will be available with the get function
    """
    def get(self, key: str, default_value=None) -> object:
        return self.kv_storage.get(key, default_value)

    def as_dict(self, ) -> dict:
        return self.kv_storage

    def parse_requirements(self, kv_storage: dict) -> dict:
        """
        Parses the ``kv_storage dict`` to check their validity

        Returns kv_storage containing the parsed values if they all valid and match the specification
        :param kv_storage:
        :return: a dictionary containing the parsed values
        """
        parsed = dict()
        for key, spec in self.requires.items():
            val = kv_storage.get(key)
            if not val:
                if spec.required:
                    raise ValueError('Required param %s' % (key, ))
                else:
                    # if not required, don't include in parsed so dict.get method will work with default value
                    continue
            try:
                parsed_val = spec.type.parse(val)
            except (ValueError, ):
                raise ValueError('Could not parse %s. Expected %s' % (key, spec.type.display_name))
            parsed[key] = parsed_val
        return parsed

    def unpack(self, ):
        if not self.requires.has_order:
            raise ValueError('Requirements should be provided with %s.will_unpack method' % (
                self.requires.__class__.__name__
            ))
        return [self.kv_storage[k] for k in self.requires.keys()]  # this will return in the same order provided
        # by the user

    def __init__(self, kv_storage: dict, req: ConfigRequirements):
        self.requires = req
        self.kv_storage = self.parse_requirements(kv_storage)


def __bootstrap_module():
    ty = ConfigRequirements.Type
    ty.INT = ty(display_name='Integer', parse=lambda x: int(x))
    ty.STR = ty(display_name='String', parse=lambda x: x)
    ty.BOOL = ty(display_name='Boolean', parse=lambda x: x.lower() in ('true', 'yes', 'y') if isinstance(x, str) else False)


__bootstrap_module()
