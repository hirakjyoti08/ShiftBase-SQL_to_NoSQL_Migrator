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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9986684420772304, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "MySQL Q3 - Aggregation: Orders by Status"], "isController": false}, {"data": [0.0, 500, 1500, "Close All Connections"], "isController": false}, {"data": [1.0, 500, 1500, "Cassandra Q4 - Filter by Return Flag"], "isController": false}, {"data": [1.0, 500, 1500, "Cassandra Q1 - Read Customer by ID"], "isController": false}, {"data": [1.0, 500, 1500, "MySQL Q2 - Read Customer Orders Detail"], "isController": false}, {"data": [1.0, 500, 1500, "MongoDB Q2 - Read Customer Orders Detail"], "isController": false}, {"data": [1.0, 500, 1500, "MySQL Q1 - Read Customer by ID"], "isController": false}, {"data": [1.0, 500, 1500, "Cassandra Q5 - Revenue Aggregation"], "isController": false}, {"data": [1.0, 500, 1500, "MongoDB Q5 - Revenue Aggregation"], "isController": false}, {"data": [1.0, 500, 1500, "MongoDB Q3 - Aggregation: Orders by Status"], "isController": false}, {"data": [1.0, 500, 1500, "Cassandra Q2 - Read Customer Orders Detail"], "isController": false}, {"data": [1.0, 500, 1500, "MongoDB Q4 - Range Query: Customers by Region"], "isController": false}, {"data": [1.0, 500, 1500, "MongoDB Q1 - Read Customer by ID"], "isController": false}, {"data": [1.0, 500, 1500, "MySQL Q5 - Revenue Aggregation"], "isController": false}, {"data": [1.0, 500, 1500, "Cassandra Q3 - Count Customer Orders"], "isController": false}, {"data": [1.0, 500, 1500, "MySQL Q4 - Range Query: Customers by Region"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 751, 0, 0.0, 21.652463382157137, 0, 2096, 2.0, 52.0, 71.0, 202.56000000000085, 109.92388758782201, 24.069721302327284, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MySQL Q3 - Aggregation: Orders by Status", 50, 0, 0.0, 2.54, 0, 19, 2.0, 5.799999999999997, 7.0, 19.0, 69.44444444444444, 6.388346354166667, 0.0], "isController": false}, {"data": ["Close All Connections", 1, 0, 0.0, 2096.0, 2096, 2096, 2096.0, 2096.0, 2096.0, 2096.0, 0.47709923664122134, 0.010716096135496183, 0.0], "isController": false}, {"data": ["Cassandra Q4 - Filter by Return Flag", 50, 0, 0.0, 1.7000000000000004, 0, 16, 1.0, 2.0, 8.849999999999945, 16.0, 105.04201680672269, 6.72515099789916, 0.0], "isController": false}, {"data": ["Cassandra Q1 - Read Customer by ID", 50, 0, 0.0, 10.48, 0, 344, 1.0, 1.8999999999999986, 65.19999999999942, 344.0, 58.27505827505827, 5.507675917832168, 0.0], "isController": false}, {"data": ["MySQL Q2 - Read Customer Orders Detail", 50, 0, 0.0, 3.1599999999999997, 0, 11, 3.0, 5.899999999999999, 7.449999999999996, 11.0, 68.4931506849315, 3.9276541095890414, 0.0], "isController": false}, {"data": ["MongoDB Q2 - Read Customer Orders Detail", 50, 0, 0.0, 60.32000000000001, 29, 292, 41.5, 77.9, 282.9, 292.0, 21.150592216582066, 29.237388959390863, 0.0], "isController": false}, {"data": ["MySQL Q1 - Read Customer by ID", 50, 0, 0.0, 4.2, 0, 180, 1.0, 1.0, 2.0, 180.0, 55.12679162072767, 4.37138230429989, 0.0], "isController": false}, {"data": ["Cassandra Q5 - Revenue Aggregation", 50, 0, 0.0, 3.2400000000000007, 0, 37, 1.0, 3.0, 31.499999999999957, 37.0, 108.45986984815619, 14.32009219088937, 0.0], "isController": false}, {"data": ["MongoDB Q5 - Revenue Aggregation", 50, 0, 0.0, 57.399999999999984, 32, 135, 52.0, 84.29999999999998, 95.84999999999994, 135.0, 23.408239700374533, 13.57403587312734, 0.0], "isController": false}, {"data": ["MongoDB Q3 - Aggregation: Orders by Status", 50, 0, 0.0, 47.84, 31, 175, 40.0, 74.9, 87.44999999999999, 175.0, 23.463162834350072, 2.339442309948381, 0.0], "isController": false}, {"data": ["Cassandra Q2 - Read Customer Orders Detail", 50, 0, 0.0, 2.2600000000000002, 0, 28, 1.0, 2.8999999999999986, 15.099999999999923, 28.0, 97.27626459143968, 12.594616366731517, 0.0], "isController": false}, {"data": ["MongoDB Q4 - Range Query: Customers by Region", 50, 0, 0.0, 48.660000000000004, 28, 82, 45.0, 68.6, 72.89999999999999, 82.0, 23.551577955723033, 1.244737694300518, 0.0], "isController": false}, {"data": ["MongoDB Q1 - Read Customer by ID", 50, 0, 0.0, 33.28000000000001, 1, 427, 19.5, 44.0, 130.19999999999925, 427.0, 18.45018450184502, 2.1106002075645756, 0.0], "isController": false}, {"data": ["MySQL Q5 - Revenue Aggregation", 50, 0, 0.0, 5.18, 2, 18, 5.0, 8.899999999999999, 13.049999999999962, 18.0, 71.94244604316546, 21.9691434352518, 0.0], "isController": false}, {"data": ["Cassandra Q3 - Count Customer Orders", 50, 0, 0.0, 1.3599999999999999, 0, 15, 1.0, 2.0, 7.049999999999962, 15.0, 102.04081632653062, 5.237563775510204, 0.0], "isController": false}, {"data": ["MySQL Q4 - Range Query: Customers by Region", 50, 0, 0.0, 1.68, 0, 11, 1.0, 2.0, 7.349999999999987, 11.0, 71.32667617689016, 3.8435605385164053, 0.0], "isController": false}]}, function(index, item){
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
