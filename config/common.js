const con = require("./database");
const GLOBALS = require("./constants");

const Validate = {



  /*
  ** Common Single Insert operation
  */
  singleInsert: function (tablename, params, callback) {
    con.query(
      "INSERT INTO " + tablename + " SET ?",
      params,
      function (error, result, fields) {
        console.log('insert error', error);
        if (!error) {
          callback(result.insertId, error);
        } else {
          callback(null, error);
        }
      }
    );
  },

  /*
  ** Common Single update operation
  */
  singleUpdate: function (tablename, params, condition, callback) {
    con.query(
      "UPDATE " + tablename + " SET ? WHERE " + condition + " ",
      params,
      function (error, result, fields) {
        if (!error) {
          callback(result, error);
        } else {
          // console.log(error);
          callback(null, error);
        }
      }
    );
  },

  

  /*
  ** Function to get single detail from table
  */
  common_Singleselect: function (query, callback) {
    con.query(query, function (err, result, fields) {
      console.log('query', this.sql);
      console.log(err,result)
      if (!err && result.length > 0) {
        callback(result[0]);
      } else {
        if (err) {
          console.log("Common single Select Error :- ", err);
        }
        callback(null);
      }
    });
  },

  /*
  ** Function to get multiple details from table
  */
  common_Multipleselect: function (query, callback) {
    con.query(query, function (err, result, fields) {
      console.log(this.sql,result);
      if (!err && result.length > 0) {
        callback(result);
      } else {
        if (err) {
          console.log("Common Multiple Select Error :- ", err);
        }
        callback(null);
      }
    });
  },

  /*
  ** Function to insert into table
  */
  common_insert: function (tabelname, insparam, callback) {
    con.query(
      "INSERT INTO " + tabelname + " SET ?",
      insparam,
      function (err, result, fields) {
        if (!err) {
          callback(result.insertId);
        } else {
          console.log("Common insert Error :- ", err);
          callback(0);
        }
      }
    );
  },

  /*
  ** Function to update table details
  */
  common_update: function (tabelname, wherecon, updparam, callback) {
    con.query(
      "UPDATE " + tabelname + " SET ? WHERE " + wherecon,
      updparam,
      function (err, result, fields) {
        if (!err) {
          callback(true);
        } else {
          console.log("Common Update Error :- ", err);
          callback(false);
        }
      }
    );
  },


};

module.exports = Validate;
