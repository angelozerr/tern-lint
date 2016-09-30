/**
 * json
 *
 * @param {Object} data
 * @param {Object[]} data.messages
 */
exports.json = function (data) {
  return JSON.stringify(data);
}

/**
 * pretty
 *
 * @param {Object} data
 * @param {Object[]} data.messages
 */
exports.pretty = function (data) {
  return JSON.stringify(data, null, ' ');
};

/**
 * vim
 *
 * @param {Object} data
 * @param {Object[]} data.messages
 */
exports.vim = function (data) {
  if (!data || !data.messages) {
    return '';
  }

  return data.messages.map(function (m) {
    return [
      m.file + ':',
      'line ' + m.from + ',',
      m.severity,
    ].join(' ');
  });
};
