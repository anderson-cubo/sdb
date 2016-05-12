(function() {
  var randomString = function (len, bits) {
      bits = bits || 36;
      var outStr = "", newStr;
      while (outStr.length < len)
      {
          newStr = Math.random().toString(bits).slice(2);
          outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
      }
      return outStr.toLowerCase();
  };
  var sdbService = angular.module('sdb', []);
  sdbService.factory('$sdb', function() {
    var _dbName = 'db';
    var _start = function() {
      if(!localStorage[_dbName])
        localStorage[_dbName] = JSON.stringify([]);
      if(localStorage[_dbName][0] != '[')
        localStorage[_dbName] = JSON.stringify([]);
    };
    _start();
    var getDb = function() {
      return JSON.parse(localStorage[_dbName]);
    };
    var saveDb = function(arr) {
      localStorage[_dbName] = JSON.stringify(arr);
    };
    return {
      setDb: function(dbName) {
        _dbName = dbName;
        _start();
      },
      insert: function(object) {
        object.id  = randomString(32);
        var db = getDb();
        db.push(object);
        saveDb(db);
        return {
          id: object.id
        };
      },
      find: function(has, sortBy) {
        var f = null;
        if(has)
          f = _.filter(getDb(), has);
        else
          f = getDb();
        if(sortBy)
          f = _.sortBy(f, sortBy);
        return f;
      },
      update: function(has, data) {
        var db = getDb();
        var index = _.findIndex(db, has);
        if(index > -1) {
          data.id = db[index].id;
          db[index] = data;
          saveDb(db);
          return true;
        }else {
          return false;
        }
      },
      remove: function(has) {
        var _remove = function() {

        };
        var db = getDb();
        var index = _.findIndex(db, has);
        if(index > -1)
          _.pullAt(db, index);
        saveDb(db);
        return true;
      },
      clear: function() {
        saveDb([]);
      },
      reverse: function(q) {
        return _.reverse(q);
      }
    };
  });
})();
