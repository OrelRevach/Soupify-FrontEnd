#!/usr/bin/python

import sys
import json
import requests
from bs4 import BeautifulSoup

# This script processes food categories data from an web page 
# and creates a local reduced json file


def main():
    if len(sys.argv) < 4:
        print("Please provide a URL, an output path, and list of category names")
        exit(0)

    pageUrl = sys.argv[1]
    outPath = sys.argv[2]
    categoryNames = sys.argv[3:]

    categoryData = []

    for category in categoryNames:
        response = requests.get(pageUrl + "#" + category)

        soup = BeautifulSoup(response.text, "html.parser")
        section = soup.find("section", {"jss-title": category})

        # Try extracting from list
        dataList = section.find("ul", {"class": "pageList"})
        if not isinstance(dataList, type(None)):
            categoryData.append(formatData(category, dataList.findAll("li")))
            continue

        # Try extracting from titles
        dataList = section.findAll("h4")       
        if not isinstance(dataList, type(None)):
            categoryData.append(formatData(category, dataList))
            continue

    # Write collected data
    f = open(outPath, "w")
    f.write(json.dumps(categoryData))
    f.close()


def formatData(category, dataList):
    items = []
    for item in dataList:
        items.append(item.text)

    data = {}
    data['name'] =  category
    data['values'] = items

    return data


if __name__ == "__main__":
    main()
