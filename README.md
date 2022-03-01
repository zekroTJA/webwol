# webwol

An absolutely overengineered web application for waking up network devices via wake on lan.

## Demo

https://user-images.githubusercontent.com/16734205/156153234-49bfdef8-510f-455a-aa7a-84e73bb359a2.mp4

## Setup

You might want to deploy the application to an always running server in your local network like a Raspberry Pi or NAS. The recommended way is to use the provided [`docker-compose.yml`](docker-compose.yml). It contains the service configuration for the webwol app as well as for traefik as reverse proxy. If you use the provided Docker Compose config, you must enter your e-mail address as well as your DynDNS domain in the service configurations.

To access your server from the internet, you need to specify a port forwarding configuration in your home router for the device, both for port `80` (for the HTTP ACME challenge) as well as `443`.

The webwol service is a single binary containing the web files and runs mostly with zero configuration required. After first startup, you must initialize the service using the initialization key printed into the log and a provided password you want to use to log in later.