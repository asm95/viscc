import os
import json
from typing import Union, Iterable, Callable


def value_or_not(a, b):
    return a if a else b


def unpack(a, b) -> list:
    """
    Unpack command will iterate over a using b as keys.

    Constraints:
        len(a) >= len(b)
    :param a: an iterable dict-like object
    :param b: an iterable containing hashable elements (e.g strings, int, float, ...)
    :return: values that were searched a[b[0]], a[b[1]]
    """
    return [a[k] for k in b]


def lapply(func: Callable, el_array: Iterable, func_args: Union[Iterable, object] = None):
    """
    Applies each element of el_array to function func.

    :param func: function to apply to each element of el_array
    :param el_array: elements in which func will be applied
    :param func_args: optional arguments to the function
    :return:
    """
    func_args = func_args or []
    if not isinstance(func_args, list):
        func_args = [func_args]

    for x in el_array:
        func(*func_args, x)


class DictObject(dict):
    """
    Acts like Javascript Object which we can index them by just appending '.' to the variable, for example:

    a = dict(b=10, c=20)
    a['b']

    d = DictObject(e=30, f=40)
    f.d
    """
    __getattr__ = dict.get
    __setattr__ = dict.__setitem__
    __delattr__ = dict.__delitem__


class AppData(object):
    encoding = 'utf-8'

    def load(self, raise_err: str = '') -> 'AppData':
        if not os.path.isfile(self.file_path):
            if 'f' in raise_err:
                raise ValueError('path for file "%s" must exist' % (self.file_path, ))
            return self
        with open(self.file_path, mode='r', encoding=self.encoding) as f:
            self.store = json.load(f)
        return self

    def save(self, ) -> 'AppData':
        with open(self.file_path, mode='w', encoding=self.encoding) as f:
            json.dump(f, self.store, ensure_ascii=False)
        return self

    def __init__(self, file_path: str):
        self.file_path = file_path
        self.store = dict()
