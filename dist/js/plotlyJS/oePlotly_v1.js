/**
OE Layout helper for Plot.ly JS
https://plot.ly/javascript/reference/
Remove once blueJS is in OE and handling the plot layouts
*/
const oePlotly_v1 = {
	colours: {
		electricBlue: '#63d7d6',
		dark: {
			green: '#65d235',
			red: '#ea2b34',
			greenSeries: ['#65d235', '#A5D712','#02B546'],
			redSeries: ['#ea2b34','#F64A2D','#C92845'],
			yellowSeries: ['#FAD94B','#E8B131','#F1F555'], // BEO
			standard: ['#1451b3', '#175ece', '#1a69e5'],
			varied:  ['#0a83ea', '#18949f', '#781cea','#3f0aea'],
			dual: ['#1472DE','#2E4259'],
		}, 
		light: {
			green: '#418c20',
			red: '#da3e43',
			greenSeries: ['#418c20','#598617','#139149'],
			redSeries: ['#da3e43', '#E64C02', '#E64562'],
			yellowSeries: ['#FCCE14','#E69812','#FCBB21'], // BEO
			standard: ['#0a4198', '#1451b3', '#175ece'],
			varied: ['#0a2aea', '#ea0a8e', '#00b827','#890aea'],
			dual: ['#2126C2','#8FAEC2'],
		}
	},
	
	/**
	* Get color series
	* @param {String} colour name
	* @param {Boolean} dark 
	* @returns {Array} of colour series
	*/
	getColorSeries( colorName, dark ){
		let colorWay = null;
		
		switch( colorName ){
			case "varied": colorWay = dark ?  this.colours.dark.varied : this.colours.light.varied;
			break;	
			case "twoPosNeg": colorWay = dark ?  this.colours.dark.dual : this.colours.light.dual;   // assumes Postive trace is first! 
			break;
			case "rightEye": colorWay = dark ?  this.colours.dark.greenSeries : this.colours.light.greenSeries;
			break; 
			case "leftEye": colorWay = dark ?  this.colours.dark.redSeries : this.colours.light.redSeries;
			break; 
			default: 
				colorWay = dark ? this.colours.dark.standard : this.colours.light.standard;
		}	
		
		return colorWay;
	},
	
	/**
	* Some elements require colour setting to be made
	* in the data (trace) objects. This provides a way to 
	* theme and standardise 
	* @param {String} colour type e.g. "error_y"  for: error_y.color 
	* @param {String} theme - OE Theme setting "dark" || "light"?
	* @returns {String} colour for request element (or "pink" if fails)
	*/
	getColorFor(plotlyElement, dark){
		if( typeof dark === "string" ){
			dark = this.isDarkTheme( dark );
		}
		
		switch(plotlyElement){
			case 'rightEye': return dark ? this.colours.dark.green : this.colours.light.green;
			case 'leftEye': return dark ? this.colours.dark.red : this.colours.light.red;	
			case 'error_y': return dark ? '#5b6c77' : '#7da7cb';
			
			default: 
				return 'pink'; // no match, flag failure to match as pink!
		}
	},
	
	/**
	* Can not just set layout to dark theme bases on oeTheme setting
	* layout may be used in "pro" area (such as patient popup)
	* @param {String} theme
	* @returns {Boolean}
	*/
	isDarkTheme( theme ){
		return theme === "dark" ? true : false;	
	},
	
	/**
	* return settings for "line" style in data
	* @param {Number} optional
	* @returns {Object}
	*/
	dashedLine( n ){
		return {
			dash: "2px,2px",
			width: 2,
		}
	},
	
	/**
	* Build an axis object IN layout lines 
	* @param {Object} customise - overwrite or add to default settings
	* @param {Boolean} dark - use dark theme options?
	*/
	defaultAxis( customise, dark ){
		if( typeof dark === "string" ){
			dark = this.isDarkTheme( dark );
		}
		
		let axisDefaults = {
			// color: '#fff', // override base font
			linecolor: dark ? '#666' : '#999', // axis line colour
			linewidth:1,
			showgrid: true,
			gridcolor: dark ? '#292929' : '#e6e6e6',
			
			tickmode: "auto",
			nticks: 50, // number of ticks
			ticks: "outside",
			ticklen: 3, // px
			tickcolor: dark ? '#666' : '#ccc',
			automargin: true, //  long tick labels automatically grow the figure margins.
			
			mirror: true, //  ( true | "ticks" | false | "all" | "allticks" )
		}
		
		return Object.assign( axisDefaults, customise );
	},
	
	/**
	* set up to show all catorgies or just the ones with data
	* @param {Object} axis
	* @param {Array} categories (for axis)
	* @param {Boolean} all - show all categories (even if they don't have data)
	* @returns {Object} updated axis
	*/
	makeCategoryAxis( axis, categories, all = true){
		axis.type = "category";
		axis.categoryarray = categories;
		if(all) axis.range = [0, categories.length];
		return axis; 
	},
	
	/**
	* Change layout properties
	* Right and Left plot layouts are identical except for titles and colours, so ...
	*/
	changeTitle( layout, newTitle ){
		if( layout.title.text ){
			layout.title.text = newTitle;
		}	
	},
	changeColorSeries( layout, colorSeries, dark ){
		if( typeof dark === "string" ){
			dark = this.isDarkTheme( dark );
		}
		
		layout.colorway = this.getColorSeries( colorSeries, dark );
	},
	
	/**
	* Build Plotly layout: colours and layout based on theme and standardised settings
	* @param {Object} options - quick reminder of 'options':
	* @returns {Object} layout themed for Plot.ly
	* All options...
	{
		theme: "dark",  		// OE Theme  
		colors: 'varied', 		// Optional {String} varied" or "twoPosNeg" or "rightEye" (defaults to "blues")
		plotTitle: false, 		// Optional {String}
		legend: true, 			// Required {Boolean}
		titleX: false, 			// Optional {String}
		titleY: false, 			// Optional {String}
		numTicksX: 20, 			// Required {Number}
		numTicksY: 20, 			// Required	{Number}
		rangeX: false, 			// Optional {Array} e.g. [0, 100]
		rangeY: false, 			// Optional {Array} e.g. [0, 100]
		useCategories: 			// Optional {Object} e.g. {showAll:true, categoryarray:[]}
		y2: false,				// Optional {Object} e.g {title: "y2 title", range: [0, 100], useCategories: {showAll:true, categoryarray:[]}}
		rangeslider: false,		// Optional {Boolean}
		zoom: false, 			// Optional {Boolean}
		subplot: false,			// Optional {Boolean}
		domain: false, 			// Optional {Array} e.g. [0, 0.75] (if subplot)
		spikes: false, 			// Optional {Boolean} 
	}
	*/
	getLayout(options){
		// set up layout colours based on OE theme settings: "dark" or "light"
		const dark = this.isDarkTheme( options.theme );
		
		// build the Plotly layout obj
		let layout = {
			hovermode:'closest', // get single point rather than all of them
			autosize:true, // onResize change chart size
			margin: {
				l:60, // 80 default, if Y axis has a title this will need more
				r:60, // change if y2 axis is added
				t:30, // if there is a title will need upping to 60
				b:80, // allow for xaxis title
				pad:5, // px between plotting area and the axis lines
				autoexpand:true, // auto margin expansion computations
			},
			// Paper = chart area. Set at opacity 0.5 for both, to hide the 'paper' set to: 0
			paper_bgcolor: dark ? 'rgba(30,46,66,0.5)' : 'rgba(255,255,255,0.5)',
			
			// actual plot area
			plot_bgcolor: dark ? 'rgb(10,10,30)' : '#fff',
			
			// base font settings
			font: {
				family: "Roboto, 'Open Sans', verdana, arial, sans-serif",
				size: dark ? 11 : 13,
				color: dark ? '#aaa' : '#333',
			},
			
			// legend?
			showlegend: options.legend,
			// if so, it will be like this:
			legend: {
				font: {
					size: 10
				},
				orientation: 'h', // 'v' || 'h'				
				xanchor:'right',
				yanchor:'top',
				x:1,
				y:1,
			}, 
			
			// default set up for hoverlabels
			hoverlabel: {
				bgcolor: dark ? "#003" : '#fff',
				bordercolor: dark ? '#003' : '#00f',
				font: {
					size:11, // override base font
					color: dark ? this.colours.electricBlue : '#00f',
				}
			},
			
		};
	
		/*
		Colour themes!	
		*/ 
		if(options.colors){
			layout.colorway = this.getColorSeries( options.colors, dark );			
		} else {
			layout.colorway = this.getColorSeries( "default", dark );
		}
		
		/*
		Plot title
		*/
		if(options.plotTitle){
			layout.title = {
				text: options.plotTitle,
				xref: 'paper', //  "container" | "paper" (as in, align too)
				yref: 'container', 
				x: 0, // 0 - 1
				y: 0.96,
				font: {
					size:dark ? 15 : 17,
					// color:'#f00' - can override base font
				}, 		
			};
			// adjust the margin area
			layout.margin.t = 60;
		}
		
		/*
		Axes
		*/
		let axis = this.defaultAxis( {}, dark );
		
		// spikes
		if(options.spikes){
			axis.showspikes = true; 
			axis.spikecolor = dark ? '#0ff' : '#00f';
			axis.spikethickness = dark ? 0.5 : 1;
			axis.spikedash = dark ? "1px,3px" : "2px,3px";
		}

		// set up X & Y axis
		layout.xaxis = Object.assign({},axis); 
		layout.xaxis.nticks = options.numTicksX;
		
		layout.yaxis = Object.assign({},axis); 
		layout.yaxis.nticks = options.numTicksY;
		
		// turn off zoom?
		if(options.zoom === false){
			layout.xaxis.fixedrange = true;
			layout.yaxis.fixedrange = true;
		}
		
		// manually set axes data range
		if(options.rangeX){
			layout.xaxis.range = options.rangeX;
		}
		
		if(options.rangeY){
			layout.yaxis.range = options.rangeY;
		}
		
		// categories (assuming this will only be used for yAxis)
		if(options.useCategories){
			layout.yaxis = this.makeCategoryAxis(
				layout.yaxis,
				options.useCategories.categoryarray,
				options.useCategories.showAll,
			);
		}
		
		// OE data formatting
		if(options.datesOnAxis){
			switch(options.datesOnAxis){
				case "x": layout.xaxis.tickformat = "%e %b %Y";
				break; 
				case "y": layout.yaxis.tickformat = "%e %b %Y";
				break; 
			}	
		}
			
		// add titles to Axes?
		if(options.titleX){
			layout.xaxis.title = {
				text: options.titleX,
				standoff:20, // px offset 
				font: {
					size:dark ? 12 : 13,
				}
			}
		}
		
		if(options.titleY){
			layout.yaxis.title = {
				text: options.titleY,
				standoff: 15, // px offset 
				font: {
					size:dark ? 12 : 13,
				}
			}
			// make space for Y title
			layout.margin.l = 80;
		}
		
		// two Y axes? 
		if(options.y2){
			
			layout.yaxis2 = Object.assign({}, axis);
			layout.yaxis2.nticks = options.numTicksY;
			layout.yaxis2.overlaying = 'y';
			layout.yaxis2.side = 'right';
			layout.yaxis2.showgrid = false;
			
			if(options.y2.range){
				layout.yaxis2.range = options.y2.range; 
			}
			
			// categories
			if(options.y2.useCategories){
				layout.yaxis2 = this.makeCategoryAxis(
					layout.yaxis2,
					options.y2.useCategories.categoryarray,
					options.y2.useCategories.showAll,
				);
			}

			// and need a title as well??
			if(options.y2.title){
				layout.yaxis2.title = {
					text: options.y2.title,
					standoff: 15, // px offset 
					font: {
						size:dark ? 12 : 13,
					}
				}
				// make space for Y title
				layout.margin.r = 80;
			}
		}
		
		/*
		Subplots (2 charts on a single plot)
		*/
		if(options.subplot){
			layout.grid = {
		    	rows: 2,
				columns: 1,
				pattern: 'independent',
			}
			
			layout.yaxis.domain = options.domain;
			if(layout.yaxis2){
				layout.yaxis2.domain = options.domain;
			}
		}
		
		// add range slider
		if(options.rangeslider){
			if(dark){
				// this is a pain.
				// can't find a setting to change the slide cover color!
				// it's set at a black opacity, so to make this usable:
				layout.xaxis.rangeslider = {
					bgcolor: layout.paper_bgcolor,
					borderwidth: 1,
					bordercolor: layout.plot_bgcolor,
					thickness: 0.1, // 0 - 1, default 0.15 (height of area)
				}
			} else {
				// Plot.ly handles this well in 'light' theme mode
				layout.xaxis.rangeslider = {
					thickness: 0.1, // 0 - 1, default 0.15 (height of area)
				}
			}
			// adjust the margin because it looks better:
			layout.margin.b = 40;
		}
		
		// ok, all done
		return layout;
	}, 
	
	
	
	/**
	* Build Regression lines for scatter data
	* @param {Array} values_x 
	* @param {Array} values_y
	* @returns {Object} - {[x],[y]}
	*/
	findRegression(values_x, values_y) {
		// Find Line By Least Squares
	    let sum_x = 0,
	    	sum_y = 0,
			sum_xy = 0,
			sum_xx = 0,
			count = 0,
			x = 0,	// speed up read/write access
			y = 0,
			values_length = values_x.length;
	
		// check we have what we need
	    if (values_length != values_y.length)  throw new Error('The parameters values_x and values_y need to have same size!');
		// nothing!
	    if (values_length === 0) return [ [], [] ];
	
	    /*
	     * Calculate the sum for each of the parts necessary.
	     */
	    for (let v = 0; v < values_length; v++) {
	        x = values_x[v];
	        y = values_y[v];
	        sum_x = sum_x + x;
	        sum_y = sum_y + y;
	        sum_xx = sum_xx + x*x;
	        sum_xy = sum_xy + x*y;
	        count++;
	    }
	
	    /*
	     * Calculate m and b for the formular:
	     * y = x * m + b
	     */
	    const m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
	    const b = (sum_y/count) - (m*sum_x)/count;
	
	    /*
	     * We will make the x and y result line now
	     */
	    let result_values_x = [];
	    let result_values_y = [];
	    
	    for (let v = 0; v < values_length; v++) {
	        x = values_x[v];
	        y = x * m + b;
	        result_values_x.push(parseFloat(Number.parseFloat(x).toFixed(2)));
	        result_values_y.push(parseFloat(Number.parseFloat(y).toFixed(2)));
	    }
	
	    return {x: result_values_x, y: result_values_y};
	}

};