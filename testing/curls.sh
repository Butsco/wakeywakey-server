#!/bin/bash

echo "Post a new alarm";
curl http://localhost:8000/v1/alarms/?access_token=wham --data "timestamp=1301090400&from=%2B32474418798&to=%2B32470876752&mood=singing&fromName=Bert Wijnants"

echo "";
echo "";
echo "List alarms";
curl http://localhost:8000/v1/alarms/?access_token=wham
echo "";