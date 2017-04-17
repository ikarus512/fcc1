/* file: app3-directive-chart1.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myApp3')

  .directive('chart1', [function() {
    return {
      restrict: 'E',
      scope: {
        data: '=',
      },

      link: function(scope, element, attrs) {

        // window.onresize = function() {
        //   scope.$apply();
        // };

        function chartInit(selector, data, fullWidth, fullHeight) {

          var titleHeight = 30;
          var noteHeight = 30;
          var width = fullWidth;
          var height = fullHeight - titleHeight - noteHeight;

          var chartAreaSz = {
            left:   Math.floor( width*0.09),
            top:    Math.floor(height*0.03),
            right:  Math.floor( width*(1-0.00)),
            bottom: Math.floor(height*(1-0.14)),
          };

          var formatCurrency = d3.format('$,.2f');
          var formatDate = d3.timeFormat('%Y-%b-%d %H:%M:%S');

          //
          //  container
          //    title
          //    chart
          //      chartArea
          //    note
          //    tooltip
          //
          var container = d3.select(selector)
            .attr('class','chart1-container')
            .style('width', fullWidth+'px')
            .style('height', fullHeight+'px');

          var title = container
          .append('div')
            .attr('class','chart1-title')
            .style('width', fullWidth+'px')
            .style('height',titleHeight+'px')
            .text(data.name);

          var chart = container
          .append('svg')
            .attr('class', 'chart1-chart')
            .attr('width', width)
            .attr('height', height);

          var note = container
          .append('div')
            .attr('class','chart1-note')
            .style('width', fullWidth+'px')
            .style('height', noteHeight+'px')
            .text(data.description);

          var tooltip = container
          .append('div')
            .attr('class','chart1-tooltip');

          var chartArea = chart
          .append('rect')
            .attr('class', 'chart1-chart-area')
            .attr('x', chartAreaSz.left)
            .attr('y', chartAreaSz.top)
            .attr('width', chartAreaSz.right-chartAreaSz.left)
            .attr('height', chartAreaSz.bottom-chartAreaSz.top);



          function chartUpdate(newData) {

            var ny = newData.length - 1;

            var barWidth = Math.ceil((chartAreaSz.right-chartAreaSz.left) / newData.length);

            chart.selectAll('g').remove();

            var x = d3.scaleTime()
              .domain(d3.extent(newData, function(d) { return new Date(d[0]); }))
              .range([chartAreaSz.left, chartAreaSz.right]);

            var y = d3.scaleLinear()
              .domain([
                d3.min(newData, function(d) { return d[1]; }),
                d3.max(newData, function(d) { return d[1]; })
              ])
              .range([chartAreaSz.bottom, chartAreaSz.top]);

            var xAxis = d3.axisBottom(x)
              .tickSize(1,1)
              .tickFormat(d3.timeFormat('%M:%S'));

            chart.append('g')
              .attr('id', 'xAxis')
              .attr('transform', 'translate(0,' + chartAreaSz.bottom + ')' )
              .call(xAxis)
                .selectAll('text')
                .attr('class', 'chart1-axis-x-text')
                .attr('transform', 'translate(-8,0) rotate(-70)' );

            chart.append('g')
              .attr('id', 'verticalGrid')
            .selectAll('line')
            .data(x.ticks(5))
            .enter().append('line')
              .attr('class', 'verticalGrid')
              .attr('x1', function(d){ return Math.floor(x(d));})
              .attr('x2', function(d){ return Math.floor(x(d));})
              .attr('y1', chartAreaSz.top)
              .attr('y2', chartAreaSz.bottom)
              .attr('stroke', 'black')
              .attr('stroke-width', '1px');

            var yAxis = d3.axisLeft(y)
              .ticks(10)
              .tickFormat(d3.format('.0f'))
              .tickSize(1,1);

            chart.append('g')
              .attr('id', 'yAxis')
              .attr('transform', 'translate(' + chartAreaSz.left + ',0)')
              .call(yAxis)
                .selectAll('text')  
                .style('text-anchor', 'end');

            chart.append('g')
              .attr('id', 'horizontalGrid')
            .selectAll('line')
            .data(y.ticks(10))
            .enter().append('line')
              .attr('class', 'horizontalGrid')
              .attr('x1', chartAreaSz.left)
              .attr('x2', chartAreaSz.right)
              .attr('y1', function(d){ return Math.floor(y(d));})
              .attr('y2', function(d){ return Math.floor(y(d));})
              .attr('stroke', 'black')
              .attr('stroke-width', '1px');



            var tooltipWait = 0;

            var lineGen = d3.line()
              .curve(d3.curveLinear)
              .x(function(d) { return x(new Date(d[0])); })
              .y(function(d) { return y(d[1]); });


            var lines = chart
            .append('g')
              .attr('class','chart1-line')
            .append('path')
            .datum(newData)
              .attr('fill', 'none')
              .attr('stroke', 'blue')
              .attr('stroke-linejoin', 'round')
              .attr('stroke-linecap', 'round')
              .attr('stroke-width', 1.5)
              .attr('d', lineGen);


            var points = chart.append('g')
            .selectAll('circle')
            .data(newData)
            .enter().append('circle')
              .attr('cx',function(d,i){ return x(new Date(d[0])); })
              .attr('cy',function(d,i){ return y(d[1]); })
              .attr('r',barWidth/4)
              .attr('fill','blue')

            .on('mouseover', function(d) {
              tooltipWait++;

              var figure = d3.select(this);
              figure.attr('opacity', '0.5');

              tooltip
                .html('<div><b>' + formatCurrency(d[1]) + ' </b><div>'+
                  '<div>' + formatDate(new Date(d[0])) + '</div>')
                .style('left', (d3.event.pageX+20) + 'px')
                .style('top', (d3.event.pageY-60) + 'px')
                .style('display', 'block');
            })

            .on('mouseout', function() {
              var figure = d3.select(this);
              figure.attr('opacity', '1');

              setTimeout( function() {
                tooltipWait--;
                if (tooltipWait === 0) {
                  tooltip.style('display', 'none');
                }
              }, 2*1000);
            });

          } // function chartUpdate(...)

          return chartUpdate;

        } // function chartInit(...)

        var chartUpdate = chartInit( element[0], scope.data, 300, 300);

        scope.$watchCollection('data.data', function(newData, oldData) {

          chartUpdate(newData);

        }); // scope.$watch('data',...)

      } // function link(...)

    };

  }]); // .directive('chart1', ...

})();
