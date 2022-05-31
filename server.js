const { app } = require('./app');

// utils
const { db } = require('./utils/database');
const { initModels } = require('./utils/initModels');

db.authenticate()
  .then(() => console.log('Database authenticated'))
  .catch((err) => console.log(err));

initModels();

db.sync({ force: false })
  .then(() => console.log('Database synced'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`);
});
