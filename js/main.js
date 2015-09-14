var data = new Firebase('https://radiant-torch-5597.firebaseio.com/');
angular.module('SaudeDeFerro', []);
angular.module('SaudeDeFerro').controller('mainCtrl', function($scope){

  $scope.tasks=[
    {descr: 'Prato 50% verdura', points: 2},
    {descr: 'Ir para academia', points: 2},
    {descr: 'Cama < 22:30hs', points: 2},
    {descr: 'comer < 500g', points: 2},
    {descr: 'Escovar dentes 3x dia', points: 1},
    {descr: 'Merendar frutras', points: 2},
    {descr: 'Ir de bike para o trabalho', points: 2},
    {descr: 'Usar programa do sono', points: 2},
    {descr: 'Tomar suco detox', points: 2},
    {descr: 'comer > 600g', points: -2},
    {descr: 'Merendar carboidrato', points: -2},
    {descr: 'Dormir < 7hs', points: -1},
    {descr: 'Carboidrato depois 18hs', points: -3},
    {descr: 'Beber 600ml de cerveja', points: -2}
  ];

  //Initializes the ids
  var id = -1;
  $scope.tasks.forEach(function (element) {
    element.id = ++id;
  });
  $scope.currentWeek = getWeekNumber();
  $scope.weekInput = $scope.currentWeek;
  //{taskId:,  week:, dayOfWeek:, points:}
  $scope.dayTasks = [];
  $scope.daySum = [];
  $scope.weekWeight = [];
  $scope.registeredWeeks = [];

// $scope.daySum[week][dayOfWeek] = points

  $scope.today = new Date();
  $scope.todayDayOfWeek =  ($scope.today.getDay() + 1) % 7;
  $scope.dayOfWeekInput = $scope.todayDayOfWeek;
  $scope.amountInput = 1;


  $scope.setWeight = function(){
    week = $scope.registeredWeeks[this.$index] ;
    $scope.weekWeight[week]=parseInt(this.weightInput[week]);
    $scope.saveData();
    console.log($scope.weekWeight);
  };

  $scope.addTask = function(){
   $scope.dayTasks.push({taskId: parseInt($scope.TaskSelector), week: parseInt($scope.weekInput), dayOfWeek: parseInt($scope.dayOfWeekInput), points: parseInt($scope.pointsInput) });
   $scope.renderResults();
   $scope.saveData();
  };

  $scope.clearData = function(){
    $scope.dayTasks = [];
    $scope.daySum = [];
    $scope.registeredWeeks = [];
  };

  $scope.setPointsInput = function(){
    console.log($scope.TaskSelector);
    $scope.pointsInput = $scope.amountInput * $scope.tasks[$scope.TaskSelector].points;
  };


  $scope.sumWeek = function(week){
    sum = 0;
    for (var i = 1; i <= 7; i++){
      if($scope.daySum[week]!==undefined && $scope.daySum[week][i]!==undefined)
        sum+=$scope.daySum[week][i];
    }
    return sum;
  };


  $scope.renderWeek = function(week){
    $scope.rows.push({week: week,
                      sunday: $scope.daySum[week][1],
                      monday: $scope.daySum[week][2],
                      tuesday: $scope.daySum[week][3],
                      wednesday: $scope.daySum[week][4],
                      thursday: $scope.daySum[week][5],
                      friday: $scope.daySum[week][6],
                      saturday: $scope.daySum[week][7],
                      total: $scope.sumWeek(week),
                      weight: $scope.weekWeight[week]
                    });
  };

  $scope.setDaySum = function(){
    $scope.daySum = [];
    console.log($scope.dayTasks);
    for (var j = 0; j < $scope.dayTasks.length; j++){
      i = $scope.dayTasks[j];
      if($scope.daySum[i.week] === undefined)
        $scope.daySum[i.week]=[];
      if($scope.daySum[i.week][i.dayOfWeek] === undefined)
        $scope.daySum[i.week][i.dayOfWeek]=0;
      $scope.daySum[i.week][i.dayOfWeek]+=i.points;
      console.log($scope.daySum[i.week][i.dayOfWeek]);
     }
    console.log($scope.daySum);
  };

  $scope.setRegisteredWeeks = function(){
    $scope.registeredWeeks = [];
    lastWeek=-1;
    for (var j = 0; j < $scope.dayTasks.length; j++){
      i=$scope.dayTasks[j];
      if(lastWeek!=i.week){
        $scope.registeredWeeks.push(i.week);
      }
      lastWeek=i.week;
    }
  };

  $scope.saveData = function(){
    dataSet={tasks: $scope.dayTasks, weights: $scope.weekWeight};
    data.set(dataSet);
    console.log(dataSet);
  };

  $scope.renderResults = function(){
    $scope.dayTasks.sort(compareDayTask);
    $scope.setDaySum();
    $scope.setRegisteredWeeks();
    $scope.rows = [];
    console.log($scope.registeredWeeks);
    for(var i=0; i < $scope.registeredWeeks.length; ++i){
       $scope.renderWeek($scope.registeredWeeks[i]);
    }
  };

  $scope.loadData = function(){
      data.once("value", function(snapshot) {
        dataSet=snapshot.val();
        $scope.dayTasks = dataSet.tasks;
        $scope.weekWeight = dataSet.weights;
        console.log(dataSet);
        alert("Dados carregados, clique em 'Atualizar tela'");
        $scope.renderResults();
      }, function (err){
        alert("Erro carregando dados da nuvem");
      });
  };

  $scope.loadData();
});

function compareDayTask(a,b) {
  if (a.week < b.week)
    return -1;
  if (a.week > b.week)
    return 1;
  if(a.dayOfWeek < b.dayOfweek)
     return -1;
  if(a.dayOfWeek > b.dayOfweek)
     return 1;
  return 0;
}

function getWeekNumber() {
    // Copy date so don't modify original
    var d = new Date();
    d.setHours(0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return weekNo;
}
