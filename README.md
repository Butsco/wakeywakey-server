wakeywakey-server
=================
Wake up sleepyhead!

Create an alarm
----------------
```
POST /v1/alarms/
```

Parameter       | Description
--------------- | -------------
timestamp       | timestamp in seconds
from            | msisdn of the requester
fromName        | Name of the person that needs a wake up call
to              | msisdn of the person who's has to do the wake up call
mood            | Style of the wake up call: singing, happy, funny, scary, joke

msisdn format
-------------
It needs to include the international prefix. Only numbers are allowed. http://en.wikipedia.org/wiki/MSISDN

```
32457096745
```


Tunneling
---------
https://github.com/defunctzombie/localtunnel

```
npm install -g localtunnel
```

Setup tunnel:
```
$lt --port 8000 --subdomain=wakeywakey
your url is: https://wakeywakey.localtunnel.me
```
