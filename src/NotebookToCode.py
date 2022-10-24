# import fnmatch
import os
import json

"""
NotebookToCode.py
Searches for the most recent jupyter notebook in downloads and creates a new file of just code
Set path = 1 if you want it to search the project directory instead
@author Kalea Gin
@version 10/22/2022
"""
path = 0


if path == 1:
    dir = os.path.dirname(os.path.abspath(__file__))
else:
    dir = os.path.expandvars("%USERPROFILE%\\Downloads\\")


"""
findPath
Finds the most recent file with the name in the directory with the ending pattern specified
src: https://stackoverflow.com/questions/1724693/find-a-file-in-python
@param string extension, string directory
@returns most recent file
"""

def findPath(extension, directory):
    files = [os.path.join(directory, x) for x in os.listdir(directory) if x.endswith(extension)]
    try:               #throws an error if no files found
        newest = max(files, key = os.path.getctime)
    except:
        newest = -1
    finally:
        return newest

def getNums(str):
    try:
        return int(str[17:19])
    except:
        return -1


"""
Main
"""
target = ".ipynb"
file = findPath(target, dir) 

#if file found
if file == -1:
    print("Error no file found")
else:
    with open(file, mode= "r", encoding= "utf-8") as f:
        myfile = json.loads(f.read())
        
    code = []
    for cell in myfile['cells']:
        if cell['cell_type'] == 'code':
            for line in cell['source']:
                code.append(line)

    codeFile = file[:-6]+myfile['metadata']['language_info']['file_extension']

    with open(codeFile, 'w') as cf:
        for line in code:
            cf.write(line + "\n")
        
    print("Successfully completed! Created new file: " + os.path.basename(codeFile))
