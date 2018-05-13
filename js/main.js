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
    .controller('main', ['$scope', '$http', '$window', ($scope, $http, $window) => {
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

let appJOIN = angular.module('my-joinAnkiet', ['ngRoute', 'ngCookies'])
    .controller('main', ['$scope', '$http', '$route', '$cookies', '$location',  ($scope, $http, $route, $cookies, $location) => {
        $scope.ankiety = [];
        $scope.joined = false;
        $scope.colors = ['red', 'green', 'yellow', 'blue', 'black', 'white', 'gray', 'indigo', 'khaki'];
        $scope.blocked;
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
                    if($location.path() == ''){
        
                    }else{
                        let tmp = new RegExp('ANKIETANR_', 'i');
                        if($location.path().search(tmp)){
                            tmp = $location.path().split('_');
                            if(tmp[tmp.length - 1]){
                                tmp = parseInt(tmp[tmp.length - 1]);
                                for(let x = 0; x < $scope.ankiety.length; x++){
                                    if($scope.ankiety[x].id == tmp){
                                        $scope.currentAnkiet = $scope.ankiety[x];
                                        $scope.joined = true;
                                        break;
                                    }
        
                                }
                            }
                        }
                    }
                });
                if($cookies.get('id') && $cookies.get('id') != ''){
                    $scope.blocked = $cookies.get('id');
                }else{
                    $scope.blocked = [];
                }
        };
        $scope.start();
        $scope.joinAnkiet = id => {
            $scope.joined = true;
            for(let x = 0; x < $scope.ankiety.length; x++){
                if($scope.ankiety[x].id == id){
                    $scope.currentAnkiet = $scope.ankiety[x];
                    let blocked = false;
                    for(let x = 0; x < $scope.blocked.length; x++){
                        if($scope.blocked == $scope.currentAnkiet.id){
                            blocked = true;
                            break;
                        }
                    }
                    $location.path('ANKIETANR_' + $scope.currentAnkiet.id);
                    if(blocked){
                        $scope.currentAnkiet.blocked = true;
                    }else{
                        $scope.currentAnkiet.blocked = false;
                    }
                    break;
                }
            }
        };  
        $scope.vote = title => {
            for(let x = 0; x < $scope.blocked.length; x++){
                if($scope.blocked[x] == $scope.currentAnkiet.id){
                    $scope.currentAnkiet.blocked = true;
                    return false;
                }
            }
            for(let x = 0; x < $scope.currentAnkiet.options.length; x++){
                if($scope.currentAnkiet.options[x].title == title){
                    $scope.currentAnkiet.options[x].votes++;
                    $http({
                        method: 'POST',
                        url: 'php/updateAnkiet.php',
                        data: $.param({
                            id: $scope.currentAnkiet.id,
                            option: title
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                        .then(response => {
                            switch(response.data){
                                case '0':
                                    for(let x = 0; x < $scope.currentAnkiet.options; x++){
                                        if($scope.currentAnkiet.options[x].title == title){
                                            $scope.currentAnkiet.options[x].votes++;
                                            break;
                                        }
                                    }
                                    break;
                                case '1':
                                    //ERROR
                                    break;
                                default:
                                    console.log(response.data)
                                    break;
                            }
                        });
                    break;
                }
            }
            let tmp = [];
            if($cookies.get('id') && $cookies.get('id') != ''){
                tmp = angular.fromJson($cookies.get('id'));
                tmp.push($scope.currentAnkiet.id);
            }else{
                tmp.push($scope.currentAnkiet.id);
            }

            tmp = angular.toJson(tmp);
            $cookies.put('id', tmp);
            $scope.blocked = $scope.currentAnkiet.id;
            return true;
            
        };
        $scope.back = () => {
            $scope.joined = false;
            $location.path('');
        };
    }]);