angular.module("myapp", ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: "views/order.html?" + Math.random(),
                controller: 'orderCtrl'

            })
            .when('/products/:maDanhMuc', {
                templateUrl: "views/product.html?" + Math.random(),
                controller: 'productCtrl'
            })
            
            .otherwise({
                template: '<h1> 404 - không tìm thấy trang</h1>'
            })
    })
    .controller("myadctrl", function ($scope, $http, $rootScope, $window) {
        $rootScope.Dia_chi_Dich_vu_img = 'http://localhost:8080';
        $rootScope.dsPhongKhach = [];
        $rootScope.dsPhongAn = [];
        $rootScope.dsPhongNgu = [];
        $rootScope.dsPhongLamViec = [];
        $rootScope.dsspDetail =[];
        $rootScope.dsOrder = [];

        const productType = [
            { key: "phongKhach", api: apiPhongKhach },
            { key: "phongAn", api: apiPhongAn },
            { key: "phongNgu", api: apiPhongNgu },
            { key: "phongLamViec", api: apiPhongLamViec }
        ];

        const loadData = async () => {
            try {
                for (let phong of productType) {
                    const result = await phong.api();
                    localStorage.setItem(phong.key, JSON.stringify(result))
                    $rootScope[phong.key] = result;
                    $rootScope.dsspDetail.push(...result);
                }
            } catch (error) {
                console.error("Error loading data: ", err);
            }
        }
        let admin =JSON.parse(localStorage.getItem("ADMIN"));
        $rootScope.NameAdmin = admin.username

        $scope.dangXuat = function(){
            localStorage.removeItem('ADMIN');
            $window.location.href=`../index.html`
        }
        
    })
    .controller("productCtrl", function ($scope, $http, $rootScope, $routeParams) {

        if ($routeParams.maDanhMuc == "phongKhach") {
            $rootScope.dssp = $rootScope.dsPhongKhach

        } else if ($routeParams.maDanhMuc == "phongAn") {
            //$scope.loaiDanhMuc = "./data/phongBep.json"
            $rootScope.dssp = $rootScope.dsPhongAn;

        } else if ($routeParams.maDanhMuc == "phongNgu") {
            //$scope.loaiDanhMuc = "./data/phongNgu.json"
            $rootScope.dssp = $rootScope.dsPhongNgu;

        } else if ($routeParams.maDanhMuc == "phongLamViec") {
            //$scope.loaiDanhMuc = "./data/phongLamViec.json"
            $rootScope.dssp = $rootScope.dsPhongLamViec;
        }

        $scope.limit = 8
        $scope.page = 1

        $scope.total = Math.ceil($rootScope.dssp.length / $scope.limit)
        console.log($scope.total)
        $scope.pagelist = [];
        for (let i = 1; i <= $scope.total; i++) {
            $scope.pagelist.push(i)
        }


        $scope.changePage = function (trang) {
            $scope.page = trang;
            $scope.limit = 8
            if (trang > $scope.total) {
                $scope.page = 1;
            }

            $scope.start = ($scope.page - 1) * $scope.limit;
        }

       
    })
    .controller("orderCtrl", function ($scope, $http, $rootScope, $routeParams){

    });