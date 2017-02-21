# node-connect-datadog

Datadog middleware for Connect JS / Express


## Usage

Add middleware immediately before your router.

  app.use(require("connect-datadog")({}));
  app.use(app.router);

## Options

All options are optional.

* `dogstatsd` node-dogstatsd client. `default = new (require("node-dogstatsd")).StatsD()`
* `stat` *string* name for the stat. `default = "node.express.router"`
* `tags` *array* of tags (or *function* returning array of tags) to be added to the histogram. `default = []`

    ```js
    (req, res) => {
      // set tags dynamically
      return ['key:value']
    }
    ```

* `sampleRate` *number* sends only a sample of data to StatsD `default: 1`
* `path` *boolean* include path tag. `default = false`
* `method` *boolean* include http method tag. `default = false`
* `protocol` *boolean* include protocol tag. `default = false`
* `response_code` *boolean* include http response codes. `default = false`
* `statsCallback` *function* callback hook that provides the following params

    ```js
    (datadog, stat, sampleRate, statTags, req, res) => {
      // increment coolthing
      datadog.increment(`${stat}.coolthing`, sampleRate, statTags);
    }
    ```

## License

View the [LICENSE](https://github.com/AppPress/node-connect-datadog/blob/master/LICENSE) file.
