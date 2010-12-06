/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'resize',
{
	init : function( editor )
	{
		var config = editor.config;

		!config.resize_dir && ( config.resize_dir = 'both' );
		( config.resize_maxWidth == undefined ) && ( config.resize_maxWidth = 3000 );
		( config.resize_maxHeight == undefined ) && ( config.resize_maxHeight = 3000 );
		( config.resize_minWidth == undefined ) && ( config.resize_minWidth = 750 );
		( config.resize_minHeight == undefined ) && ( config.resize_minHeight = 250 );

		if ( config.resize_enabled !== false )
		{
			var container = null;
			var origin, startSize;

			function dragHandler( evt )
			{
				var dx = evt.data.$.screenX - origin.x;
				var dy = evt.data.$.screenY - origin.y;
				var internalWidth = startSize.width + dx * ( editor.lang.dir == 'rtl' ? -1 : 1 );
				var internalHeight = startSize.height + dy;

				editor.resize( Math.max( config.resize_minWidth, Math.min( internalWidth, config.resize_maxWidth ) ),
						Math.max( config.resize_minHeight, Math.min( internalHeight, config.resize_maxHeight ) ) );
			}

			function dragEndHandler ( evt )
			{
				CKEDITOR.document.removeListener( 'mousemove', dragHandler );
				CKEDITOR.document.removeListener( 'mouseup', dragEndHandler );

				if ( editor.document )
				{
					editor.document.removeListener( 'mousemove', dragHandler );
					editor.document.removeListener( 'mouseup', dragEndHandler );
				}
			}

			var mouseDownFn = CKEDITOR.tools.addFunction( function( $event )
				{
					if ( !container )
						container = editor.getResizable();

					startSize = { width : container.$.offsetWidth || 0, height : container.$.offsetHeight || 0 };
					origin = { x : $event.screenX, y : $event.screenY };

					config.resize_minWidth > startSize.width && ( config.resize_minWidth = startSize.width );
					config.resize_minHeight > startSize.height && ( config.resize_minHeight = startSize.height );

					CKEDITOR.document.on( 'mousemove', dragHandler );
					CKEDITOR.document.on( 'mouseup', dragEndHandler );

					if ( editor.document )
					{
						editor.document.on( 'mousemove', dragHandler );
						editor.document.on( 'mouseup', dragEndHandler );
					}
				} );

			editor.on( 'themeSpace', function( event )
				{
					if ( event.data.space == 'bottom' )
					{
						event.data.html += '<div class="cke_resizer"' +
							' title="' + CKEDITOR.tools.htmlEncode( editor.lang.resize ) + '"' +
							' onmousedown="CKEDITOR.tools.callFunction(' + mouseDownFn + ', event)"' +
							'></div>';
					}
				}, editor, null, 100 );
		}
	}
} );

/**
 * The minimum editor width, in pixels, when resizing it with the resize handle.
 * Note: It fallbacks to editor's actual width if that's smaller than the default value.
 * @name CKEDITOR.config.resize_minWidth
 * @type Number
 * @default 750
 * @example
 * config.resize_minWidth = 500;
 */

/**
 * The minimum editor height, in pixels, when resizing it with the resize handle.
 * Note: It fallbacks to editor's actual height if that's smaller than the default value.
 * @name CKEDITOR.config.resize_minHeight
 * @type Number
 * @default 250
 * @example
 * config.resize_minHeight = 600;
 */

/**
 * The maximum editor width, in pixels, when resizing it with the resize handle.
 * @name CKEDITOR.config.resize_maxWidth
 * @type Number
 * @default 3000
 * @example
 * config.resize_maxWidth = 750;
 */

/**
 * The maximum editor height, in pixels, when resizing it with the resize handle.
 * @name CKEDITOR.config.resize_maxHeight
 * @type Number
 * @default 3000
 * @example
 * config.resize_maxHeight = 600;
 */

/**
 * Whether to enable the resizing feature. If disabed the resize handler will not be visible.
 * @type Boolean
 * @default true
 * @example
 * config.resize_enabled = false;
 */
CKEDITOR.config.resize_enabled = true;
