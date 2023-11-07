# ISPWatcher (ALPHA)

*The code above is still in alpha state. Do not consider it stable.*

Tired of your ISP telling you there are no problems with your internet connection? Have you been so frustrated with "customer support" that you have called a poor support representative an a$$hole? Well you are no longer powerless! Hold them accountable with this utility. This utility executes a speedtest against http://fast.com and records the result to a local SQLITE Database. This is lightweight enough to run on a Raspberry Pi. We take care of everything for you. We scrape Fast.com for it's API token and pass that to this utitlity. We then run a speedtest at your specified interval to test your connection. That result is then stored in a SQLite on disk database. Currently, you will need to manually query your database file for your results. Future versions will contain a lightweight web application that will grant you the ability to dump your results into a CSV file.

## Recommended Usage
I strongly recommend you run this on a device that is always on and connected to your router/modem with an ethernet cable. This will give you the most consistent result. Optionally, consider running this on a Raspberry Pi. 

## Support
This software runs on any machine that suports the following:
1. NodeJS 18.x
2. Docker (Future Version)

## Installation
