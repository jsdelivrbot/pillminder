const db = require('../database/config');
const connection = db.getConnection();

const OPEN_CONTAINER = "UPDATE container SET last_opened = NOW() WHERE id = $1";
const REMIND = "SELECT extract(epoch FROM last_opened), frequency FROM container WHERE id = $1";

const GRACE_PERIOD = 0.5 * 3600;

module.exports = {
    open: function(id) {
        return connection.query(OPEN_CONTAINER, [id]);
    },

    remind: function(id) {
        return connection.query(REMIND, [id])
            .then(function(rows) {
                var now = ((new Date).getTime()) / 1000;
                if (rows[0].date_part > now - rows[0].frequency * 3600 + GRACE_PERIOD) return false;
                else return true;
            });
    }
};