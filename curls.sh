#!/bin/bash

echo "Post a new alarm";
curl http://localhost:8000/v1/alarms/?access_token=wham --data "timestamp=234234&from=32474418798&to=32470876752&mood=singing"

echo "";
echo "";
echo "List alarms";
curl http://localhost:8000/v1/alarms/?access_token=wham
echo "";