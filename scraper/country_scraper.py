#!/usr/bin/python

import sys
import json
import requests


# This script processes country data from an API 
# and creates a local reduced json file


def main():
    if len(sys.argv) < 3:
        print("Please provide a URL and an output path")
        exit(0)

    apiUrl = sys.argv[1]
    outPath = sys.argv[2]

    response = requests.get(apiUrl)

    data = []
    countries = json.loads(response.text)
    for country in countries:
        data.append(adaptItem(country))

    f = open(outPath, "w")
    f.write(json.dumps(data))
    f.close()


def adaptItem(item):
    result = {}
    result['name'] = item['name']
    result['code'] = item['alpha3Code']
    result['flag'] = item['flag']
    return result


if __name__ == "__main__":
    main()
