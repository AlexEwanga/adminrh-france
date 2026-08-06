import json
import os

with open('query_part_1.sql', 'r') as f:
    sql = f.read()

# I will print the SQL so I can copy it into the next tool call
print(sql)
