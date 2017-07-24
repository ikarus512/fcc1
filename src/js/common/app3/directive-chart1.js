/* file: directive-chart1.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('myapp')

    .directive('chart1', [function() {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },

            link: function(scope, element, attrs) {

                var
                  elemWidth = Math.max(200, element[0].getBoundingClientRect().height),
                  elemHeight = Math.max(300, element[0].getBoundingClientRect().height);

                var chartUpdate = chartInit(element[0], scope.data, elemWidth, elemHeight);

                // Automatic update elemWidth on element resize
                scope.$watchGroup([
                  function() { return element[0].getBoundingClientRect().width; }
                ], function(newValues, oldValues) {
                    var x = Number(newValues[0]);
                    if (isFinite(x)) {
                        if (x >= 200) { elemWidth = x; }
                        chartUpdate = chartInit(element[0], scope.data, elemWidth, elemHeight);
                    }
                });

                scope.$watch('data.data', function(newData, oldData) {

                    if (chartUpdate) { chartUpdate(newData); }

                }, true); // scope.$watch('data',...)

                function chartInit(selector, data, fullWidth, fullHeight) {

                    var titleHeight = 40;
                    var noteHeight = 30;
                    var width = fullWidth;
                    var height = fullHeight - titleHeight - noteHeight;

                    var chartAreaSz = {
                        left:   Math.floor(width * 0.1),
                        top:    Math.floor(height * 0.03)  + titleHeight,
                        right:  Math.floor(width * (1 - 0.1)),
                        bottom: Math.floor(height * (1 - 0.14))  + titleHeight
                    };

                    var formatCurrency = d3.format('$,.2f');
                    var formatDate = d3.timeFormat('%Y-%b-%d %H:%M:%S');

                    //
                    //  container
                    //    tooltip
                    //    svg
                    //      title
                    //      chart
                    //      note
                    //
                    var container = d3.select(selector)
                      .attr('class','chart1-container');

                    container.selectAll('*').remove();

                    var tooltip = container
                    .append('div')
                      .attr('class','chart1-tooltip');

                    var svg = container
                    .append('svg')
                      .attr('class', 'chart1-chart')
                      .attr('width', '100%') // ie11
                      .attr('height', fullHeight) // ie11
                      .attr('viewBox', '0 0 ' + fullWidth + ' ' + fullHeight) // chrome
                      .style('min-width', '200px');

                    var chart = svg
                    .append('g')
                      .attr('class', 'chart1-chart');

                    var title = svg
                    .append('text')
                      .attr('class','chart1-title')
                      .attr('x',(fullWidth / 2) + 'px')
                      .attr('y',(titleHeight) + 'px')
                      .attr('text-ancor', 'middle')
                      .text(data.title);

                    var note = svg
                    .append('text')
                      .attr('class','chart1-note')
                      .attr('x',(fullWidth / 2) + 'px')
                      .attr('y',(fullHeight - noteHeight / 2) + 'px')
                      .attr('text-ancor', 'middle')
                      .text(data.note);

                    function chartUpdate(newData) {

                        var ny = newData.x.length - 1;

                        var barWidth = Math.ceil(
                            (chartAreaSz.right - chartAreaSz.left) / newData.x.length
                        );

                        chart.selectAll('g').remove();

                        var x = d3.scaleTime()
                          .domain(d3.extent(newData.x))
                          .range([chartAreaSz.left, chartAreaSz.right]);

                        var stocksArray = [], key;
                        for (key in newData.stocks) { stocksArray.push(newData.stocks[key]); }

                        var y = d3.scaleLinear()
                          .domain([
                            d3.min(stocksArray, function(stock) {
                                return d3.min(stock.values, function(d) { return d.y; });
                            }),
                            d3.max(stocksArray, function(stock) {
                                return d3.max(stock.values, function(d) { return d.y; });
                            })
                          ])
                          .range([chartAreaSz.bottom, chartAreaSz.top]);

                        var z = d3.scaleOrdinal(d3.schemeCategory10)
                          // .domain(Object.keys(newData.stocks)); // Random colors
                          .domain(['stock1', 'stock2', 'stock3', 'stock4', 'stock5']);
                        // ... fix color to name

                        var xAxis = d3.axisBottom(x)
                          .tickSize(1,1)
                          .tickFormat(d3.timeFormat('%M:%S'));

                        chart.append('g')
                          .attr('id', 'xAxis')
                          .attr('transform', 'translate(0,' + chartAreaSz.bottom + ')')
                        .call(xAxis)
                          .selectAll('text')
                          .attr('class', 'chart1-axis-x-text')
                          .attr('transform', 'translate(-8,0) rotate(-70)');

                        chart.append('g')
                          .attr('id', 'verticalGrid')
                        .selectAll('line')
                        .data(x.ticks(5))
                        .enter().append('line')
                          .attr('class', 'vertical-grid-line')
                          .attr('x1', function(d) { return Math.floor(x(d));})
                          .attr('x2', function(d) { return Math.floor(x(d));})
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
                          .attr('class', 'chart1-axis-y-text')
                          .style('text-anchor', 'end');

                        chart.append('g')
                          .attr('id', 'horizontalGrid')
                        .selectAll('line')
                        .data(y.ticks(10))
                        .enter().append('line')
                          .attr('class', 'horizontal-grid-line')
                          .attr('x1', chartAreaSz.left)
                          .attr('x2', chartAreaSz.right)
                          .attr('y1', function(d) { return Math.floor(y(d));})
                          .attr('y2', function(d) { return Math.floor(y(d));})
                          .attr('stroke', 'black')
                          .attr('stroke-width', '1px');

                        var tooltipWait = 0;

                        var lineGen = d3.line()
                          .curve(d3.curveLinear)
                          .x(function(d) { return x(d.x); })
                          .y(function(d) { return y(d.y); });

                        var stock = chart.selectAll('.stock')
                        .data(stocksArray)
                        .enter().append('g')
                          .attr('class', 'stock');

                        stock.append('path')
                          .attr('class', 'chart1-line')
                          .attr('d', function(d) { return lineGen(d.values); })
                          .style('stroke', function(d) { return z(d.id); })
                          .attr('stroke-linejoin', 'round')
                          .attr('stroke-linecap', 'round')
                          .attr('stroke-width', 3)
                          .attr('fill', 'none')

                        .on('mouseover', function(d) {
                            tooltipWait++;

                            var figure = d3.select(this);
                            figure.attr('opacity', '0.5');

                            tooltip
                              .html('<div><b>' + d.id + ' </b><div>')
                              .style('color', z(d.id))
                              .style('left', (d3.event.pageX + 10) + 'px')
                              .style('top', (d3.event.pageY - 20) + 'px')
                              .style('display', 'block');
                        })

                        .on('mouseout', function() {
                            var figure = d3.select(this);
                            figure.attr('opacity', '1');

                            setTimeout(function() {
                                tooltipWait--;
                                if (tooltipWait === 0) {
                                    tooltip.style('display', 'none');
                                }
                            }, 2 * 1000);
                        });

                        // Legend
                        stock.append('text')
                            .attr('class', 'chart1-label')
                        .datum(function(d) {
                            return {id: d.id, value: d.values[d.values.length - 1]};
                        })
                            .attr('x', 10)
                            .attr('transform', function(d) {
                                return 'translate(' + x(d.value.x) + ',' + y(d.value.y) + ')';
                            })
                            .text(function(d) {
                                // do not label initialZeroLine
                                if (d.id !== 'initialZeroLine') { return d.id; }
                            });

                    } // function chartUpdate(...)

                    return chartUpdate;

                } // function chartInit(...)

            } // function link(...)

        };

    }]); // .directive('chart1', ...

})();
