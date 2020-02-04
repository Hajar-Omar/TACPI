/// <reference path="./vendor/angular.min.js" />
/// <reference path="./data.js" />


'use strict';

(function () {
  var countdownInterval;
  var mainModule = angular.module('MainModule');
  var loadController = 0;

  var intervalDuration = 120000;
  var MainController = function (scope, http, timeout, interval, api, $q, $filter, $compile, location) {

    scope.items = [{
      n: 'John',
      cfg: {
        options: opts,
        series: [{
          data: [1, 4, 8, 3, 2]
        }],
        title: ' ',
        xAxis: {
          categories: []
        },
        yAxis: {
          title: ''
        },
      }
    },
    {
      n: 'Mark',
      cfg: {
        options: opts,
        series: [{
          data: [4, 2, 3, 2, 1]
        }],
        title: ' ',
        xAxis: {
          categories: []
        },
        yAxis: {
          title: ''
        },
      }
    },
    {
      n: 'Smith',
      cfg: {
        options: opts,
        series: [{
          data: [1, 4, 3, 2, 6]
        }],
        title: ' ',
        xAxis: {
          categories: []
        },
        yAxis: {
          title: ''
        },
      }
    }
    ];



    var opts = {
      chart: {
        type: 'solidgauge',
        height: 100,
        width: 200
      },
      legend: ''
    };



    scope.dashboardTabsList = dashboardTabsList;


    //set of scope variables
    scope.user = {};
    scope.loginMsg = '';

    //filter vars
    scope.selectedVision = "all";
    scope.selectedPeriod = "all";
    scope.selectedOrganization = "all";
    scope.selectedEmployee = "all";
    scope.checkedTab = "dashboard";
    scope.MeasureType = "all";

    scope.dashboard = function () {
      var dashboard = null;
      switch (scope.checkedTab) {
        case 'dashboard':
          {
            dashboard = "dashboard"
            break;
          }
        case 'KPIdashboard':
          {
            dashboard = "kpi/dashboard"
            break;
          }
        case 'PersDashboard':
          {
            dashboard = "perspective/dashboard"
            break;
          }
        case 'ObjDashboard':
          {
            dashboard = "objective/dashboard"
            break;
          }
        case 'KPIreport':
          {
            dashboard = "kpi/report"
            break;
          }
        default:
          dashboard = "dashboard"
          break;
      }
      return dashboard;
    }



    scope.getLogin = function () {

      var alogin = null;
      alogin = function () {
        return api.getUserLogin(scope.user.name, scope.user.password);
      }

      alogin().then(function (data) {
        timeout(function () {
          if (data == true) {
            //scope.loginMsg = 'login succeeded';
            scope.user.name = '';
            scope.user.password = '';

          } else {
            scope.loginMsg = "Incorrect username/password !";
          }
          location.path('/main');
        }, 0);
      });

    }

    // get filteration data (side bar controls data)
    scope.getDashboardFilter = function () {

      var await = null;
      await = function () {
        return api.getFilterationData();
      }
      await().then(function (data) {
        timeout(function () {

          scope.$apply(function () {
            var frequencyMapData = [],
              visionMapData = [],
              measureEmployeeData = [],
              measureOrganizationData = [];
            scope.filterData = [];
            for (var prop in data.jsonObj.visionMap) {
              visionMapData.push({
                key: prop,
                value: data.jsonObj.visionMap[prop]
              })
            }
            for (var prop in data.jsonObj.frequencyMap) {
              frequencyMapData.push({
                key: prop,
                value: data.jsonObj.frequencyMap[prop]
              })
            }
            for (var prop in data.jsonObj.measureDataEmployeeMap) {
              measureEmployeeData.push({
                key: prop,
                value: data.jsonObj.measureDataEmployeeMap[prop]
              })
            }
            for (var prop in data.jsonObj.measureDataOrganizationMap) {
              measureOrganizationData.push({
                key: prop,
                value: data.jsonObj.measureDataOrganizationMap[prop]
              })
            }
            scope.filterData.push({
              "frequencyMap": frequencyMapData,
              "measureDataEmployeeMap": measureEmployeeData,
              "measureDataOrganizationMap": measureOrganizationData,
              "visionMap": visionMapData
            });


          });
        });
      });

    }

    scope.filterDataList = {
      visionOid: scope.selectedVision,
      frequency: scope.selectedPeriod,
      //startYearDate: scope.startYearDate,
      startYearDate: $('.start-datePicker').val(),
      endYearDate: scope.endYearDate,
      dataFor: "all"
    }

    scope.totalVisionData = [];
    scope.loader = false;

    var getDashboardData = function () {
      scope.loader = true;
      $('.tabsGroupItem input').attr('disabled', true);

      //var form = new FormData();
      //form.append("visionOid", "02ecc0b0-40a2-11e8-8c75-f7aef610b84a");
      //form.append("startYearDate", '2018');
      //form.append("endYearDate", '2016');
      //form.append("startDate", '');
      //form.append("endDate", '');
      //form.append("dataFor", "all");
      //form.append("measureDataOrganizationOid", "all");
      //form.append("measureDataEmployeeOid", "all");
      //form.append("frequency", "6");

      var form = new FormData();
      form.append("visionOid", scope.selectedVision);
      form.append("startYearDate", $('.start-yearPicker').val());
      form.append("endYearDate", $('.end-yearPicker').val());
      form.append("startDate", $('.start-datePicker').val());
      form.append("endDate", $('.end-datePicker').val());
      form.append("dataFor", scope.MeasureType);
      form.append("measureDataOrganizationOid", $('[name="selectedOrganization"]').val());
      form.append("measureDataEmployeeOid", $('[name="selectedEmployee"]').val());

      form.append("frequency", scope.selectedPeriod);

      scope.totalVisionData = [];
      scope.perspectiveSeries = [];
      scope.perspectivesReprt = [];
      scope.perspectivesObjReprt = [];
      scope.perspectivesObjKPIReprt = [];
      scope.perspectivesPieChartsValuesReprt = [];
      scope.perspectivesBarChartsValuesReprt = [];

      scope.errorData = "";
      var await = null;
      await = function () {
        return api.getDashboardVisionData(form, scope.dashboard());
      }
      await().then(function (data) {
        timeout(function () {
          scope.$apply(function () {
            if (data.success === "Y") {

              //kpi reports tab
              if (scope.dashboard() == 'kpi/report') {
                $('.display-msg').hide();
                for (var i = 0; i < data.jsonObj.perspectiveItems.length; i++) {
                  if (data.jsonObj.perspectiveItems[i] != 'undefined') {
                    scope.perspectivesReprt.push(data.jsonObj.perspectiveItems[i]);

                    for (var j = 0; j < data.jsonObj.perspectiveItems[i].objectives.length; j++) {
                      if (data.jsonObj.perspectiveItems[i].objectives != 'undefined') {
                        scope.perspectivesObjReprt.push(data.jsonObj.perspectiveItems[i].objectives[j]);

                        for (var k = 0; k < data.jsonObj.perspectiveItems[i].objectives[j].kpis.length; k++) {
                          if (data.jsonObj.perspectiveItems[i].objectives[j].kpis != 'undefined') {
                            scope.perspectivesObjKPIReprt.push(data.jsonObj.perspectiveItems[i].objectives[j].kpis[k]);

                          }
                        }
                      }
                    }
                  }
                }

                //for perspectives pie chart in KPI report
                for (var indexPerspectives = 0; indexPerspectives < data.jsonObj.perspectivesPieChartValue.length; indexPerspectives++) {
                  if (data.jsonObj.perspectivesPieChartValue != 'undefined') {
                    scope.perspectivesPieChartsValuesReprt.push(data.jsonObj.perspectivesPieChartValue[indexPerspectives]);
                  }
                }

                //for perspectives bar chart in KPI report
                for (var index2 = 0; index2 < data.jsonObj.perspectivesBarChartValue[0].values.length; index2++) {
                  if (data.jsonObj.perspectivesBarChartValue[0].values != 'undefined') {
                    scope.perspectivesBarChartsValuesReprt.push(data.jsonObj.perspectivesBarChartValue[0].values[index2]);
                  }
                }
                console.log(scope.perspectivesPieChartsValuesReprt);
                //img check src in KPI report
                scope.checkSrc = function (imgIcon) {
                  if (imgIcon == '') {
                    return '';
                  } else {
                    var imgSrc = imgIcon.split("/")[2].split("'")[0];
                    return './assets/images/' + imgSrc;
                  }
                }

                //get selected vision
                scope.selectedVisionReport = $('#allVisions option[value="' + scope.selectedVision + '"]').text();

                //different dashborads except KPI report
              } else {


                scope.bulkData = data.jsonObj;
                scope.totalVisionData.push(data.jsonObj.vision);
                scope.dateRange = data.jsonObj.vision.dateRangeScores;
                scope.visionObjectives = [];
                scope.visionKpis = [];
                scope.KPImeasureDatas = [];
                scope.visionKpisname = [];
                for (var i = 0; i < data.jsonObj.vision.perspectives.length; i++) {

                  for (var o = 0; o < data.jsonObj.vision.perspectives[i].objectives.length; o++) {
                    if (data.jsonObj.vision.perspectives[i].objectives[o] != 'undefined') {
                      scope.visionObjectives.push(data.jsonObj.vision.perspectives[i].objectives[o])
                    }

                    for (var k = 0; k < data.jsonObj.vision.perspectives[i].objectives[o].kpis.length; k++) {
                      if (data.jsonObj.vision.perspectives[i].objectives[o].kpis[k] != 'undefined') {
                        scope.visionKpis.push(data.jsonObj.vision.perspectives[i].objectives[o].kpis[k]);



                        // for (var index = 0; index < data.jsonObj.vision.perspectives[i].objectives[o].kpis[k].measureDatas.length; index++) {
                        //   if (data.jsonObj.vision.perspectives[i].objectives[o].kpis[k].measureDatas[index] != 'undefined') {
                        //     scope.KPImeasureDatas.push(data.jsonObj.vision.perspectives[i].objectives[o].kpis[k].measureDatas[index]);
                        //     scope.visionKpisname.push(data.jsonObj.vision.perspectives[i].objectives[o].kpis[k].name);
                        //   }
                        // }

                      }

                    }


                  }


                }

                scope.perspectiveSeries = [{
                  data: data.jsonObj.perspectiveSeries || data.jsonObj.series,
                  times: data.jsonObj.perspectiveCategories || data.jsonObj.categories
                }];
                scope.objectivesSeries = [{
                  data: data.jsonObj.objectiveSeries || data.jsonObj.series,
                  times: data.jsonObj.objectiveCategories || data.jsonObj.categories
                }];
                scope.kpisSeries = [{
                  data: data.jsonObj.kpiSeries || data.jsonObj.series,
                  times: data.jsonObj.kpiCategories || data.jsonObj.categories
                }];
              }
            } else {
              scope.errorData = data;
            }
            scope.loader = false;
            $('.tabsGroupItem input').attr('disabled', false);
          });
        });
      });
    }

    //validation
    scope.validate = function () {
      if (formIsValid) {

        getDashboardData();
        //console.log(scope.checkedTab);
      }
    }

    scope.getDashboardFilter();

    //Date Picker Format
    $('.disabledMType').hide();
    $(".yearPicker").datepicker({
      viewMode: "years",
      minViewMode: "years",
      format: 'yyyy'
    }).on('changeDate', function (ev) {
      scope.startYearDate = $(this).val();
    });
    $(".datePicker").datepicker({
      format: 'yyyy/mm/dd'
    });

$('.datePicker').on('changeDate', function (ev) {
      $(this).datepicker('hide');
    });
    $('.yearPicker').on('changeDate', function (ev) {
      $(this).datepicker('hide');
    });

    //bar and half highCharts tabs
    scope.tab = 1;
    scope.setTab = function (tabId) {
      this.tab = tabId;
    };
    scope.isSet = function (tabId) {
      return this.tab === tabId;
    };






  };

  mainModule.controller('MainController', ['$scope', '$http', '$timeout', '$interval', "$api", '$q', '$filter', '$compile', '$location', MainController]);




}());
