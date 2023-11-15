const config = require("./config");
const app = require('./app');

app.listen(config.port, (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server is running at http://localhost:${config.port}`);
  }
});
