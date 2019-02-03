function ItemFactory() {

   var item;
   var type;
   var name;
   var level;

   this.createItemPlaceholder = function() {

      item = new Item();
      item.type = -1;
      item.name = "placeholder";
      item.level = -1;

      return item;

   };

}