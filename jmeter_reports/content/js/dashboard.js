/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9906790945406125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "MySQL Q3 - Aggregation: Orders by Status"], "isController": false}, {"data": [0.0, 500, 1500, "Close All Connections"], "isController": false}, {"data": [1.0, 500, 1500, "Cassandra Q4 - Filter by Return Flag"], "isController": false}, {"data": [0.99, 500, 1500, "Cassandra Q1 - Read Customer by ID"], "isController": false}, {"data": [1.0, 500, 1500, "MySQL Q2 - Read Customer Orders Detail"], "isController": false}, {"data": [0.94, 500, 1500, "MongoDB Q2 - Read Customer Orders Detail"], "isController": false}, {"data": [1.0, 500, 1500, "MySQL Q1 - Read Customer by ID"], "isController": false}, {"data": [1.0, 500, 1500, "Cassandra Q5 - Revenue Aggregation"], "isController": false}, {"data": [1.0, 500, 1500, "MongoDB Q5 - Revenue Aggregation"], "isController": false}, {"data": [1.0, 500, 1500, "MongoDB Q3 - Aggregation: Orders by Status"], "isController": false}, {"data": [1.0, 500, 1500, "Cassandra Q2 - Read Customer Orders Detail"], "isController": false}, {"data": [1.0, 500, 1500, "MongoDB Q4 - Range Query: Customers by Region"], "isController": false}, {"data": [0.95, 500, 1500, "MongoDB Q1 - Read Customer by ID"], "isController": false}, {"data": [1.0, 500, 1500, "MySQL Q5 - Revenue Aggregation"], "isController": false}, {"data": [1.0, 500, 1500, "Cassandra Q3 - Count Customer Orders"], "isController": false}, {"data": [1.0, 500, 1500, "MySQL Q4 - Range Query: Customers by Region"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 751, 0, 0.0, 47.63249001331557, 0, 2109, 12.0, 87.0, 92.0, 975.680000000003, 72.91970094183901, 14.964002117924071, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MySQL Q3 - Aggregation: Orders by Status", 50, 0, 0.0, 6.52, 0, 37, 3.0, 16.0, 19.89999999999999, 37.0, 50.15045135406219, 4.181489781845537, 0.0], "isController": false}, {"data": ["Close All Connections", 1, 0, 0.0, 2109.0, 2109, 2109, 2109.0, 2109.0, 2109.0, 2109.0, 0.474158368895211, 0.010650041488857278, 0.0], "isController": false}, {"data": ["Cassandra Q4 - Filter by Return Flag", 50, 0, 0.0, 4.939999999999999, 0, 29, 3.0, 7.0, 27.449999999999996, 29.0, 157.72870662460568, 10.008995465299684, 0.0], "isController": false}, {"data": ["Cassandra Q1 - Read Customer by ID", 50, 0, 0.0, 22.240000000000016, 1, 527, 2.0, 5.899999999999999, 220.74999999999918, 527.0, 53.763440860215056, 4.982568884408602, 0.0], "isController": false}, {"data": ["MySQL Q2 - Read Customer Orders Detail", 50, 0, 0.0, 16.660000000000004, 0, 78, 10.5, 41.8, 44.449999999999996, 78.0, 48.732943469785575, 2.77073434454191, 0.0], "isController": false}, {"data": ["MongoDB Q2 - Read Customer Orders Detail", 50, 0, 0.0, 182.08000000000007, 49, 1525, 78.5, 210.3999999999998, 1445.7999999999993, 1525.0, 10.460251046025103, 12.31306387290795, 0.0], "isController": false}, {"data": ["MySQL Q1 - Read Customer by ID", 50, 0, 0.0, 14.040000000000001, 0, 290, 3.0, 23.0, 57.599999999999795, 290.0, 37.96507213363706, 2.9971644836750193, 0.0], "isController": false}, {"data": ["Cassandra Q5 - Revenue Aggregation", 50, 0, 0.0, 8.959999999999999, 0, 67, 4.0, 11.599999999999994, 65.0, 67.0, 171.82130584192439, 23.64220897766323, 0.0], "isController": false}, {"data": ["MongoDB Q5 - Revenue Aggregation", 50, 0, 0.0, 83.86, 50, 101, 87.0, 96.0, 96.89999999999999, 101.0, 15.202189115232594, 8.811034413955609, 0.0], "isController": false}, {"data": ["MongoDB Q3 - Aggregation: Orders by Status", 50, 0, 0.0, 73.08000000000001, 49, 99, 75.0, 89.0, 91.89999999999999, 99.0, 15.001500150015001, 1.6393240886588658, 0.0], "isController": false}, {"data": ["Cassandra Q2 - Read Customer Orders Detail", 50, 0, 0.0, 6.500000000000001, 1, 51, 3.0, 8.0, 46.0, 51.0, 123.76237623762376, 15.49205213490099, 0.0], "isController": false}, {"data": ["MongoDB Q4 - Range Query: Customers by Region", 50, 0, 0.0, 82.1, 54, 99, 86.0, 97.0, 98.0, 99.0, 15.033072760072159, 0.8003936785929043, 0.0], "isController": false}, {"data": ["MongoDB Q1 - Read Customer by ID", 50, 0, 0.0, 123.64, 2, 1617, 42.5, 108.59999999999995, 970.6999999999992, 1617.0, 8.904719501335707, 1.0188251335707925, 0.0], "isController": false}, {"data": ["MySQL Q5 - Revenue Aggregation", 50, 0, 0.0, 35.88, 11, 72, 32.5, 63.9, 70.89999999999999, 72.0, 51.38746145940391, 15.678194051901336, 0.0], "isController": false}, {"data": ["Cassandra Q3 - Count Customer Orders", 50, 0, 0.0, 4.92, 1, 38, 3.0, 6.0, 37.0, 38.0, 141.24293785310735, 7.25249382062147, 0.0], "isController": false}, {"data": ["MySQL Q4 - Range Query: Customers by Region", 50, 0, 0.0, 7.84, 0, 32, 4.5, 17.0, 24.499999999999957, 32.0, 51.124744376278116, 2.742962359406953, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 751, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
