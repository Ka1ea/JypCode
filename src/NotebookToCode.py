import fnmatch
import os
import json

"""
NotebookToCode.py
Searches for the most recent jupyter notebook (by [first-last-projectXX] number) and creates a new file of just code
Set serach = 1 if you want it to search the project directory instead
@author Kalea Gin
@version 10/22/2022
"""
path = 1


if path == 1:
    dir = os.path.dirname(os.path.abspath(__file__))
else:
    dir = os.path.expandvars("%USERPROFILE%\\Downloads\\")


"""
Find
Finds the file with the name in the directory of the path provided
src: https://stackoverflow.com/questions/1724693/find-a-file-in-python
@param string name, string path
@returns list string names
"""
def findPaths(pattern, path):
    result = []
    for root, dirs, files in os.walk(path):
        for name in files:
            if fnmatch.fnmatch(name, pattern):
                result.append(name)
        
    return result

def getNums(str):
    return int(str[17:19])


"""
Main
"""
target = "*-*-[project]*.ipynb"

nbOptions = findPaths(target, dir)
print(nbOptions)
nums = list(map(getNums, nbOptions))
recentNum = max(nums)
print (recentNum)
pathL = [i for i in nbOptions if i.__contains__(str(recentNum))]
file = str(pathL[-1])

with open(os.path.join(dir, file), mode= "r", encoding= "utf-8") as f:
    myfile = json.loads(f.read())
    
code = []
for cell in myfile['cells']:
    if cell['cell_type'] == 'code':
        for line in cell['source']:
            code.append(line)

codeFile = file[:-6]+myfile['metadata']['language_info']['file_extension']

with open(os.path.join(dir, codeFile), 'w') as cf:
    for line in code:
        cf.write(line + "\n")
    
print("Successfully completed!")
