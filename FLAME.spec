# -*- mode: python -*-

block_cipher = None


import sys
import os
paths = sys.path[:]
paths.append(os.getcwd())
a = Analysis(['run.py'],
             pathex=paths,
             hiddenimports=['flask_sqlalchemy', 'flask_sqlalchemy._compat'],
             hookspath=None,
             runtime_hooks=None,
             cipher=block_cipher)
pyz = PYZ(a.pure,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          exclude_binaries=True,
          name='flame',
          debug=False,
          strip=None,
          upx=True,
          console=True )
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas,
               [('server/biobrick.db', 'server/biobrick.db', 'DATA')],
               Tree('server/templates', 'server/templates'),
               Tree('server/static', 'server/static'),
               strip=None,
               upx=True,
               name='flame')
