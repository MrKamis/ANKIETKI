let app = angular.module('my-ankietki', [])
    .controller('switcher', ['$scope', '$window', ($scope, $window) => {
        $scope.switchPage = page => {
            switch(page){
                case 'add':
                    $window.open('dodajAnkietke.htm', '_blank');
                    break;
                case 'join':
                    $window.open('dolaczDoAnkietki.htm', '_blank');
                    break;
            }
            return true;
        };  
    }]);
let appADD = angular.module('my-addAnkietki', [])
    .controller('main', ['$scope', '$http', ($scope, $http) => {
        $scope.options = [
            {
                nr: 1,
                placeholder: 'Opcja nr1',
                title: '',
                style: ''
            }
        ];
        $scope.title = '';
        $scope.titleOfAnkieta = '';
        $scope.titleOfAnkietaStyle = '';
        $scope.notification = {
            open: (title, color = 'green') => {
                $scope.notification.turn = true;
                $scope.notification.title = title;
                $scope.notification.color = 'w3-' + color;
            },
            close: () => {
                $scope.notification.turn = false;
            },
            title: '',
            color: 'w3-green',
            turn: false
        };
        $scope.nr = 1;
        $scope.addOption = () => {
            $scope.options.push({
                nr: ++$scope.nr,
                placeholder: 'Opcja nr '+ $scope.nr,
                title: ''
            });
        };
        $scope.checkAnkiet = () => {
            let check = true;
            $scope.titleOfAnkietaStyle = '';
            angular.forEach($scope.options, value => {
                if(/[<>]/.exec(value.title) || value.title == ''){
                    value.style = 'w3-bottombar w3-border-red';
                    check = false
                }else{
                    value.style = '';
                }
            });
            if(check){
                if($scope.titleOfAnkieta == '' || /[<>]/.exec($scope.titleOfAnkieta)){
                    $scope.titleOfAnkietaStyle = 'w3-bottombar w3-border-red';
                    return false;
                }else if($scope.options.length == 1){
                    $scope.notification.open('Ankieta nie może się składać tylko z jednego pola!', 'red');
                    return false;
                }
                return true;
            }else{
                return false;
            }
        };
        $scope.sendAnkiet = () => {
            $scope.block = true;
            if($scope.checkAnkiet()){
                $http({
                    method: 'POST',
                    url: 'php/sendAnkiet.php',
                    data: $.param({
                        options: angular.toJson($scope.options),
                        title: $scope.titleOfAnkieta
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(response => {
                        switch(response.data){
                            case '0':
                                $scope.notification.open('Stworzono ankiete!', 'green');
                                break;
                            case '1':
                                $scope.notification.open('ERROR, spróbuj ponownie później!', 'yellow');
                                $scope.block = false;
                                break;
                            default:
                                console.log(response.data)
                                break;
                        }
                    });
            }else{
                return false;
            };
        };
    }]);

let appJOIN = angular.module('my-joinAnkiet', [])
    .controller('main', ['$scope', '$http', ($scope, $http) => {
        $scope.ankiety = [];
        $scope.joined = false;
        $scope.colors = ['red', 'green', 'yellow', 'blue', 'black', 'white', 'gray', 'indigo', 'khaki'];
        $scope.start = () => {
            $http({
                method: 'GET',
                url: 'php/getAll.php',
            })
                .then(response => {
                    //console.log(response.data);
                    angular.forEach(response.data, value => {
                        $scope.ankiety.push(value);
                    });
                });
        };
        $scope.start();
        $scope.joinAnkiet = id => {
            $scope.joined = true;
            for(let x = 0; x < $scope.ankiety.length; x++){
                if($scope.ankiety[x].id == id){

                    $scope.currentAnkiet = $scope.ankiety[x];
                    break;
                }
            }
        };  
        $scope.vote = title => {
            
        };
        $scope.back = () => {
            $scope.joined = false;
        };
    }]);