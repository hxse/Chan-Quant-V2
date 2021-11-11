#!/usr/bin/env python3
# coding: utf-8
import subprocess
from pathlib import Path
import os

filePath = Path(__file__).parent
print(filePath)
os.chdir(str(filePath.parent))

extentsion_list = [
    "dart-code.dart-code",
    "unbug.codelf",
    "ritwickdey.liveserver",
    # "ms-python.python",
    "kevinrose.vsc-python-indent",
    "ms-python.vscode-pylance",
    "himanoa.python-autopep8",
    "ms-toolsai.jupyter",
    "ms-toolsai.jupyter-keymap",
    "ms-toolsai.jupyter-renderers",
]

parms = [["--disable-extension", i] for i in extentsion_list]
cmd = ["code", filePath.name, *[i for i in parms for i in i]]
print(cmd)
# subprocess.run(cmd)#有弹窗
subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)#无弹窗
