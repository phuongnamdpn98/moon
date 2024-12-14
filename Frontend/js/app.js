angular.module("myapp", ['ngRoute', 'ngSanitize'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: "views/home.html?" + Math.random(),
                controller: 'myctrl'
            })
            .when('/products/:maDanhMuc', {
                templateUrl: "views/product.html?" + Math.random(),
                controller: 'productCtrl'
            })
            .when('/blog', {
                templateUrl: "views/blog.html?" + Math.random(),
                controller: 'blogCtrl'
            })
            .when('/blogDetail/:maBaiViet', {
                templateUrl: "views/blog_detail.html?" + Math.random(),
                controller: 'blogDetailCtrl'
            })
            .when('/introduce', {
                templateUrl: "views/introduce.html?" + Math.random()
            })
            .when('/contact', {
                templateUrl: "views/contact.html?" + Math.random(),
                controller: 'contactCtrl'
            })
            .when('/shoppingCart', {
                templateUrl: "views/shopping_cart.html?" + Math.random(),
                controller: 'shoppingCartCtrl'
            })
            .when('/login', {
                templateUrl: "views/login.html?" + Math.random(),
                controller: 'loginCtrl'
            })
            .when('/productDetail/:id', {
                templateUrl: "views/product_detail.html?" + Math.random(),
                controller: 'productDetailCtrl'
            })
            .otherwise({
                template: '<h1> 404 - không tìm thấy trang</h1>'
            })
    })
    .controller("myctrl", function ($scope, $http, $rootScope) {
        $rootScope.Dia_chi_Dich_vu_img = 'http://localhost:8080';
        $rootScope.dsPhongKhach = [];
        $rootScope.dsPhongAn = [];
        $rootScope.dsPhongNgu = [];
        $rootScope.dsPhongLamViec = [];
        $rootScope.dsspRandom = [];
        $rootScope.dsspDetail = [];

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

        loadData().then(() => {
            $rootScope.beginDetail = Math.floor(Math.random() * 80) + 1;
            $rootScope.dsspRandom = $rootScope.dsspDetail
        });

    })
    .controller("productCtrl", function ($scope, $http, $rootScope, $routeParams) {

        const categoryMap = {
            phongKhach: $rootScope.phongKhach,
            phongAn: $rootScope.phongAn,
            phongNgu: $rootScope.phongNgu,
            phongLamViec: $rootScope.phongLamViec
        };

        $rootScope.productListOfCategory = categoryMap[$routeParams.maDanhMuc] || [];

        $scope.limit = 8
        $scope.page = 1

        $scope.total = Math.ceil($rootScope.productListOfCategory.length / $scope.limit)
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
    .controller("productDetailCtrl", function ($scope, $window, $rootScope, $routeParams) {
        $scope.id = $routeParams.id;
        $rootScope.dsspDetail.forEach(x => {
            if (x.ma_so == $scope.id) {
                $scope.spDetail = x;
            }
        });
        $rootScope.cart = [];
        if (localStorage.getItem("carts") != undefined) {

            $rootScope.cart = JSON.parse(localStorage.getItem("carts"));
            $rootScope.soLuongSPCarts = $rootScope.cart.length;
        }

        $rootScope.addToCart = function (sp) {

            if (sp.soluong == null) {
                sp.soluong = 0;
            }
            let inCart = false;
            let quantity = Number(document.getElementById("quantityDetail").value);
            for (let i = 0; i < $rootScope.cart.length; i++) {
                if ($rootScope.cart[i].ma_so == sp.ma_so) {
                    $rootScope.cart[i].soluong += quantity;
                    inCart = true;
                    break;
                }
            }

            if (!inCart) {
                sp.soluong += quantity;
                $rootScope.cart.push(sp);

            }
            localStorage.setItem("carts", JSON.stringify($rootScope.cart))
            console.log($rootScope.cart)
        }

    })
    .controller("shoppingCartCtrl", function ($scope, $rootScope, $window, $routeParams) {
        $rootScope.dsCarts = [];
        $rootScope.dsCarts = JSON.parse(localStorage.getItem("carts"));
        $scope.tongTien = 0;
        $rootScope.dsCarts.forEach(item => {
            $scope.tongTien += item.gia * item.soluong
        })

        $scope.increaseQuantity = function (sp) {
            sp.soluong++;
            $rootScope.dsCarts.forEach(item => {
                $scope.tongTien += item.gia
            })
            $scope.LuuLocalStorage();
        };

        $scope.decreaseQuantity = function (sp) {
            if (sp.soluong > 0) {
                sp.soluong--;
            }
            $rootScope.dsCarts.forEach(item => {
                $scope.tongTien -= item.gia
            })
            $scope.LuuLocalStorage();
        };

        $scope.LuuLocalStorage = function () {
            localStorage.setItem('carts', JSON.stringify($rootScope.dsCarts));
        };

        $scope.deleteCart = function (maso) {
            alertify.set({
                labels: {
                    ok: "Đồng ý xóa",
                    cancel: "hủy bỏ"
                }
            });

            alertify.confirm("Bạn có muốn xóa sản phẩm không!!!", function (e) {
                if (e) {
                    // user clicked "ok"

                    let index = $rootScope.dsCarts.findIndex(x => x.ma_so == maso);
                    //console.log(index)
                    $rootScope.dsCarts.splice(index, 1);

                    if ($rootScope.dsCarts.length > 0) {
                        $scope.LuuLocalStorage();
                    } else {
                        localStorage.removeItem('carts');
                        $window.location.href = '#!'
                    }

                } else {
                    // user clicked "cancel"
                }
            })
        }

        $scope.datHang = function () {

            let maDoHang = Math.floor(Math.random() * 1000) + 1;
            let donHang = {
                "ma_so_don": maDoHang,
                "ho_ten": $scope.fullName,
                "so_dien_thoai": $scope.phone,
                "email": $scope.email,
                "dia_chi": $scope.address,
                "tong_tien": $scope.tongTien,
                "Ngay_Dat_hang": new Date(),
                "danh_sach_san_pham": $rootScope.dsCarts
            }
            alertify.set({
                labels: {
                    ok: "Quay về trang chủ",
                    cancel: "hủy bỏ"
                }
            });

            //console.log(donHang)
            apiDathang(donHang).then(result => {
                //console.log(result);
                alertify.confirm("Đơn đặt hàng thành công...", function (e) {
                    if (e) {
                        // user clicked "ok"
                        localStorage.clear("carts");
                        $window.location.href = "#!";
                        //$window.location.reload();

                    } else {
                        // user clicked "cancel"
                    }
                });

            }).catch(err => {
                console.log(err);
            })
        }
    })
    .controller("loginCtrl", function ($scope, $window) {
        const errorLoginUsername = document.querySelector(`.error-login-username`);
        const errorLoginPass = document.querySelector(`.error-login-password`);

        function showError(element) {
            element.classList.remove(`d-none`);
            element.classList.add(`d-block`);
        }

        function hideError(element){
            element.classList.remove(`d-block`);
            element.classList.add(`d-none`);
        }

        $scope.loginAdmin = function () {
            let nguoidung = {
                "username": $scope.user ? $scope.user.trim() : ``,
                "pass": $scope.pass ? $scope.pass.trim() : ``
            };

            let hasError = false;
            
            if(!nguoidung.username){
                showError(errorLoginUsername);
                hasError = true;
            } else {
                hideError(errorLoginUsername);
            }

            if(!nguoidung.pass){
                showError(errorLoginPass);
                hasError = true;
            }else{
                hideError(errorLoginPass);
            }

            if(hasError) return;

            apiDangnhap(nguoidung).then(result => {
                if (result.Noi_dung) {
                    // Lưu session
                    localStorage.setItem('ADMIN', JSON.stringify(result.Noi_dung));
                    // Chuyển trang
                    $window.location.href = `./admin/dashBoard.html`;
                } else {
                    alertify.alert("Thông tin đăng nhập không hợp lệ");
                }
            }).catch(err => {
                console.log("Error from api: ", err);
            })
        }
    })
    .controller("contactCtrl", function ($scope, $window) {
        CKEDITOR.replace('ndMail', {
            customConfig: "ckcontact.js"
        })

        $scope.guiEmail = function () {
            let ten = $scope.name;
            let email = $scope.name;
            let chuDe = "Khách hàng liên hệ";
            let noidungemail = $scope.ndMail;
            let noidung = CKEDITOR.instances.ndMail.getData();

            let body = `<h3>${ten}</h3>`;
            body += `Email:${email} <hr>`;
            body += `${noidung}`;

            let contact = {
                "subject": chuDe,
                "body": body
            }

            apiLienhe(contact).then(result => {
                console.log(result);
                alertify.confirm("Gử yêu cầu thành công...", function (e) {
                    if (e) {
                        // user clicked "ok"

                        $window.location.href = "#!";
                        $window.location.reload();

                    } else {
                        // user clicked "cancel"
                    }
                });
            }).catch(err => {
                console.log(err);
            })
        }
    })
    .controller("blogCtrl", function ($scope, $rootScope) {
        $rootScope.dsBlog = []
        apiBlog().then(result => {
            localStorage.setItem("blog", JSON.stringify(result))
        })
        $rootScope.dsBlog = JSON.parse(localStorage.getItem("blog"));
    })
    .controller("blogDetailCtrl", function ($scope, $rootScope, $routeParams) {
        $scope.maBaiViet = $routeParams.maBaiViet;
        $scope.blogDetail = {}

        $rootScope.dsBlog = JSON.parse(localStorage.getItem("blog"));
        $rootScope.dsBlog.forEach(x => {
            if (x.ma_so_bai_viet == $scope.maBaiViet) {
                $scope.blogDetail = x;
                //$scope.noidung = JSON.parse(x.noi_dung)
                //$scope.trustedHtml = $sce.trustAsHtml($scope.blogDetail.noi_dung);
            }
        });

    });