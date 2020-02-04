//pie chart
angular.module('MainModule').directive('pieChart', function () {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    link: function (scope) {
      var pieChatVals = [];
      for (var index = 0; index < scope.data.length; index++) {
        pieChatVals.push({
          name: scope.data[index].label,
          y: scope.data[index].value,
          color: "#ffdddd"
        });
      }
      // if (!scope.data) {
      //     return;
      // }
      Highcharts.chart('pieChart1', {
        chart: {
          type: 'pie'
        },
        title: {
          text: 'title'
        },
        legend: {
          enabled: true,
          verticalAlign: 'top',
          align: 'center'
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true,
          style: {
            color: '#fff',

          },
          backgroundColor: '#2b3043',
          borderColor: '#2b3043'
        },
        plotOptions: {

          pie: {
            dataLabels: {
              enabled: false
            },
            showInLegend: true,

          }
        },
        series: [{
          data: pieChatVals
        }]
      });
    }
  };
});

//line charts
angular.module('MainModule').directive('lineChart', function () {

  return {
    restrict: 'E',
    scope: {
      data: '=',
      date: '@',
      target: '@'
    },
    link: function (scope) {
      //console.log(scope.data[0].dateRangeScores[0].date);

      var series = [];
      var data = scope.data.data;
      var d_ar = [];
      for (var i = 0; i < data.length; i++) {
        var n_ar = [];
        for (var d = 0; d < data[i].data.length; d++) {
          var dw = new Date(scope.data.times[d]).toLocaleDateString("yyyymmdd");
          n_ar.push({
            value: data[i].data[d],
            time: dw
          });

        }
        d_ar.push(n_ar)
      }
      for (var i = 0; i < data.length; i++) {
        var xr = [];
        for (var d = 0; d < d_ar[i].length; d++) {
          //xr.push([moment(d_ar[i][d].time).valueOf(), d_ar[i][d].value])
          xr.push([d_ar[i][d].value])
        }
        series.push({
          name: data[i].name,
          data: xr
        })

      }
      Highcharts.chart(scope.target, {
        //title: {
        //    text: 'My custom title'
        //},
        //subtitle: {
        //    text: 'My custom subtitle'
        //},
        xAxis: {
          categories: scope.data.times,
          id: 'x-axis'
        },
        yAxis: {
          title: {
            text: ''
          }
        },
        tooltip: {
          style: {
            color: '#fff',
          },
          backgroundColor: '#2b3043',
          borderColor: '#2b3043'
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
        },
        // series: [{
        //     name: 'Installation',
        //     data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
        //     color: '#7fd7d8'
        // }, {
        //     name: 'Manufacturing',
        //     data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434],
        //     color: '#f59e69'
        // }],
        series: series,
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      });
    }
  };
});

//bar charts
angular.module('MainModule').directive('barChart_', function () {

  return {
    restrict: 'E',
    scope: {
      data: '=',
      kpinames: '='

    },
    link: function (scope, element) {
      var data = scope.data;
      var dates = [];
      var targets = [];
      var actual = [];
      for (var i = 0; i < data.length; i++) {
        dates.push(data[i].date.slice(0, 4));
        targets.push(data[i].target);
        actual.push(data[i].actual);
      }
      // var ind = 0;
      // var items = [];
      // for (var i = 0; i < dates.length; i++) {
      //     items.push([dates[i], scope.kpinames[i]]);
      // }
      Highcharts.chart('barChart1', {
        chart: {
          type: 'column'
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: dates,
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        tooltip: {
          formatter: function () {
            var index = dates.indexOf(this.x);
            var comment = scope.kpinames[index];
            return comment + '<br />' + this.x + '<br />' + this.y;

            // if (i > scope.kpinames.length - 1) {
            //     i = 0;
            // }

            // console.log(items);
            // console.log(ind);
            // ind++;
            // //console.log(scope.kpinames.length);
            // return items[ind] + ' ' + this.x + '<br />' + this.y + '</b > ';
          },
          /*headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
          footerFormat: '</table>',*/
          shared: true,
          useHTML: true,
          style: {
            color: '#fff',

          },
          backgroundColor: '#2b3043',
          borderColor: '#2b3043'
        },
        plotOptions: {
          series: {
            pointPadding: 0,
            groupPadding: 0.4
          }
        },
        series: [{
          name: 'Target',
          data: targets,
          color: '#7fd7d8'

        }, {
          name: 'Actual',
          data: actual,
          color: '#f59e69'
        }],

      });
    }
  }
});

//report bar chart
angular.module('MainModule').directive('barChartReport', function () {

  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    link: function (scope, element) {
      var barChartValsLbl = [];
      var barChartValsVal = [];
      for (var i = 0; i < scope.data.length; i++) {
        barChartValsLbl.push(scope.data[i].label);
        barChartValsVal.push(scope.data[i].value);
      }

      Highcharts.chart('barChartReport', {
        chart: {
          type: 'column'
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: barChartValsLbl,
          crosshair: true
        },
        legend: {
          enabled: false
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true,
          style: {
            color: '#fff',

          },
          backgroundColor: '#2b3043',
          borderColor: '#2b3043'
        },
        plotOptions: {
          series: {
            pointPadding: 0,
            groupPadding: 0.4
          }
        },
        series: [{
          name: barChartValsLbl,
          data: barChartValsVal,
          color: '#ffdddd'

        }],

      });
    }
  }
});

//half charts
angular.module('MainModule').directive('halfChart_', function () {
  var count = 0;
  count++;
  return {
    restrict: 'E',
    scope: {
      title: '@',
      bgColor: '@',
      data: '@',
      score: '@',
      minScore: '@',
      maxScore: '@'
    },
    link: function (scope, element) {


      Highcharts.chart('halfChart-' + count + 1, Highcharts.merge({
        chart: {
          type: 'solidgauge'
        },
        title: null,
        pane: {
          center: ['50%', '85%'],
          size: '140%',
          startAngle: -90,
          endAngle: 90,

          background: {
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
          }
        },
        tooltip: {
          enabled: true
        },
        // the value axis
        yAxis: {

          lineWidth: 0,
          minorTickInterval: null,
          tickAmount: 2,
          title: {
            y: -70
          },
          labels: {
            y: 16
          }
        },
        plotOptions: {
          solidgauge: {
            dataLabels: {
              y: 5,
              borderWidth: 0,
              useHTML: true
            }
          }
        }
      }, {
          yAxis: {
            min: scope.minScore,
            max: scope.maxScore,
            title: {
              text: scope.title
            },
            maxColor: scope.bgColor,
          },

          credits: {
            enabled: false
          },

          series: [{
            name: 'Score',
            data: scope.score,

            dataLabels: {
              format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                '<span style="font-size:12px;color:silver">Score</span></div>'
            }
          }]

        }));
    }
  };
});




var mainModule = angular.module("MainModule");

mainModule.directive('halfChart', function ($timeout) {

  function link(scope, el) {
    //var data = scope.data;
    //var color = d3.scale.category10();
    //var el = el[0];
    //var width = el.clientWidth;
    //var height = el.clientHeight || el.offsetHeight;
    //var min = Math.min(width, height);
    //var pie = d3.layout.pie().sort(null);

    var gaugeOptions = {

      chart: {
        type: 'solidgauge'
      },

      title: null,

      pane: {
        center: ['50%', '85%'],
        size: '100%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      },

      tooltip: {
        enabled: false
      },

      // the value axis
      yAxis: {

        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
          y: -70
        },
        labels: {
          y: 16
        }
      },

      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true
          }
        }
      }
    };

      // The speed gauge
    var scopedata = [];
    scopedata = scope.data.id ? [scope.data] : scope.data;
    var interval = setInterval(function () {
        for (var item in scopedata) {
            var id = scopedata[item].id || scopedata[item].objId || scopedata[item].perId;
        if ($('#' + id).length > 0) {

          var chartSpeed = Highcharts.chart(id, Highcharts.merge(gaugeOptions, {
            yAxis: {
              min: scopedata[item].min,
              max: scopedata[item].target,
              title: {
                text: scopedata[item].name
              },
              maxColor: scopedata[item].bgColor
            },

            credits: {
              enabled: false
            },

            series: [{
              name: 'Speed',
              data: [parseFloat(scopedata[item].score.toFixed(2))],
              dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                  ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                  '<span style="font-size:12px;color:silver"></span></div>'
              },
              tooltip: {
                valueSuffix: ''
              }
            }]

          }));

          clearInterval(interval)
        } else { }

      }
    }, 100)






  }
  return {
    link: link,
    replace: true,
    template: '<div></div>',
    restrict: 'EA',
    scope: {
      data: '=',
      id: '@'
    }
  }
});



mainModule.directive('barChart', function ($timeout) {

  function link(scope, el) {

    var columnOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
        style: {
          color: '#fff',
        },
        backgroundColor: '#2b3043',
        borderColor: '#2b3043'
      },
      plotOptions: {
        series: {
          pointPadding: 0,
          groupPadding: 0.4
        }
      }
    };


    // The speed column
    var scopedata = [];
    scopedata = scope.data.id ? [scope.data] : scope.data;
    var interval = setInterval(function () {

      for (var item in scopedata) {
        var MData = [];
        var id = scopedata[item].objId + scopedata[item].id;

        //var id = scopedata[item].id || scopedata[item].objId || scopedata[item].perId;
        //id = id + "barChart";
        for (var i = 0; i < scopedata[item].measureDatas.length; i++) {
          MData.push(scopedata[item].measureDatas[i]);

        }

        if ($('#' + id).length > 0) {  //and less than 1


          var dates = [];
          var targets = [];
          var actual = [];
          for (var i = 0; i < MData.length; i++) {
            dates.push(MData[i].date.slice(0, 4));
            targets.push(MData[i].target);
            actual.push(MData[i].actual);
          }
          var chartSpeed = Highcharts.chart(id, Highcharts.merge(columnOptions, {
            xAxis: {
              categories: dates,
              crosshair: true
            },
            series: [{
              name: 'Target',
              data: targets,
              color: '#7fd7d8'
            }, {
              name: 'Actual',
              data: actual,
              color: '#f59e69'
            }]
          }));

          clearInterval(interval)
        } else { }

      }
      //console.log("laaaaaaaaaaa" + MData);
    }, 100);
  }
  return {
    link: link,
    replace: true,
    template: '<div></div>',
    restrict: 'EA',
    scope: {
      data: '=',
      id: '@'
    }
  }
});
