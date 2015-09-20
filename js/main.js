var data = new Firebase('https://radiant-torch-5597.firebaseio.com/');
angular.module('SaudeDeFerro', []);
angular.module('SaudeDeFerro').controller('mainCtrl', function($scope){

  // Add new tasks to the end
  // Do not change the order since it task has a hidden id value
  $scope.tasks=[
    {descr: 'Prato 50% verdura +2', points: 2},
    {descr: 'Ir para academia +2', points: 2},
    {descr: 'Cama < 22:30hs +2', points: 2},
    {descr: 'comer < 500g +2', points: 2},
    {descr: 'Escovar dentes 3x dia +1', points: 1},
    {descr: 'Merendar frutras +2', points: 2},
    {descr: 'Ir de bike para o trabalho +2', points: 2},
    {descr: 'Usar programa do sono +2', points: 2},
    {descr: 'Tomar suco detox +2', points: 2},
    {descr: 'comer > 600g -2', points: -2},
    {descr: 'Merendar carboidrato -2', points: -2},
    {descr: 'Dormir < 7hs -3', points: -3},
    {descr: 'Carboidrato depois 18hs -3', points: -3},
    {descr: 'Beber 600ml de cerveja -2', points: -2},
    {descr: 'Beber durante a semana -10', points: -10},
    {descr: 'Fds inteiro sem beber (sex-dom) +100', points: 100},
    {descr: 'Não beber de segunda a quinta +50', points: 50},
    {descr: 'Não beber por um dia no fds +30', points: 30},
  ];
  $scope.dayOfWeekInput = {};
  $scope.dayOfWeekInput.weekDaysArr = [
      { id: 1, name: 'Segunda' },
      { id: 2, name: 'Terça' },
      { id: 3, name: 'Quarta' },
      { id: 4, name: 'Quinta' },
      { id: 5, name: 'Sexta' },
      { id: 6, name: 'Sábado' },
      { id: 7, name: 'Domingo' },
  ];

  //Initializes the ids for the tasks
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
  $scope.today = new Date();
  $scope.todayDayOfWeek =  ( (($scope.today.getDay() + 6) % 7 ) + 1) ; //monday = 1, sunday = 7
//  $scope.dayOfWeekInput = $scope.todayDayOfWeek;
//  $scope.dayOfWeekInput.weekDays = $scope.dayOfWeekInput.weekDaysArr[$scope.todayDayOfWeek].value;
  $scope.dayOfWeekInput.weekDays = $scope.todayDayOfWeek;
  $scope.amountInput = 1;
  $scope.setWeight = function(){
    week = $scope.registeredWeeks[this.$index] ;
    $scope.weekWeight[week]=parseInt(this.weightInput[week]);
    $scope.saveData();
    console.log($scope.weekWeight);
  };

  $scope.addTask = function(){
   $scope.dayTasks.push({taskId: parseInt($scope.TaskSelector), week: parseInt($scope.weekInput), dayOfWeek: parseInt($scope.dayOfWeekInput.weekDays), points: parseInt($scope.pointsInput) });
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
                      monday: $scope.daySum[week][1],
                      tuesday: $scope.daySum[week][2],
                      wednesday: $scope.daySum[week][3],
                      thursday: $scope.daySum[week][4],
                      friday: $scope.daySum[week][5],
                      saturday: $scope.daySum[week][6],
                      sunday: $scope.daySum[week][7],
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
        // $scope.messages = JSON.stringify(dataSet);
        $scope.renderResults();
      }, function (err){
        alert("Erro carregando dados da nuvem");
      });
  };

  $scope.mainTableMouseOver = function(){
    console.log(event.currentTarget.attributes['data-week'].value);
  }

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
