/*
 * @author Boris Gallet, Benoit Rospars
 * @subject Master WIC 2016 AI Project
 * @
 *
 * @description
 * The Log save the history of the game
 */

var Log = function () {
  this.history = [];
  this.pawnsChartCanvas = document.getElementById("pawnsChart");
  this.pawnsChart = new Chart(this.pawnsChartCanvas, {
    type: 'line',
    data: {
      labels: ["0"],
      datasets: [
        {
          label: "Number of White Pawns",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(255, 255, 255, 0.4)",
          borderColor: "rgb(200, 200, 200)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgb(200, 200, 200)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgb(255, 255, 255)",
          pointHoverBorderColor: "rgba(200,200,200,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 3,
          pointHitRadius: 10,
          data: [12],
          spanGaps: false
      }, {
          label: "Number of Black Pawns",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          borderColor: "rgb(200, 200, 200)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgb(200, 200, 200)",
          pointBackgroundColor: "#000",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgb(0, 0, 0)",
          pointHoverBorderColor: "rgba(200,200,200,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 3,
          pointHitRadius: 10,
          data: [12],
          spanGaps: false
      }
    ]
    }
  });
  
  this.perfChartCanvas = document.getElementById("perfChart");
  this.perfChart = new Chart(this.perfChartCanvas, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: "White Execution time",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(255, 255, 255, 0.4)",
          borderColor: "rgb(200, 200, 200)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgb(200, 200, 200)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgb(255, 255, 255)",
          pointHoverBorderColor: "rgba(200,200,200,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 3,
          pointHitRadius: 10,
          data: [],
          spanGaps: false
      },{
          label: "Black Execution time",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          borderColor: "rgb(200, 200, 200)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgb(200, 200, 200)",
          pointBackgroundColor: "#000",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgb(0, 0, 0)",
          pointHoverBorderColor: "rgba(200,200,200,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 3,
          pointHitRadius: 10,
          data: [],
          spanGaps: false
      }
    ]
    }
  });
};

Log.prototype.addState = function (state) {
  var id = this.history.push(state);
  this.drawStaticBoard(state.board, id);
  this.updateCharts(state, id);
};

Log.prototype.printHistory = function () {
  for (var i in this.history) {
    console.log(printBoard(this.history[i].board));
  }
};

Log.prototype.clear = function () {
  $('#history').empty();
};

Log.prototype.drawStaticBoard = function (board, id) {
  var historyItem = $('<div class="history-item"><svg class="history-svg" id="history' + id + '"></svg></div>');
  $('#history').prepend(historyItem);

  var historySvg = Snap('#history' + id);

  var offset = parseInt(300 / 10);
  var width = 300 - offset * 2;
  var height = 300 - offset * 2;
  var size = board.length - 1;

  for (var y = 0; y < board.length; y++) {
    for (var x = 0; x < board[y].length; x++) {
      if (board[y][x].pawn) {
        var coordX = x * (width / size) + offset;
        var coordY = y * (height / size) + offset;
        historySvg.circle(coordX, coordY, width / (size * 2.2)).attr({
          strokeWidth: 3,
          stroke: "black",
          fill: board[y][x].pawn,
          strokeLinecap: "round"
        });
      }
    }
  }

  var historyInfos = $('<div class="history-info"></div>');
  historyInfos.html('tour n°' + id);
  historyItem.append(historyInfos);
};

Log.prototype.updateCharts = function (state, id) {
  this.pawnsChart.data.datasets[0].data[id] = state.whitePawns;
  this.pawnsChart.data.datasets[1].data[id] = state.blackPawns;
  this.pawnsChart.data.labels[id] = id % 10 === 0 ? id : "";
  this.pawnsChart.update();
  
  this.perfChart.data.datasets[0].data[id] = state.whiteExecutionTime;
  this.perfChart.data.datasets[1].data[id] = state.blackExecutionTime;
  this.perfChart.data.labels[id] = id % 10 === 0 ? id : "";
  this.perfChart.update();  
};