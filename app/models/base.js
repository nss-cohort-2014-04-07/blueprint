var Mongo = require('mongodb');
var _ = require('lodash');

class Base{
  static findById(id, collection, model, fn){
    if(typeof id === 'string'){
      if(id.length !== 24){fn(null); return;}
      id = Mongo.ObjectID(id);
    }

    if(!(id instanceof Mongo.ObjectID)){fn(null); return;}

    collection.findOne({_id:id}, (e,o)=>{
      if(o){
        o = _.create(model.prototype, o);
        fn(o);
      }else{
        fn(null);
      }
    });
  }

  static findAll(collection, model, fn){
    collection.find().toArray((e,objs)=>{
      objs = objs.map(o=>_.create(model.prototype, o));
      fn(objs);
    });
  }
}

module.exports = Base;
