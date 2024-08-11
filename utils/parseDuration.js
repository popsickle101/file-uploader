function parseDuration(duration) {
    const units = { d: 'day', h: 'hour', m: 'minute' };
    const regex = /(\d+)([dhm])/;
    const match = duration.match(regex);
  
    if (!match) {
      throw new Error('Invalid duration format');
    }
  
    const [_, value, unit] = match;
    const milliseconds = {
      day: 24 * 60 * 60 * 1000,
      hour: 60 * 60 * 1000,
      minute: 60 * 1000
    };
  
    return Date.now() + value * milliseconds[units[unit]];
  }
  
  module.exports = { parseDuration };
  