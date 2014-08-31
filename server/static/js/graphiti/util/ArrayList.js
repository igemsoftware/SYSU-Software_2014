/**
The GPL License (GPL)

Copyright (c) 2012 Andreas Herz

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details. You should
have received a copy of the GNU General Public License along with this program; if
not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
MA 02111-1307 USA

**/



/**
 * @class graphiti.util.ArrayList
 * An ArrayList stores a variable number of objects. This is similar to making an array of 
 * objects, but with an ArrayList, items can be easily added and removed from the ArrayList 
 * and it is resized dynamically. This can be very convenient, but it's slower than making
 * an array of objects when using many elements. 
 */
graphiti.util.ArrayList = Class.extend({

    /**
     * @constructor
     * Initializes a new instance of the ArrayList class that is empty and has
     * the default initial capacity.
     * 
     */
    init: function( ) {
        this.increment = 10;
        
        this.size = 0;
        this.data = new Array(this.increment);        
    },
    
    
     /**
      * @method
      * Reverses the order of the elements in the ArrayList. The array will be modified!
      * 
     * @return {graphiti.util.ArrayList} self
      */
     reverse:function()
     {
        var newData = new Array(this.size);
        for (var i=0; i<this.size; i++)
        {
           newData[i] = this.data[this.size-i-1];
        }
        this.data = newData;
        
        return this;
     },
    
     /**
      * @method
      * Returns the allocated/reserved entries. Not all entries are filled with an valid element.
      * 
      * @return {Number} the size of the allocated entries
      */
     getCapacity:function() 
     {
        return this.data.length;
     },
    
     /**
      * @method
      * The size/count of the stored objects.
      * 
      * @return {Number}
      */
     getSize:function() 
     {
        return this.size;
     },
    
     /**
      * @method 
      * checks to see if the Vector has any elements.
      * 
      * @return {Boolean} true if the list is empty
      **/
     isEmpty:function() 
     {
        return this.getSize() === 0;
     },
    
     /**
      * @method
      * return the last element.
      * 
      * @return {Object}
      */
     getLastElement:function() 
     {
        if (this.data[this.getSize() - 1] !== null) 
        {
           return this.data[this.getSize() - 1];
        }
        return null;
     },
    
     /**
      * @method
      * Return a reference to the internal javascript native array.
      * 
      * @return {Array}
      */
     asArray:function() 
     {
       this.trimToSize();
       return this.data;
     },
    
     /**
      * @method
      * returns the first element
      * 
      * @return {Object}
      */
     getFirstElement:function() 
     {
        if (this.data[0] !== null && typeof this.data[0] !=="undefined") 
        {
           return this.data[0];
        }
        return null;
     },
    
     /**
      * @method
      * returns an element at a specified index
      *
      * @param {Number} i
      * @return {Object}
      */
     get:function(i)
     {
        return this.data[i];
     },

    /**
     * @method
     * Adds a element at the end of the Vector.
     *
     * @param {Object} obj the object to add
     * @return {graphiti.util.ArrayList} self
     */
     add:function(obj)
     {
        if(this.getSize() == this.data.length) 
        {
           this.resize();
        }
        this.data[this.size++] = obj;
        
        return this;
     },

    /**
     * @method
     * Add all elements into this array.
     *
     * @param {graphiti.util.ArrayList} list
     * @return {graphiti.util.ArrayList} self
     */
     addAll:function(list)
     {
        if(!(list instanceof graphiti.util.ArrayList)){
          throw "Unable to handle unknown object type in ArrayList.addAll";
        }

        for (var i=0;i<list.getSize(); i++)
        {
           this.add(list.get(i));
        }
        return this;
     },
    
     /**
      * @method
      * Remove the element from the list
      *
      * @param {Object} obj the object to remove
      * @return {Object} the removed object or null
      */
     remove:function( obj)
     {
        var index = this.indexOf(obj);
        if(index>=0)
         return this.removeElementAt(index);
        
        return null;
     },


    /**
     * @method
     * Inserts an element at a given position. Existing elements will be shifted
     * to the right.
     *
     * @param {Object} obj the object to insert.
     * @param {Number} index the insert position.
     * 
     * @return {graphiti.util.ArrayList} self
    */
     insertElementAt:function(obj, index) 
     {
        if (this.size == this.capacity) 
        {
           this.resize();
        }
        
        for (var i=this.getSize(); i > index; i--) 
        {
           this.data[i] = this.data[i-1];
        }
        this.data[index] = obj;
        this.size++;
        
        return this;
     },

    /**
     * @method
     * removes an element at a specific index.
     *
     * @param {Number} index the index of the element to remove
     * @return {Object} the removed object
     */
     removeElementAt:function(index)
     {
        var element = this.data[index];
    
        for(var i=index; i<(this.getSize()-1); i++)
        {
           this.data[i] = this.data[i+1];
        }
    
        this.data[this.getSize()-1] = null;
        this.size--;
        
        return element;
     },

    /**
     * @method
     * removes all elements in the Vector
     * 
     * @return {graphiti.util.ArrayList} self
     */
     removeAllElements:function()
     {
        this.size = 0;
    
        for (var i=0; i<this.data.length; i++) 
        {
           this.data[i] = null;
        }
        
        return this;
     },
    
     /**
      * @method
      * Return the zero based index of the given element or -1 if the element
      * not in the list.
      *
      * @param {Object} obj the element to check
      * 
      * @return {Number} the index of the element or -1
      */
     indexOf:function(obj)
     {
        for (var i=0; i<this.getSize(); i++) 
        {
           if (this.data[i] == obj) 
           {
              return i;
           }
        }
        return -1;
     },

    /**
     * @method
     * returns true if the element is in the Vector, otherwise false.
     *
     * @param {Object} obj the object to check
     * @return {boolean}
     */
     contains:function(obj) 
     {
        for (var i=0; i<this.getSize(); i++) 
        {
           if (this.data[i] == obj)
           {
              return true;
           }
        }
        return false;
     },
    
     // resize() -- increases the size of the Vector
     resize:function()
     {
        newData = new Array(this.data.length + this.increment);
    
        for   (var i=0; i< this.data.length; i++) 
        {
           newData[i] = this.data[i];
        }
    
        this.data = newData;
        
        return this;
     },
    
    
     // trimToSize() -- trims the vector down to it's size
     trimToSize:function()
     {
        // nothing to do
        if(this.data.length == this.size)
           return;
    
        var temp = new Array(this.getSize());
    
        for (var i = 0; i < this.getSize(); i++) 
        {
           temp[i] = this.data[i];
        }
        this.size = temp.length;
        this.data = temp;
        
        return this;
     }, 
    
     /**
      * @method
      * Sorts the collection based on a field name - f
      * 
      * @param {String} the fieldname for the sorting
      * 
      * @return {graphiti.util.ArrayList} self
      */
     sort:function(f) 
     {
        var i, j;
        var currentValue;
        var currentObj;
        var compareObj;
        var compareValue;
    
        for(i=1; i<this.getSize();i++) 
        {
           currentObj = this.data[i];
           currentValue = currentObj[f];
    
           j= i-1;
           compareObj = this.data[j];
           compareValue = compareObj[f];
    
           while(j >=0 && compareValue > currentValue) 
           {
              this.data[j+1] = this.data[j];
              j--;
              if (j >=0) {
                       compareObj = this.data[j];
                       compareValue = compareObj[f];
              }
           }
           this.data[j+1] = currentObj;
        }
        
        return this;
     },
    
     /** 
      * @method
      * copies the contents of a Vector to another Vector returning the new Vector.
      * 
      * @returns {graphiti.util.ArrayList} the new ArrayList
      */
     clone:function() 
     {
        var newVector = new graphiti.util.ArrayList(this.size);
    
        for (var i=0; i<this.size; i++) {
           newVector.add(this.data[i]);
        }
    
        return newVector;
     },
    
     
     /**
      * @method
      * Iterate over the array and call the callback method with the given index and element
      *
      * @param {Function} the callback function to call for each element
      * @return {boolean}
      */
      each:function(func) 
      {
         if(typeof func !== "function"){
             throw "parameter must type of 'function'";
         }
         
         var s= this.getSize();
         for (var i=0; i<s; i++) 
         {
            if(func(i, this.data[i])===false)
                break;
         }
      },
     
     // overwriteElementAt() - overwrites the element with an object at the specific index.
     overwriteElementAt:function(obj, index) 
     {
        this.data[index] = obj;
        
        return this;
     },
    
     getPersistentAttributes:function()
     {
        return {
               data: this.data,
               increment: this.increment,
               size: this.getSize()
               };
     },
     
     /**
      * @method 
      * Read all attributes from the serialized properties and transfer them into the shape.
      * 
      * @param {Object} memento
      * @returns 
      */
     setPersistentAttributes : function(memento)
     {
         this.data = memento.data;
         this.increment = memento.increment;
         this.size = memento.size;
     }
     

});

graphiti.util.ArrayList.EMPTY_LIST = new graphiti.util.ArrayList();


