# [rukmal.me]

## Development Instructions
- Clone the repository locally using git
```bash
$ git clone git://github.com/rukmal/rukmal.me.git
```

- Install required node modules using npm
```bash
$ npm install
```

- Install required bower components locally (optional)
```bash
$ bower install
```

- Run grunt 'watch' task to auto-watch and recompile jade
```bash
$ grunt watch
```

## Design Notes

|Order|Page Load Workflow|
|:---:|:-----------------|
|1|Initial Page Loaded (HTML and Basic CSS+JS, with SpinnerJS and jQuery)|
|2|Remaining CSS and JS loaded asynchronously using jQuery's ajax functions|
|3|Spinner removed on final resource load|
|4|Page displayed|

## Contact

This is an open source project released under the [MIT License](LICENSE). Contact me if you want to suggest an improvement, or fork and send a pull request!

Follow me on Twitter ([@rukmal](http://twitter.com/rukmal_w)) and [GitHub](http://github.com/rukmal).

http://rukmal.me
