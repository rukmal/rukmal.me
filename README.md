#http://rukmal.me Source Code

This website is my attempt to have a centralized social 'hub' on the internet. It is also also an 'exploration' project of sorts for me. This is the first time I have exprimented with using Node.js, let alone maintaining and running my own server!

##Current Implementation
Currently, the site does not do very much for it to justify needing a functioning backend, as no site-related server side processing has to be done yet. Because of this, the only JavaScript currently in use is limited to the jQuery objects being used to control the animations on the site.

The site is being hosted on an [Amazon EC2](http://aws.amazon.com/ec2/) server, which is running [Ubuntu](http://ubuntu.com) 13.10 server. Instead of using the more conventional Apache Web Server to host the site, I have decided to use [Node.js](http://nodejs.org) along with [ExpressJS](http://expressjs.com/), both due to it being a LOT easier to use, and also because - when I do need it - any server-side processing can be done in JavaScript.

##Future Plans
I hope to expand the site to include my blog, which has been largely unused for a while. I used to host it on blogger, but to go along with the whole DIY theme of this site, I plan on hosting and managing it on my server as well.

Currently, I have no concrete plans as to how I'm going to implement this, but I hope to eventually include an actual 'comments' section for the blog. I plan to use some combination of JS and JSON to manage the data for me, as this will go well with the Node.js server implementation I'm currently using.

On the server side, if I do ever have to include additional servers, I hope to continue to use Node.js and ExpressJS by implementing some form of load-balancing between the two (or more) servers that I may eventually need.

##Contact
Any comments are welcome!

Find me at http://rukmal.me

> The author would greatly appreciate it if the design of the site was **not copied**.