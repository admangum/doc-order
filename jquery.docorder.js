//	jquery.docorder.js 1.0
//	2012 Adam Mangum

(function($){
	$.fn.docorder = function( options ){
		
		var settings = $.extend({
			'latency': 1000,
			'queries': [],
		}, options),		
		
		//     Debounce function from:
		//	   Underscore.js 1.4.2
		//     http://underscorejs.org
		//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
		//     Underscore may be freely distributed under the MIT license.
		
		debounce = function(func, wait, immediate) {
		    var timeout, result;
		    return function() {
		      var context = this, args = arguments;
		      var later = function() {
		        timeout = null;
		        if (!immediate) result = func.apply(context, args);
		      };
		      var callNow = immediate && !timeout;
		      clearTimeout(timeout);
		      timeout = setTimeout(later, wait);
		      if (callNow) result = func.apply(context, args);
		      return result;
		    };
		  },
		
		move = function( mappings ){
			var map, sibs;
			$.each(mappings, function(){
				map = this;
				map.parent 	= map.parent instanceof jQuery ? map.parent : $(map.parent);
				map.child 	= map.child instanceof jQuery ? map.child : $(map.child);
				sibs 		= map.parent.children();
				if( !map.parent || !map.child )
					return;
				if( map.index === 0 ){
					map.child.prependTo( map.parent );
				}else if( typeof map.index == 'number' && map.index < sibs.length ){
					sibs.eq(map.index).before(map.child);
				}else{
					map.child.appendTo( map.parent );
				}
			});
		},
		
		/**
		*	Cache the location and position of each
		*	child element that will move about the DOM
		*	so that they can be returned to their initial
		*	state whenever none of the media queries apply
		*/
		
		initState = (function(a){
			var state = [], parent, child;
			$.each(settings.queries, function(){
				$.each(this.map, function(){
					child 	= $(this.child);
					parent 	= child.parent();
					if(child.length && parent.length == 1){
						state.push({
							'parent': parent,
							'child'	: child,
							'index'	: child.index(),
						});
					}
				});
			});
			return state;
		})(),
		
		win = this,
		
		onWinResize = debounce(function(){
			var w = win.width();
			move( initState );
			$.each(settings.queries, function(i){
				var q = this;
				/**
				*	Check if the query applies to the current
				*	window width
				*/
				if( (q.min == undefined || q.min <= w) &&
					(q.max == undefined || q.max >= w) ){
					move(q.map);				
				}
			});			
		}, settings.latency);
		
		
		win.resize(onWinResize);
		
		return this;
	};
})(jQuery);