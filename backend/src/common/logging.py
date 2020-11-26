from functools import partialmethod


class Logger(object):
    log_fn = print
    enabled = True
    name = ''

    def get(self, name: str):
        if name not in self.named_childs:
            new_log = Logger()
            new_log.enabled = self.enabled
            new_log.name = name
            self.named_childs[name] = new_log
        return self.named_childs[name]

    def enable(self, name: str, toggle: bool):
        log_obj = self.get(name)
        log_obj.enabled = toggle

    def log(self, *args):
        if not self.enabled:
            return
        return self.log_fn(*args)

    def as_file(self, file_path: str, mode='w'):
        self.fp = open(file_path, mode, encoding='utf-8')

        def log_fn(*args):
            self.fp.write(' '.join(args) + '\n')
        self.log_fn = log_fn

        return self

    def close(self, ):
        if self.fp:
            self.fp.close()
        return self

    info = partialmethod(log, '(I)')
    war = partialmethod(log, '(W)')
    err = partialmethod(log, '(E)')

    def __call__(self, *args, **kwargs):
        return self.log(*args)

    def __init__(self):
        self.named_childs = dict()
        self.fp = None
