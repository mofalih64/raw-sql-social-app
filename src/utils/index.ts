const { v4 } = require('uuid');

export function getUuid() {
  return v4();
}
