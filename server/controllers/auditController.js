const Store = require('../data/store');

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await Store.getAuditLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
