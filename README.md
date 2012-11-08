jQuery Document Order
=====================

doc-order is a jQuery plug-in that changes the order of elements on a page according to
the width of the window or viewport. It can be used to extend the possibilities of 
CSS media queries when CSS alone does not yield the desired effect.

Documentation
-------------

Use doc-order by initializing it on the window and passing in an array of queries denoting window widths and parent - child mappings

	$(window).docorder({
		'queries': [
				{
					'max': 480,
					'min': 320,
					'map': [
								{
									'parent': 'div#parent',
									'child': 'div#child',
									'index': 0
								}
						]
				}
			]
		});
		
The <code>max</code> and <code>min</code> parameters indicate the range of viewport widths
for which this query should apply. <code>index</code> indicates the position the
child should occupy among the parent's other children. A value of zero causes the child
to be prepended to the parent, while omitting the parameter results in the child being appended.

In addition to <code>queries</code>, doc-order also accepts a <code>latency</code> parameter (given in milliseconds) 
that controls the length of the delay between the window resize event and the document order
update (debounce). The default value is <code>1000</code>. Lower values may
result in poor performance.

Credits
-------

doc-order implements a debounce function taken from [Underscore.js](http://underscorejs.org) by Jeremy Ashkenas, DocumentCloud Inc.