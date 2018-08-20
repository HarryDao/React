const Express = require('express');
const Path = require('path');
const PORT = process.env.PORT || 8080;

const app = Express();

app.use(Express.static(Path.join(__dirname, './dist')));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});