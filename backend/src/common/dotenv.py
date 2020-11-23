class DotEnv(object):

    @staticmethod
    def file_iterlines(file_path: str):
        """
        iterate through lines without '\n'

        :param file_path:
        :return: iterator for each line of file
        """
        with open(file_path, 'r', encoding='utf-8') as fp:
            for line in fp:
                if line[-1] == '\n':
                    line = line[:-1]
                yield line

    def parse_file(self):
        for line in self.file_iterlines(self.file_path):
            if line.startswith('#'):
                continue
            l_info = line.split('=', 1)
            if len(l_info) != 2:
                raise ValueError('Malformed .env file')
            k, v = l_info
            self._kv[k] = v

    def as_dict(self, ):
        return self._kv

    def get(self, key: str, dv):
        return self._kv.get(key, dv)

    def __init__(self, file_path: str = '.env'):
        self.file_path = file_path
        self._kv = dict()
        self.parse_file()
