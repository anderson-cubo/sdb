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
    var sdb = {
      _dbName: 'db',
      _start: function() {
        if(!localStorage[this._dbName])
          localStorage[this._dbName] = JSON.stringify([]);
        if(localStorage[this._dbName][0] != '[')
          localStorage[this._dbName] = JSON.stringify([]);
      },
      getDb: function() {
        return JSON.parse(localStorage[this._dbName]);
      },
      saveDb: function(arr) {
        localStorage[this._dbName] = JSON.stringify(arr);
      },
      setDb: function(dbName) {
        this._dbName = dbName;
        this._start();
      },
      insert: function(object) {
        object._id  = randomString(32);
        var db = this.getDb();
        db.push(object);
        this.saveDb(db);
        return {
          _id: object._id
        };
      },
      find: function(has, sortBy) {
        var f = null;
        if(has)
          f = _.filter(this.getDb(), has);
        else
          f = this.getDb();
        if(sortBy)
          f = _.sortBy(f, sortBy);
        return f;
      },
      update: function(has, data) {
        var db = this.getDb();
        var index = _.findIndex(db, has);
        if(index > -1) {
          data._id = db[index]._id;
          db[index] = data;
          this.saveDb(db);
          return true;
        }else {
          return false;
        }
      },
      remove: function(has) {
        var _remove = function() {

        };
        var db = this.getDb();
        var index = _.findIndex(db, has);
        if(index > -1)
          _.pullAt(db, index);
        this.saveDb(db);
        return true;
      },
      clear: function() {
        this.saveDb([]);
      },
      reverse: function(q) {
        return _.reverse(q);
      }
    };
    return sdb;
  });
})();
