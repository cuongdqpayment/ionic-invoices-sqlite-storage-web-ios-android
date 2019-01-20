webpackJsonp([0],{

/***/ 136:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InvoicePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_in_app_browser__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_apiStorageService__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_apiResourceServices__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_apiSqliteService__ = __webpack_require__(251);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








//bien dinh nghia loai slide page kieu javascript
var slidePage = {
    home: 0,
    create_invoice: 1,
    list_invoice: 2,
    load_pdf: 3,
};
/**
 * tra ve thang ke tiep
 * neu thang 12, quay ve 1 va tang nam len 1
 * @param yyyymm
 */
var getNextMonth = (function (yyyymm) {
    return Number(yyyymm) ? ((Number(yyyymm) + 1).toString().slice(4, 6) !== '13') ? (Number(yyyymm) + 1).toString() : (Number(yyyymm.slice(0, 4)) + 1).toString() + '01' : yyyymm;
});
var InvoicePage = /** @class */ (function () {
    function InvoicePage(navCtrl, formBuilder, platform, inAppBrowser, storage, db, resource, alertCtrl, loadingCtrl, sanitizer) {
        this.navCtrl = navCtrl;
        this.formBuilder = formBuilder;
        this.platform = platform;
        this.inAppBrowser = inAppBrowser;
        this.storage = storage;
        this.db = db;
        this.resource = resource;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.sanitizer = sanitizer;
        this.slideIndex = 0;
        this.isSlidingItemOpen = false;
        this.isMobile = false;
        this.billCycles = [];
        this.jsonInvoices = [];
        this.currentBillCycle = '201901'; //chu kỳ cước hiện tại
        this.currentCustIc = '';
        this.isSearch = false;
        this.searchString = '';
        this.shouldShowCancel = true;
        this.resourceServer = __WEBPACK_IMPORTED_MODULE_5__services_apiStorageService__["a" /* ApiStorageService */].resourceServer;
    }
    InvoicePage.prototype.ngOnInit = function () {
        var table = {
            name: 'TEST',
            cols: [
                {
                    name: 'ID',
                    type: 'INTEGER',
                    option_key: 'PRIMARY KEY AUTOINCREMENT',
                    description: 'Key duy nhat quan ly'
                }
            ]
        };
        this.db.createTable(table)
            .then(function (data) {
            console.log(data);
        })
            .catch(function (err) {
            console.log(err);
        });
        //dang dd/mm/20yy = 
        //let control = new FormControl('01/12/2019',Validators.pattern(/^([0-3]{1})([0-9]{1})\/([0-1]{1})([0-9]{1})\/([2]{1})([0]{1})([0-9]{2})/));
        //console.log(control);
        this.isMobile = (this.platform.platforms()[0] === 'mobile');
        //console.log('Platform is Mobile: ', this.platform.platforms())
        this.slides.lockSwipes(true);
        this.cycleFormGroup = this.formBuilder.group({
            bill_cycle: [new Date().toLocaleString("en-GB").slice(3, 10),
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern("/^([0-9]{2})\/([0-9]{4})/"),
                ]],
            bill_date: [new Date().toLocaleString("en-GB").slice(0, 10),
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})/),
                ]],
            invoice_no: ['1',
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern("^[0-9]*$"),
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(9)
                ]],
        });
        this.getBillCycles();
    };
    InvoicePage.prototype.getBillCycles = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Đang kiểm tra các kỳ hóa đơn đã phát hành...'
        });
        loading.present();
        this.resource.getBillCycle()
            .then(function (data) {
            _this.billCycles = data;
            _this.billCycles.forEach(function (el) {
                //console.log('typeof el.bill_cycle', typeof el.bill_cycle);
                el.bill_cycle_vn = el.bill_cycle.slice(4, 6) + "/" + el.bill_cycle.slice(0, 4);
                el.bill_date_vn = el.bill_date.slice(6, 8) + "/" + el.bill_date.slice(4, 6) + "/" + el.bill_date.slice(0, 4);
            });
            var maxBillCycle = Math.max.apply(Math, _this.billCycles.map(function (o) { return o['bill_cycle']; }));
            if (typeof maxBillCycle == 'number')
                _this.lastBillCycle = _this.billCycles.find(function (x) { return x.bill_cycle === maxBillCycle.toString(); });
            //console.log('lastBillCycle', this.lastBillCycle ); 
            loading.dismiss();
        })
            .catch(function (err) {
            _this.billCycles = [];
            loading.dismiss();
        });
    };
    /**
     * Phat hanh hoa don moi
     */
    InvoicePage.prototype.createInvoices = function () {
        //lay thang hien tai max, add 1
        var newBillCycle;
        if (this.lastBillCycle) {
            var nextBillCycle = getNextMonth(this.lastBillCycle.bill_cycle);
            newBillCycle = {
                bill_cycle_vn: nextBillCycle.slice(4, 6) + "/" + nextBillCycle.slice(0, 4),
                bill_date_vn: new Date().toLocaleString("en-GB").slice(0, 10),
                invoice_no: this.lastBillCycle.invoice_no + 1
            };
        }
        else {
            newBillCycle = {
                bill_cycle_vn: new Date().toLocaleString("en-GB").slice(3, 10),
                bill_date_vn: new Date().toLocaleString("en-GB").slice(0, 10),
                invoice_no: 1
            };
        }
        this.cycleFormGroup = this.formBuilder.group({
            bill_cycle: [newBillCycle.bill_cycle_vn,
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern(/^([0-9]{2})\/([0-9]{4})/),
                ]],
            bill_date: [newBillCycle.bill_date_vn,
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern(/^([0-3]{1})([0-9]{1})\/([0-1]{1})([0-9]{1})\/([2]{1})([0]{1})([0-9]{2})/),
                ]],
            invoice_no: [newBillCycle.invoice_no,
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern("^[0-9]*$"),
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(9)
                ]],
        });
        this.goToSlide(slidePage.create_invoice);
    };
    /**
     * Phat hanh lai hoa don/ ghi lai ngay hoa don
     * Lay danh muc chu ky tao hoa don
     * this.billCycles.lenght>0
     * @param billCycle
     */
    InvoicePage.prototype.editInvoices = function (item, billCycle) {
        this.cycleFormGroup = this.formBuilder.group({
            bill_cycle: [billCycle.bill_cycle_vn,
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern(/^([0-9]{2})\/([0-9]{4})/),
                ]],
            bill_date: [billCycle.bill_date_vn,
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})/),
                ]],
            invoice_no: [billCycle.invoice_no + 1 - billCycle.count_customer,
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern("^[0-9]*$"),
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(9)
                ]],
        });
        this.goToSlide(slidePage.create_invoice);
        this.closeSwipeOptions(item);
    };
    /**
     * Phát hành hóa đơn tháng, ngày phát hành
     */
    InvoicePage.prototype.onSubmitCreateInvoices = function () {
        var _this = this;
        var billCycle = {
            bill_cycle: this.cycleFormGroup.value.bill_cycle.slice(3, 7)
                + this.cycleFormGroup.value.bill_cycle.slice(0, 2),
            bill_date: this.cycleFormGroup.value.bill_date.slice(6, 10)
                + this.cycleFormGroup.value.bill_date.slice(3, 5)
                + this.cycleFormGroup.value.bill_date.slice(0, 2),
            invoice_no: this.cycleFormGroup.value.invoice_no
        };
        //console.log('billCycle OUT',billCycle);
        this.presentConfirm({
            cancel_text: 'Bỏ qua',
            ok_text: 'Đồng ý',
            title: 'Xác nhận phát hành hóa đơn',
            message: 'Tháng: ' + this.cycleFormGroup.value.bill_cycle + '<br>'
                + 'Ngày phát hành: ' + this.cycleFormGroup.value.bill_date + '<br>'
                + 'Với hóa đơn bắt đầu từ số: ' + this.cycleFormGroup.value.invoice_no,
            ok: function (isOK) {
                if (isOK) {
                    _this.callCreateInvoices(billCycle);
                }
            }
        });
    };
    /**
     * Goi API de phat hanh hoa don theo thang
     * @param billCycle
     */
    InvoicePage.prototype.callCreateInvoices = function (billCycle) {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Đang phát hành hóa đơn tháng: '
                + this.cycleFormGroup.value.bill_cycle + '<br>'
                + ' với ngày phát hành: ' + this.cycleFormGroup.value.bill_date + '<br>'
                + ' từ hóa đơn số: ' + this.cycleFormGroup.value.invoice_no
        });
        loading.present();
        this.resource.createInvoices(billCycle)
            .then(function (result) {
            var tmpResult;
            tmpResult = result;
            if (tmpResult && tmpResult.status && tmpResult.data) {
                //console.log('data',tmpResult.data);
                _this.presentAlert({
                    ok_text: 'Xong',
                    title: 'ĐÃ PHÁT HÀNH XONG',
                    message: 'Tháng: ' + (tmpResult.data.bill_cycle ? tmpResult.data.bill_cycle.slice(4, 6) + '/' + tmpResult.data.bill_cycle.slice(0, 4) : '') + '<br>'
                        + 'Ngày phát hành: ' + (tmpResult.data.bill_date ? tmpResult.data.bill_date.slice(6, 8) + '/' + tmpResult.data.bill_date.slice(4, 6) + '/' + tmpResult.data.bill_date.slice(0, 4) : '') + '<br>'
                        + 'Số lượng phát hành: ' + tmpResult.data.count + '<br>'
                        + 'Số hóa đơn lần tiếp theo: ' + tmpResult.data.invoice_no,
                });
                //tro ve home de xem ky cuoc
                _this.getBillCycles(); //goi lay lai cac ky cuoc da 
            }
            _this.goToSlide(slidePage.home);
            loading.dismiss();
        })
            .catch(function (err) {
            console.log('error', err);
            _this.goToSlide(slidePage.home);
            loading.dismiss();
        });
    };
    /**
     * tạo bản in pdf từ máy chủ
     * @param billCycle
     */
    InvoicePage.prototype.createPdfInvoices = function (item, billCycle) {
        //console.log('billCycle', billCycle);
        /* let loading = this.loadingCtrl.create({
          content: 'Đang tạo bản in tháng : ' + billCycle.bill_cycle_vn
        });
        loading.present();
    
        this.resource.createPdfInvoices({
    
        })
        .then(data=>{
    
          console.log('pdf data',data);
          let jsonFileList;
          jsonFileList = data;
    
          this.goToSlide(slidePage.load_pdf);
    
          loading.dismiss();
        })
        .catch(err=>{
          this.presentAlert({
            title:'Lỗi trong lúc tạo bản in',
            message:'Err' + JSON.stringify(err),
            ok_text:'Quay về'
          })
          //this.goToSlide(slidePage.home);
          loading.dismiss();
        }) */
        this.getPdfInvoices(billCycle);
        this.closeSwipeOptions(item);
    };
    InvoicePage.prototype.getPdfInvoices = function (billCycle) {
        //console.log('billCycle', billCycle);
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Đang lấy bản in tháng : ' + billCycle.bill_cycle_vn
        });
        loading.present();
        this.resource.getPdfInvoices(billCycle.bill_cycle) // + '/R000000009?background=yes')
            .then(function (data) {
            var bufferPdf;
            bufferPdf = data;
            var file = new Blob([bufferPdf], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            _this.presentAlert({
                title: 'Tạo bản in thành công',
                message: 'Mở trình duyệt hệ thống để xem file pdf bản in',
                ok_text: 'OK'
            });
            // if (this.isMobile){
            var browser1 = _this.inAppBrowser.create(fileURL, '_blank', 'hideurlbar=no,location=no,toolbarposition=top');
            // }else{
            //const browser2 = this.inAppBrowser.create(fileURL,'_system');
            // }
            // this.pdfLink = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            // this.goToSlide(slidePage.load_pdf);
            loading.dismiss();
        })
            .catch(function (err) {
            _this.presentAlert({
                title: 'Lỗi trong lúc lấy bản in',
                message: 'Err' + JSON.stringify(err),
                ok_text: 'Quay về'
            });
            loading.dismiss();
        });
    };
    /**
     * Lấy danh sách hóa đơn từ máy chủ
     * cho phép xem từng hóa đơn, tìm kiếm hóa đơn để kiểm tra
     * hoăc cho phép in đơn lẻ từng hóa đơn tìm được
     * hoặc in lại bản in lọc theo danh sách tìm được
     * @param billCycle
     */
    InvoicePage.prototype.getInvoices = function (item, billCycle) {
        var _this = this;
        this.goToSlide(slidePage.list_invoice);
        var loading = this.loadingCtrl.create({
            content: 'Đang lấy danh sách chi tiết hóa đơn...'
        });
        loading.present();
        this.resource.getInvoices(billCycle.bill_cycle)
            .then(function (data) {
            _this.jsonInvoices = data;
            loading.dismiss();
        })
            .catch(function (err) {
            _this.jsonInvoices = [];
            loading.dismiss();
        });
        this.closeSwipeOptions(item);
    };
    InvoicePage.prototype.gotoSlideInvoices = function (billCycle) {
        // this.getInvoices(billCycle.bill_cycle)
    };
    /**
     *
     * @param cycleCust = yyyymm/<cust_id>
     */
    InvoicePage.prototype.getInvoicesDetails = function (cycleCust) {
    };
    /**
     * Đi đến slide chi tiết hóa đơn
     * để in đơn lẻ lại hóa đơn
     * @param invoice
     */
    InvoicePage.prototype.gotoSlideInvoicesDetail = function (invoice) {
    };
    /**
     *
     */
    InvoicePage.prototype.createInvoice = function () {
        //alert roi kiem tra dieu kien de tao ky cuoc 
        /* this.resource.createInvoices({
            bill_cycle: '201901',
            bill_date: '20190120',
            invoice_no: 1,
            cust_id: undefined
        })
        .then(data=>{
          console.log(data);
        })
        .catch(err=>{
          console.log(err);
        }) */
    };
    // Su dung slide Pages
    //--------------------------
    /**
     * Thay đổi kiểu bấm nút mở lệnh trên item sliding
     * @param slidingItem
     * @param item
     */
    InvoicePage.prototype.openSwipeOptions = function (slidingItem, item) {
        this.isSlidingItemOpen = true;
        slidingItem.setElementClass("active-sliding", true);
        slidingItem.setElementClass("active-slide", true);
        slidingItem.setElementClass("active-options-right", true);
        item.setElementStyle("transform", "translate3d(-350px, 0px, 0px)");
    };
    /**
     * Thay đổi cách bấm nút đóng lệnh bằng nút trên item sliding
     * @param slidingItem
     */
    InvoicePage.prototype.closeSwipeOptions = function (slidingItem) {
        slidingItem.close();
        slidingItem.setElementClass("active-sliding", false);
        slidingItem.setElementClass("active-slide", false);
        slidingItem.setElementClass("active-options-right", false);
        this.isSlidingItemOpen = false;
    };
    /**
     * Dieu khien slide
     * @param i
     */
    InvoicePage.prototype.goToSlide = function (i) {
        this.slides.lockSwipes(false);
        this.slides.slideTo(i, 500);
        this.slides.lockSwipes(true);
    };
    /**
     * xac dinh slide
     */
    InvoicePage.prototype.slideChanged = function () {
        this.slideIndex = this.slides.getActiveIndex();
    };
    InvoicePage.prototype.goBack = function () {
        if (this.slideIndex > 0)
            this.goToSlide(this.slideIndex - 1);
    };
    //----------- end of sliding
    //Su dung search
    //---------------------
    InvoicePage.prototype.goSearch = function () {
        this.isSearch = true;
    };
    InvoicePage.prototype.searchEnter = function () {
        this.isSearch = false;
    };
    InvoicePage.prototype.onInput = function (e) {
        console.log(this.searchString);
    };
    //----------------
    InvoicePage.prototype.presentConfirm = function (jsonConfirm) {
        var alert = this.alertCtrl.create({
            title: jsonConfirm.title,
            message: jsonConfirm.message,
            buttons: [
                {
                    text: jsonConfirm.cancel_text,
                    role: 'cancel',
                    handler: function () {
                        if (jsonConfirm.ok)
                            jsonConfirm.ok(false);
                    }
                },
                {
                    text: jsonConfirm.ok_text,
                    handler: function () {
                        if (jsonConfirm.ok)
                            jsonConfirm.ok(true);
                    }
                }
            ]
        });
        alert.present();
    };
    InvoicePage.prototype.presentAlert = function (jsonConfirm) {
        var alert = this.alertCtrl.create({
            title: jsonConfirm.title,
            message: jsonConfirm.message,
            buttons: [
                {
                    text: jsonConfirm.ok_text,
                    handler: function () { }
                }
            ]
        });
        alert.present();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Slides */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Slides */])
    ], InvoicePage.prototype, "slides", void 0);
    InvoicePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-invoice',template:/*ion-inline-start:"/Users/cuongdq/IONIC/ionic-invoices/src/pages/invoice/invoice.html"*/'<ion-header>\n  <ion-navbar>\n\n    <ion-buttons *ngIf="!isSearch&&slideIndex>0" start>\n      <button ion-button icon-only color="royal" (click)="goBack()">\n        <ion-icon name="arrow-back"></ion-icon>\n      </button>\n    </ion-buttons>\n    \n    <ion-buttons *ngIf="!isSearch" end>\n        <button ion-button icon-only color="primary" [disabled]="userInfo?false:true">\n            <ion-icon name="contact"></ion-icon>\n        </button>\n    </ion-buttons>\n\n    <ion-buttons *ngIf="!isSearch&&slideIndex===1" end>\n      <button ion-button icon-only color="royal" (click)="goSearch()">\n        <ion-icon name="search"></ion-icon>\n      </button>\n    </ion-buttons>\n\n    <ion-searchbar *ngIf="isSearch" placeholder="Tìm theo mã/tên khách hàng/khu vực/người quản lý hoặc số điện thoại"\n      [(ngModel)]="searchString" [showCancelButton]="shouldShowCancel" (ionInput)="onInput($event)" (keyup.enter)="searchEnter()"\n      (keyup.esc)="searchEnter()" start>\n    </ion-searchbar>\n\n    <ion-title *ngIf="!isSearch">INVOICES - HÓA ĐƠN</ion-title>\n\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <div class="gradient"></div>\n  <ion-slides (ionSlideDidChange)="slideChanged()">\n    <!-- #id=0 - home : Liệt kê các kỳ của hóa đơn-->\n    <ion-slide>\n        \n        <ion-list>\n\n            <ion-toolbar color="primary">\n                <ion-buttons end>\n                  <button ion-button icon-start outline color="light" class="activated" (click)="createInvoices()">\n                    <ion-icon name="contact"></ion-icon>\n                    PHÁT HÀNH MỚI\n                  </button>\n                </ion-buttons>\n                <ion-title class="left">CÁC KỲ HÓA ĐƠN ĐÃ PHÁT HÀNH</ion-title>\n            </ion-toolbar>\n\n            <ion-item-sliding #slidingItem *ngFor="let billCycle of billCycles">\n              <ion-item #item>\n                  <ion-avatar item-start *ngIf="!isMobile">\n                    <button ion-item item-start>\n                        <ion-icon name="calculator" item-start color="danger"></ion-icon>\n                    </button>\n                  </ion-avatar>\n                  <h1>Kỳ tháng: {{billCycle.bill_cycle_vn}}</h1>\n                  <h2>Ngày phát hành: {{billCycle.bill_date_vn}}</h2>\n                  <p>Số lượng khách hàng: {{billCycle.count_customer}}</p>\n                  <ion-note>Số hóa đơn cuối: {{billCycle.invoice_no_min}} - {{billCycle.invoice_no}}</ion-note>\n                 \n                  <ion-avatar item-end *ngIf="!isSlidingItemOpen&&!isMobile">\n                      <button ion-item item-end (click)="openSwipeOptions(slidingItem,item)">\n                          <ion-icon name="arrow-dropleft-circle" item-end color="secondary"></ion-icon>\n                      </button>\n                  </ion-avatar>\n                  \n                  <ion-buttons item-end *ngIf="isSlidingItemOpen&&!isMobile">\n                      <button icon-only color="primary" (click)="closeSwipeOptions(slidingItem)">\n                          <ion-icon name="arrow-dropright-circle" color="primary"></ion-icon> \n                      </button>\n                  </ion-buttons>\n\n              </ion-item>\n    \n              <ion-item-options>\n                <button ion-button color="danger" (click)="editInvoices(slidingItem,billCycle)">\n                  <ion-icon name="calculator" ios="ios-calculator" md="md-calculator"></ion-icon>\n                  Phát hành lại\n                </button>\n                <button ion-button color="primary" (click)="createPdfInvoices(slidingItem,billCycle)">\n                  <ion-icon name="print" ios="ios-print" md="md-print"></ion-icon>\n                  Tạo bản in\n                </button>\n                <button ion-button color="secondary" (click)="getInvoices(slidingItem,billCycle)">\n                  <ion-icon name="list-box" ios="ios-list-box" md="md-list-box"></ion-icon>\n                  Xem danh sách\n                </button>\n              </ion-item-options>\n        \n            </ion-item-sliding>\n\n          </ion-list>\n            \n    </ion-slide>\n\n    <!-- #id=1 - create_invoice : Gọi phát hành/phát hành lại kỳ cước -->\n    <ion-slide>\n        <div class="wrapper">\n            <form class="login-form" (ngSubmit)="onSubmitCreateInvoices()" [formGroup]="cycleFormGroup">\n                <ion-item>\n                    <ion-label floating>Tháng - MM/YYYY(*)</ion-label>\n                    <ion-input  [disabled]="true" type="text" formControlName="bill_cycle"></ion-input>\n                    <ion-label *ngIf="cycleFormGroup.controls.bill_cycle.invalid && cycleFormGroup.controls.bill_cycle.touched">\n                        <span class="error">Vui lòng nhập kỳ phát hành dạng MM/YYYY</span>\n                    </ion-label>\n                </ion-item>\n\n                <ion-item>\n                    <ion-label floating>Ngày phát hành (*)</ion-label>\n                    <ion-input type="text" formControlName="bill_date"></ion-input>\n                    <ion-label *ngIf="cycleFormGroup.controls.bill_date.invalid && cycleFormGroup.controls.bill_date.touched">\n                      <span class="error">Vui lòng nhập ngày phát hành hóa đơn dạng DD/MM/YYYY</span>\n                    </ion-label>  \n                </ion-item>\n\n                <ion-item>\n                    <ion-label floating>Số hóa đơn bắt đầu (*)</ion-label>\n                    <ion-input type="text" formControlName="invoice_no"></ion-input>\n                    <ion-label *ngIf="cycleFormGroup.controls.invoice_no.invalid && cycleFormGroup.controls.invoice_no.touched">\n                        <span class="error">Vui lòng nhập chỉ số hóa đơn bắt đầu</span>\n                    </ion-label>\n                </ion-item>\n\n                <ion-buttons start>\n                    <button ion-button type="submit" icon-end round [disabled]="cycleFormGroup.controls.bill_cycle.invalid || cycleFormGroup.controls.bill_date.invalid || cycleFormGroup.controls.invoice_no.invalid">\n                        Phát hành hóa đơn\n                        <ion-icon name="share-alt"></ion-icon>\n                    </button>\n                </ion-buttons>\n            </form>\n        </div>\n    </ion-slide>\n\n    <!-- #id=2 - list_invoice : Gọi lấy bản phát hành tìm kiếm và phát hành lẻ, bản in lẻ ..  -->\n    <ion-slide>\n\n      <ion-list>\n        <button ion-item *ngFor="let invoice of jsonInvoices" (click)="gotoSlideInvoicesDetail(invoice)">\n            <ion-avatar item-start>\n                <img src={{invoice.image}} *ngIf="invoice.image">\n                <button ion-button icon-only color="primary" round *ngIf="!invoice.image">\n                    <ion-icon name="contact"></ion-icon>\n                </button>\n              </ion-avatar>\n          <h2>{{invoice.full_name}}</h2>\n          <p>{{invoice.address}}</p>\n          <ion-note>{{invoice.sum_charge}} - {{invoice.bill_date}}</ion-note>\n        </button>\n      </ion-list>\n\n    </ion-slide>\n    \n    <!-- #id=3 - load_pdf : Gọi tạo file pdf và hiển thị bản in pdf trong khung -->\n    <ion-slide>\n\n        <iframe *ngIf="pdfLink" [src]="pdfLink" width=100% height=100% frameborder="1" allowfullscreen sandbox="allow-same-origin allow-scripts"></iframe>\n\n    </ion-slide>\n\n\n    <!-- #id=4 -->\n    <!-- #id=5 -->\n    <!-- #id=6 -->\n  </ion-slides>\n\n</ion-content>'/*ion-inline-end:"/Users/cuongdq/IONIC/ionic-invoices/src/pages/invoice/invoice.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_in_app_browser__["a" /* InAppBrowser */],
            __WEBPACK_IMPORTED_MODULE_5__services_apiStorageService__["a" /* ApiStorageService */],
            __WEBPACK_IMPORTED_MODULE_7__services_apiSqliteService__["a" /* ApiSqliteService */],
            __WEBPACK_IMPORTED_MODULE_6__services_apiResourceServices__["a" /* ApiResourceService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__["c" /* DomSanitizer */]])
    ], InvoicePage);
    return InvoicePage;
}());

//# sourceMappingURL=invoice.js.map

/***/ }),

/***/ 137:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RequestInterceptor; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var token;
var RequestInterceptor = /** @class */ (function () {
    function RequestInterceptor() {
    }
    RequestInterceptor.prototype.intercept = function (request, next) {
        if (token) {
            //console.log('request with token interceptor!')
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + token
                }
            });
        }
        return next.handle(request);
    };
    RequestInterceptor.prototype.setRequestToken = function (tk) {
        if (tk) {
            token = tk;
        }
        else {
            token = '';
        }
    };
    RequestInterceptor = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], RequestInterceptor);
    return RequestInterceptor;
}());

//# sourceMappingURL=requestInterceptor.js.map

/***/ }),

/***/ 138:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApiAuthService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__apiStorageService__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__interceptors_requestInterceptor__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(380);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_node_rsa__ = __webpack_require__(381);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_node_rsa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_node_rsa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_jsonwebtoken__ = __webpack_require__(483);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_jsonwebtoken___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_jsonwebtoken__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var ApiAuthService = /** @class */ (function () {
    function ApiAuthService(httpClient, apiStorageService, reqInterceptor) {
        this.httpClient = httpClient;
        this.apiStorageService = apiStorageService;
        this.reqInterceptor = reqInterceptor;
        this.authenticationServer = __WEBPACK_IMPORTED_MODULE_2__apiStorageService__["a" /* ApiStorageService */].authenticationServer;
        this.clientKey = new __WEBPACK_IMPORTED_MODULE_5_node_rsa___default.a({ b: 512 }, { signingScheme: 'pkcs1-sha256' }); //for decrypte
        this.midleKey = new __WEBPACK_IMPORTED_MODULE_5_node_rsa___default.a(null, { signingScheme: 'pkcs1-sha256' }); //for test
        this.serverKey = new __WEBPACK_IMPORTED_MODULE_5_node_rsa___default.a(null, { signingScheme: 'pkcs1-sha256' }); //for crypte
        //key nay de test thu noi bo
        this.midleKey.importKey(this.clientKey.exportKey('public'));
    }
    /**
     * ham nay phai lay sau khi xac thuc token OTP bang dien thoai
     * tranh viec hacker ma hoa du lieu lung tung gui len server
     */
    ApiAuthService.prototype.getServerPublicRSAKey = function () {
        var _this = this;
        //console.log('get Public key');
        if (this.publicKey && this.publicKey.PUBLIC_KEY) {
            //console.log('Public key from in session');
            return (new Promise(function (resolve, reject) {
                try {
                    _this.serverKey.importKey(_this.publicKey.PUBLIC_KEY);
                }
                catch (err) {
                    reject(err); //bao loi khong import key duoc
                }
                resolve(_this.serverKey);
            }));
        }
        else {
            //console.log('get Public key from server');
            return this.httpClient.get(this.authenticationServer + '/key-json')
                .toPromise()
                .then(function (jsonData) {
                _this.publicKey = jsonData;
                //console.log('co tra ve');
                if (_this.publicKey && _this.publicKey.PUBLIC_KEY) {
                    try {
                        _this.serverKey.importKey(_this.publicKey.PUBLIC_KEY);
                    }
                    catch (err) {
                        throw err;
                    }
                    return _this.serverKey;
                }
                else {
                    throw new Error('No PUBLIC_KEY exists!');
                }
            });
        }
    };
    ApiAuthService.prototype.login = function (formData) {
        var _this = this;
        this.reqInterceptor.setRequestToken(null); //login nguoi khac
        return this.httpClient.post(this.authenticationServer + '/login', formData)
            .toPromise()
            .then(function (data) {
            _this.userToken = data;
            _this.reqInterceptor.setRequestToken(_this.userToken.token); //login nguoi khac
            return _this.userToken.token;
        });
    };
    ApiAuthService.prototype.logout = function () {
        var _this = this;
        //xoa bo token luu tru
        this.apiStorageService.deleteToken();
        if (this.userToken && this.userToken.token) {
            //truong hop user co luu tren session thi xoa session di
            this.reqInterceptor.setRequestToken(this.userToken.token); //login nguoi khac
            return this.httpClient.get(this.authenticationServer + '/logout')
                .toPromise()
                .then(function (data) {
                //console.log(data);
                _this.userToken = null; //reset token nay
                _this.reqInterceptor.setRequestToken(null);
                return true; //tra ve nguyen mau data cho noi goi logout xu ly
            })
                .catch(function (err) {
                //xem nhu da logout khong cap luu tru
                //console.log(err);
                _this.reqInterceptor.setRequestToken(null);
                _this.userToken = null; //reset token nay
                return true; //tra ve nguyen mau data cho noi goi logout xu ly
            });
        }
        else {
            return (new Promise(function (resolve, reject) {
                resolve(true);
            }));
        }
    };
    ApiAuthService.prototype.register = function (formData) {
        return this.httpClient.post(this.authenticationServer + '/register', formData)
            .toPromise()
            .then(function (data) {
            console.log(data);
            return true;
        })
            .catch(function (err) {
            console.log(err);
            return false;
        });
    };
    ApiAuthService.prototype.editUser = function (formData) {
        //them token vao truoc khi edit
        this.reqInterceptor.setRequestToken(this.userToken.token);
        return this.httpClient.post(this.authenticationServer + '/edit', formData)
            .toPromise()
            .then(function (data) {
            console.log(data);
            return true;
        })
            .catch(function (err) {
            console.log(err);
            return false;
        });
    };
    //lay thong tin nguoi dung de edit
    ApiAuthService.prototype.getEdit = function () {
        var _this = this;
        if (this.userToken && this.userToken.token) {
            //them token vao truoc khi edit
            this.reqInterceptor.setRequestToken(this.userToken.token);
            return this.httpClient.get(this.authenticationServer + '/get-user')
                .toPromise()
                .then(function (jsonData) {
                _this.userSetting = jsonData;
                return jsonData;
            });
        }
        else {
            return (new Promise(function (resolve, reject) {
                _this.userSetting = null;
                reject({ error: 'No token, please login first' }); //bao loi khong import key duoc
            }));
        }
    };
    //get userInfo from token
    ApiAuthService.prototype.getUserInfo = function () {
        //this.userInfo=null;
        try {
            this.userInfo = __WEBPACK_IMPORTED_MODULE_6_jsonwebtoken___default.a.decode(this.userToken.token);
            //console.log(this.userInfo);
            //chuyen doi duong dan image de truy cap anh dai dien
            if (this.userInfo.image
                &&
                    this.userInfo.image.toLowerCase()
                &&
                    this.userInfo.image.toLowerCase().indexOf('http://') < 0
                &&
                    this.userInfo.image.toLowerCase().indexOf('https://') < 0) {
                //chuyen doi duong dan lay tai nguyen tai he thong
                this.userInfo.image = this.authenticationServer
                    + '/get-avatar/'
                    + this.userInfo.image
                    + '?token=' + this.userToken.token;
                //console.log(this.userInfo.image);
            }
        }
        catch (err) {
            this.userInfo = null;
        }
        return this.userInfo;
    };
    ApiAuthService.prototype.getUserInfoSetting = function () {
        if (this.userSetting.URL_IMAGE
            &&
                this.userSetting.URL_IMAGE.toLowerCase()
            &&
                this.userSetting.URL_IMAGE.toLowerCase().indexOf('http://') < 0
            &&
                this.userSetting.URL_IMAGE.toLowerCase().indexOf('https://') < 0) {
            //chuyen doi duong dan lay tai nguyen tai he thong
            this.userSetting.URL_IMAGE = this.authenticationServer
                + '/get-avatar/'
                + this.userSetting.URL_IMAGE
                + '?token=' + this.userToken.token;
            //console.log(this.userSetting.URL_IMAGE);
        }
        return this.userSetting;
    };
    /**
     * Thiet lap token tu local xem nhu da login
     * @param token
     */
    /* pushToken(token){
        //gan token cho user de xem nhu da login
        this.userToken={token:token};
    } */
    /**
     * Ham nay luu lai token cho phien lam viec sau do
     * dong thoi luu xuong dia token da login thanh cong
     * @param token
     */
    ApiAuthService.prototype.saveToken = function (token) {
        this.apiStorageService.saveToken(token);
        this.userToken = { token: token };
    };
    /**
     * truong hop logout hoac
     * token da het hieu luc,
     * ta se xoa khoi de khong tu dong login duoc nua
     */
    ApiAuthService.prototype.deleteToken = function () {
        this.apiStorageService.deleteToken();
        this.userToken = null;
    };
    /**
     * Gui len server kiem tra token co verify thi tra ve token, khong thi khong ghi
     * @param token
     */
    ApiAuthService.prototype.authorize = function (token) {
        var _this = this;
        return this.httpClient.post(this.authenticationServer + '/authorize-token', JSON.stringify({
            token: token
        }))
            .toPromise()
            .then(function (data) {
            _this.userToken = { token: token };
            return true;
        });
    };
    //send sms
    ApiAuthService.prototype.sendSMS = function (isdn, sms) {
        return this.httpClient.post(this.authenticationServer + '/send-sms', JSON.stringify({
            isdn: isdn,
            sms: sms
        }))
            .toPromise()
            .then(function (data) {
            return data;
        });
    };
    /**
     * yeu cau mot OTP tu phone
     * @param jsonString
     */
    ApiAuthService.prototype.requestIsdn = function (jsonString) {
        //chuyen len bang form co ma hoa
        return this.httpClient.post(this.authenticationServer + '/request-isdn', jsonString)
            .toPromise()
            .then(function (data) {
            return data;
        });
    };
    /**
     * confirm OTP key
     * @param jsonString
     */
    ApiAuthService.prototype.confirmKey = function (jsonString) {
        var _this = this;
        //chuyen di bang form co ma hoa
        return this.httpClient.post(this.authenticationServer + '/confirm-key', jsonString)
            .toPromise()
            .then(function (data) {
            _this.userToken = data;
            if (_this.userToken && _this.userToken.token) {
                _this.reqInterceptor.setRequestToken(_this.userToken.token); //gan token ap dung cho cac phien tiep theo
                return _this.userToken.token;
            }
            else {
                //neu ho nhap so dien thoai nhieu lan sai so spam thi ??
                throw 'Không đúng máy chủ<br>';
            }
        });
    };
    ApiAuthService.prototype.sendUserInfo = function (jsonString) {
        //gui token + userInfo (pass encrypted) --ghi vao csdl
        //tra ket qua cho user
        return true;
    };
    ApiAuthService.prototype.sendImageBase64 = function (jsonString) {
        //gui token + userInfo (pass encrypted) --ghi vao csdl
        //tra ket qua cho user
        return true;
    };
    ApiAuthService.prototype.injectToken = function () {
        this.reqInterceptor.setRequestToken(this.userToken.token);
    };
    ApiAuthService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["b" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_2__apiStorageService__["a" /* ApiStorageService */],
            __WEBPACK_IMPORTED_MODULE_3__interceptors_requestInterceptor__["a" /* RequestInterceptor */]])
    ], ApiAuthService);
    return ApiAuthService;
}());

//# sourceMappingURL=apiAuthService.js.map

/***/ }),

/***/ 165:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 165;

/***/ }),

/***/ 206:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 206;

/***/ }),

/***/ 251:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApiSqliteService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_sqlite__ = __webpack_require__(252);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Supported platforms
 * Android
 * iOS
 * macOS
 * Windows
 */


var ApiSqliteService = /** @class */ (function () {
    function ApiSqliteService(sqlite) {
        this.sqlite = sqlite;
        this.dbName = 'ionic-invoices.db';
        this.init();
    }
    ApiSqliteService.prototype.init = function () {
        var _this = this;
        console.log('ngOnInit()');
        this.sqlite.create({
            name: this.dbName,
            location: 'default'
        })
            .then(function (db) {
            console.log('Connected to database ', db);
            _this.db = db;
        })
            .catch(function (err) {
            console.log('Could not connect to database', err);
        });
    };
    /**
       * Ham chuyen doi mot doi tuong json thanh cau lenh sqlJson
       * su dung de goi lenh db.insert/update/delete/select
       * vi du:
       * convertSqlFromJson(dual_table,{x:null,y:1},['y'])
       * return : {name:dual_table,cols:[{name:x,value:null},{name:y,value:1}],wheres:[name:y,value:1]}
       * Cau lenh tren su dung de:
       *  select x,y from dual_table where y=1;
       * hoac:
       *  update dual_table x=null, y=1 where y=1;
       * hoac
       *  delete
       * hoac
       * insert
       * @param {*} tableName
       * @param {*} obj
       * @param {*} wheres
       */
    ApiSqliteService.prototype.convertSqlFromJson = function (tablename, json, idFields) {
        var jsonInsert = { name: tablename, cols: [], wheres: [] };
        var whereFields = idFields ? idFields : ['cust_id'];
        var _loop_1 = function (key) {
            jsonInsert.cols.push({ name: key, value: json[key] });
            if (whereFields.find(function (x) { return x === key; }))
                jsonInsert.wheres.push({ name: key, value: json[key] });
        };
        for (var key in json) {
            _loop_1(key);
        }
        return jsonInsert;
    };
    /**
   *
   * @param {*} table
   * var table ={
   *              name: 'LOGIN',
   *              cols: [
   *                      {
   *                        name: 'ID',
   *                        type: dataType.integer,
   *                        option_key: 'PRIMARY KEY AUTOINCREMENT',
   *                        description: 'Key duy nhat quan ly'
   *                        }
   *                      ]
   *            }
   */
    ApiSqliteService.prototype.createTable = function (table) {
        var sql = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (';
        var i = 0;
        for (var _i = 0, _a = table.cols; _i < _a.length; _i++) {
            var col = _a[_i];
            if (i++ == 0) {
                sql += col.name + ' ' + col.type + ' ' + col.option_key;
            }
            else {
                sql += ', ' + col.name + ' ' + col.type + ' ' + col.option_key;
            }
        }
        sql += ')';
        return this.runSql(sql);
    };
    //insert
    /**
     *
     * @param {*} insertTable
     * var insertTable={
     *                  name:'tablename',
     *                  cols:[{
     *                        name:'ID',
     *                        value:'1'
     *                        }]
     *                  }
     *
     */
    ApiSqliteService.prototype.insert = function (insertTable) {
        var sql = 'INSERT INTO ' + insertTable.name
            + ' (';
        var i = 0;
        var sqlNames = '';
        var sqlValues = '';
        var params = [];
        for (var _i = 0, _a = insertTable.cols; _i < _a.length; _i++) {
            var col = _a[_i];
            if (col.value != undefined && col.value != null) {
                params.push(col.value);
                if (i++ == 0) {
                    sqlNames += col.name;
                    sqlValues += '?';
                }
                else {
                    sqlNames += ', ' + col.name;
                    sqlValues += ', ?';
                }
            }
        }
        sql += sqlNames + ') VALUES (';
        sql += sqlValues + ')';
        return this.runSql(sql, params);
    };
    //update 
    /**
     *
     * @param {*} updateTable
     *  var updateTable={
     *                  name:'tablename',
     *                  cols:[{
     *                        name:'ID',
     *                        value:'1'
     *                        }]
     *                  wheres:[{
     *                         name:'ID',
     *                         value:'1'
     *                         }]
     *                  }
     */
    ApiSqliteService.prototype.update = function (updateTable) {
        var sql = 'UPDATE ' + updateTable.name + ' SET ';
        var i = 0;
        var params = [];
        for (var _i = 0, _a = updateTable.cols; _i < _a.length; _i++) {
            var col = _a[_i];
            if (col.value != undefined && col.value != null) {
                //neu gia tri khong phai undefined moi duoc thuc thi
                params.push(col.value);
                if (i++ == 0) {
                    sql += col.name + '= ?';
                }
                else {
                    sql += ', ' + col.name + '= ?';
                }
            }
        }
        i = 0;
        for (var _b = 0, _c = updateTable.wheres; _b < _c.length; _b++) {
            var col = _c[_b];
            if (col.value != undefined && col.value != null) {
                params.push(col.value);
                if (i++ == 0) {
                    sql += ' WHERE ' + col.name + '= ?';
                }
                else {
                    sql += ' AND ' + col.name + '= ?';
                }
            }
            else {
                sql += ' WHERE 1=2'; //menh de where sai thi khong cho update Bao toan du lieu
            }
        }
        return this.runSql(sql, params);
    };
    //delete
    /**
     * Ham xoa bang ghi
     * @param {*} id
     */
    ApiSqliteService.prototype.delete = function (deleteTable) {
        var sql = 'DELETE FROM ' + deleteTable.name;
        var i = 0;
        var params = [];
        for (var _i = 0, _a = deleteTable.wheres; _i < _a.length; _i++) {
            var col = _a[_i];
            if (col.value != undefined && col.value != null) {
                params.push(col.value);
                if (i++ == 0) {
                    sql += ' WHERE ' + col.name + '= ?';
                }
                else {
                    sql += ' AND ' + col.name + '= ?';
                }
            }
            else {
                sql += ' WHERE 1=2'; //dam bao khong bi xoa toan bo so lieu khi khai bao sai
            }
        }
        return this.runSql(sql, params);
    };
    //
    /**
     *lenh select, update, delete su dung keu json
     * @param {*} selectTable
     */
    ApiSqliteService.prototype.select = function (selectTable) {
        var sql = 'SELECT * FROM ' + selectTable.name;
        var i = 0;
        var params = [];
        var sqlNames = '';
        for (var _i = 0, _a = selectTable.cols; _i < _a.length; _i++) {
            var col = _a[_i];
            if (i++ == 0) {
                sqlNames += col.name;
            }
            else {
                sqlNames += ', ' + col.name;
            }
        }
        sql = 'SELECT ' + sqlNames + ' FROM ' + selectTable.name;
        i = 0;
        if (selectTable.wheres) {
            for (var _b = 0, _c = selectTable.wheres; _b < _c.length; _b++) {
                var col = _c[_b];
                if (col.value != undefined && col.value != null) {
                    params.push(col.value);
                    if (i++ == 0) {
                        sql += ' WHERE ' + col.name + '= ?';
                    }
                    else {
                        sql += ' AND ' + col.name + '= ?';
                    }
                }
            }
        }
        //console.log(sql);
        //console.log(params);
        return this.getRst(sql, params);
    };
    //lay 1 bang ghi dau tien cua select
    /**
     * lay 1 bang ghi
     * @param {*} sql
     * @param {*} params
     */
    ApiSqliteService.prototype.getRst = function (sql, params) {
        if (params === void 0) { params = []; }
        return this.runSql(sql, params)
            .then(function (data) {
            return data;
        })
            .catch(function (err) {
            console.log('execute sql', sql, err);
            throw err;
        });
    };
    /**
     * Lay tat ca cac bang ghi
     * @param {*} sql
     * @param {*} params
     */
    ApiSqliteService.prototype.getRsts = function (sql, params) {
        if (params === void 0) { params = []; }
        return this.runSql(sql, params)
            .then(function (data) {
            return data;
        })
            .catch(function (err) {
            console.log('execute sql', sql, err);
            throw err;
        });
    };
    //cac ham va thu tuc duoc viet duoi nay
    /**
     * Ham thuc thi lenh sql va cac tham so
     * @param {*} sql
     * @param {*} params
     */
    ApiSqliteService.prototype.runSql = function (sql, params) {
        if (params === void 0) { params = []; }
        if (this.db)
            return this.db.executeSql(sql, params);
        return new Promise(function (resolve, reject) {
            reject('No Database init()!');
        });
    };
    ApiSqliteService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__ionic_native_sqlite__["a" /* SQLite */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ionic_native_sqlite__["a" /* SQLite */]) === "function" && _a || Object])
    ], ApiSqliteService);
    return ApiSqliteService;
    var _a;
}());

//# sourceMappingURL=apiSqliteService.js.map

/***/ }),

/***/ 298:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApiImageService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ApiImageService = /** @class */ (function () {
    function ApiImageService() {
    }
    //dua vao doi tuong file image
    //tra ve doi tuong file image co kich co nho hon
    ApiImageService.prototype.resizeImage = function (filename, file, newSize) {
        return new Promise(function (resolve, reject) {
            try {
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                var maxW = newSize;
                var maxH = newSize;
                var img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.onload = function () {
                    var iw = img.width;
                    var ih = img.height;
                    var scale = Math.min((maxW / iw), (maxH / ih));
                    var iwScaled = iw * scale;
                    var ihScaled = ih * scale;
                    canvas.width = iwScaled;
                    canvas.height = ihScaled;
                    context.drawImage(img, 0, 0, iwScaled, ihScaled);
                    //image.src=canvas.toDataURL(); //gan canvas cho image viewer
                    //xu ly chat luong anh qua cac tham so cua ham toDataURL()
                    //chuyen sang file de ghi xuong dia hoac truyen tren mang
                    //su dung ham toBlob sau
                    canvas.toBlob(function (blob) {
                        var reader = new FileReader();
                        reader.readAsArrayBuffer(blob); //ket qua la mot mang Uint8Array 
                        reader.onload = function () {
                            //console.log(reader.result); //ket qua la mot mang Uint8Array 
                            //newFile la mot file image da duoc resize roi nhe
                            resolve({
                                imageViewer: canvas.toDataURL(),
                                file: new Blob([reader.result], { type: 'image/png' }),
                                name: filename
                            });
                        };
                    });
                };
            }
            catch (err) {
                reject(err);
            }
        });
    };
    ApiImageService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], ApiImageService);
    return ApiImageService;
}());

//# sourceMappingURL=apiImageService.js.map

/***/ }),

/***/ 299:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__customer_customer__ = __webpack_require__(300);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__invoice_invoice__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__report_report__ = __webpack_require__(301);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TabsPage = /** @class */ (function () {
    function TabsPage() {
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_1__customer_customer__["a" /* CustomerPage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_2__invoice_invoice__["a" /* InvoicePage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_3__report_report__["a" /* ReportPage */];
    }
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/cuongdq/IONIC/ionic-invoices/src/pages/tabs/tabs.html"*/'<ion-tabs>\n  <ion-tab [root]="tab1Root" tabTitle="Khách hàng" tabIcon="contacts"></ion-tab>\n  <ion-tab [root]="tab2Root" tabTitle="Hóa đơn" tabIcon="list-box"></ion-tab>\n  <ion-tab [root]="tab3Root" tabTitle="Báo cáo" tabIcon="document"></ion-tab>\n</ion-tabs>\n'/*ion-inline-end:"/Users/cuongdq/IONIC/ionic-invoices/src/pages/tabs/tabs.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 300:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomerPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_apiAuthService__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_apiStorageService__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_apiResourceServices__ = __webpack_require__(78);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var CustomerPage = /** @class */ (function () {
    function CustomerPage(navCtrl, formBuilder, auth, storage, resource, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.formBuilder = formBuilder;
        this.auth = auth;
        this.storage = storage;
        this.resource = resource;
        this.loadingCtrl = loadingCtrl;
        this.slideIndex = 0;
        this.customers = [];
        this.customersOrigin = [];
        this.isSearch = false;
        this.searchString = '';
        this.maxCurrentId = 0;
    }
    CustomerPage.prototype.ngOnInit = function () {
        //khong cho quet bang tay
        this.slides.lockSwipes(true);
        this.userInfo = this.auth.getUserInfo();
        console.log('Login page ready authorize', this.userInfo);
        this.getCustomers(); //cai nay lay tu load trang dau luon
        this.myFromGroup = this.formBuilder.group({
            full_name: '',
            address: '',
            phone: '',
            email: '',
            area: '',
            type: '',
        });
    };
    CustomerPage.prototype.getCustomers = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Đang lấy danh sách khách hàng...'
        });
        loading.present();
        this.resource.getAllCutomers()
            .then(function (customers) {
            _this.customersOrigin = customers;
            _this.customers = _this.customersOrigin;
            //tim gia tri max cua ma khach hang
            _this.maxCurrentId = Math.max.apply(Math, _this.customersOrigin.map(function (o) { return o.stt; }));
            //console.log('MAX Ma khach hang',this.maxCurrentId);
            loading.dismiss();
        })
            .catch(function (err) {
            _this.customersOrigin = [];
            _this.customers = [];
            loading.dismiss();
        });
    };
    CustomerPage.prototype.goSearch = function () {
        this.isSearch = true;
    };
    CustomerPage.prototype.onInput = function (e) {
        var _this = this;
        this.customers = this.customersOrigin.filter(function (x) { return (x.full_name.toLowerCase().indexOf(_this.searchString.toLowerCase()) >= 0
            ||
                x.cust_id.toLowerCase().indexOf(_this.searchString.toLowerCase()) >= 0
            ||
                x.area.toLowerCase().indexOf(_this.searchString.toLowerCase()) >= 0
            ||
                x.staff.toLowerCase().indexOf(_this.searchString.toLowerCase()) >= 0
            ||
                (x.phone && x.phone.indexOf(_this.searchString) >= 0)); });
    };
    CustomerPage.prototype.searchEnter = function () {
        this.isSearch = false;
    };
    CustomerPage.prototype.gotoSlideEdit = function (cus) {
        //console.log('cus',cus);
        this.currentCustomer = cus;
        this.myFromGroup = this.formBuilder.group({
            full_name: cus.full_name,
            address: cus.address ? cus.address : cus.area,
            phone: cus.phone,
            email: cus.email,
            area: cus.area,
            type: cus.cust_type,
        });
        this.goToSlide(1);
    };
    /**
     * Dieu khien slide
     * @param i
     */
    CustomerPage.prototype.goToSlide = function (i) {
        this.slides.lockSwipes(false);
        this.slides.slideTo(i, 500);
        this.slides.lockSwipes(true);
    };
    /**
     * xac dinh slide
     */
    CustomerPage.prototype.slideChanged = function () {
        this.slideIndex = this.slides.getActiveIndex();
    };
    CustomerPage.prototype.goBack = function () {
        this.goToSlide(this.slideIndex - 1);
    };
    /**
     * Lay noi dung co thay doi
     * luu vao array customers luu xuong dia, luu csdl
     */
    CustomerPage.prototype.onSubmit = function () {
        this.currentCustomer.full_name = this.myFromGroup.get('full_name').value;
        this.currentCustomer.address = this.myFromGroup.get('address').value;
        this.currentCustomer.phone = this.myFromGroup.get('phone').value;
        this.currentCustomer.email = this.myFromGroup.get('email').value;
        this.currentCustomer.change_date = new Date().getTime();
        this.goToSlide(0);
    };
    CustomerPage.prototype.goParameters = function () {
        //this.navCtrl.push(ParametersPage)
    };
    CustomerPage.prototype.userAction = function () {
        //popup menu logout
    };
    CustomerPage.prototype.newCustomter = function () {
        //this.navCtrl.push(ConfigPage)
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Slides */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Slides */])
    ], CustomerPage.prototype, "slides", void 0);
    CustomerPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-customer',template:/*ion-inline-start:"/Users/cuongdq/IONIC/ionic-invoices/src/pages/customer/customer.html"*/'<ion-header>\n  <ion-navbar>\n\n    <ion-buttons *ngIf="!isSearch" start>\n      <button ion-button icon-only color="royal" (click)="goSearch()">\n        <ion-icon name="search"></ion-icon>\n      </button>\n\n      <button ion-button icon-only color="primary" (click)="userAction()" [disabled]="userInfo?false:true">\n        <ion-icon name="contact"></ion-icon>\n      </button>\n\n    </ion-buttons>\n\n    <ion-buttons end>\n      <button ion-button icon-only color="secondary" (click)="goParameters()">\n        <ion-icon name="more"></ion-icon>\n      </button>\n    </ion-buttons>\n    \n    <ion-searchbar *ngIf="isSearch" placeholder="Tìm theo mã/tên khách hàng/khu vực/người quản lý hoặc số điện thoại"\n      [(ngModel)]="searchString"\n      [showCancelButton]="shouldShowCancel"\n      (ionInput)="onInput($event)"\n      (keyup.enter)="searchEnter()"\n      (keyup.esc)="searchEnter()"\n      start>\n    </ion-searchbar>\n    \n    <ion-title *ngIf="!isSearch">CUSTOMER</ion-title>\n\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <ion-slides (ionSlideDidChange)="slideChanged()">\n      <!-- #id=0 -->\n      <ion-slide>\n          <ion-list>\n              <button ion-item *ngFor="let customer of customers" (click)="gotoSlideEdit(customer)">\n                \n                <ion-avatar item-start>\n                  <img src={{customer.image}} *ngIf="customer.image">\n                  \n                  <button ion-button icon-only color="secondary" round *ngIf="!customer.image">\n                      <ion-icon name="contact"></ion-icon>\n                  </button>\n\n                </ion-avatar>\n                \n                <h2>{{customer.cust_id}} - {{customer.full_name}}</h2>\n                <p>{{customer.area}} ({{customer.staff}})</p>\n                <ion-note>{{customer.cust_type}} {{customer.charge}} </ion-note>\n              </button>\n          </ion-list>\n      </ion-slide>\n      \n      <!-- #id=1 -->\n      <ion-slide>\n          <form [formGroup]="myFromGroup" (ngSubmit)="onSubmit()">\n\n              <ion-item>\n                <ion-label floating>Họ và Tên</ion-label>\n                <ion-input formControlName="full_name" type="text"></ion-input>\n              </ion-item>\n              \n              <ion-item>\n                <ion-label floating>Địa chỉ</ion-label>\n                <ion-input formControlName="address" type="address"></ion-input>\n              </ion-item>\n              \n              <ion-item>\n                <ion-label floating>Điện thoại</ion-label>\n                <ion-input formControlName="phone" type="phone"></ion-input>\n              </ion-item>\n              \n              <ion-item>\n                <ion-label floating>Email</ion-label>\n                <ion-input formControlName="email" type="email"></ion-input>\n              </ion-item>\n              \n              <ion-item>\n                <ion-label floating>Khu vực quản lý</ion-label>\n                <ion-input formControlName="area" type="text"></ion-input>\n              </ion-item>\n              \n              <ion-item>\n                <ion-label floating>Loại khách hàng</ion-label>\n                <ion-input formControlName="type" type="text"></ion-input>\n              </ion-item>\n              \n              <ion-row>\n                <ion-col text-center col-12 col-xl-3 col-lg-4 col-sm-6>\n                  <button ion-button block color="primary" type="button" (click)="goBack()">\n                    Trở về\n                  </button>\n                </ion-col>\n                <ion-col text-center col-12 offset-xl-6 col-xl-3 offset-lg-4 col-lg-4 col-sm-6>\n                  <button ion-button block color="primary" type="submit">\n                    Thay đổi\n                  </button>\n                </ion-col>\n              </ion-row>\n              \n            </form>\n      </ion-slide>\n  \n      <!-- #id=2 -->\n      <!-- #id=4 -->\n      <!-- #id=5 -->\n      <!-- #id=6 -->\n    </ion-slides>\n</ion-content>\n'/*ion-inline-end:"/Users/cuongdq/IONIC/ionic-invoices/src/pages/customer/customer.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_3__services_apiAuthService__["a" /* ApiAuthService */],
            __WEBPACK_IMPORTED_MODULE_4__services_apiStorageService__["a" /* ApiStorageService */],
            __WEBPACK_IMPORTED_MODULE_5__services_apiResourceServices__["a" /* ApiResourceService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* LoadingController */]])
    ], CustomerPage);
    return CustomerPage;
}());

//# sourceMappingURL=customer.js.map

/***/ }),

/***/ 301:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReportPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(39);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ReportPage = /** @class */ (function () {
    function ReportPage(toastCtrl) {
        this.toastCtrl = toastCtrl;
        this.chats = [
            {
                img: './assets/avatar-cher.png',
                name: 'Cher',
                message: 'Ugh. As if.',
                time: '9:38 pm'
            }, {
                img: './assets/avatar-dionne.png',
                name: 'Dionne',
                message: 'Mr. Hall was way harsh.',
                time: '8:59 pm'
            }, {
                img: './assets/avatar-murray.png',
                name: 'Murray',
                message: 'Excuse me, "Ms. Dione."',
                time: 'Wed'
            }
        ];
        this.logins = [
            {
                icon: 'logo-twitter',
                name: 'Twitter',
                username: 'admin',
            }, {
                icon: 'logo-github',
                name: 'GitHub',
                username: 'admin37',
            }, {
                icon: 'logo-instagram',
                name: 'Instagram',
                username: 'imanadmin',
            }, {
                icon: 'logo-google',
                name: 'Google',
                username: 'cuongdq3500888',
            }, {
                icon: 'logo-codepen',
                name: 'Codepen',
                username: 'administrator',
            }
        ];
    }
    ReportPage.prototype.more = function (item) {
        console.log('More');
        item.close();
    };
    ReportPage.prototype.delete = function (item) {
        console.log('Delete');
        item.close();
    };
    ReportPage.prototype.mute = function (item) {
        console.log('Mute');
        item.close();
    };
    ReportPage.prototype.archive = function (item) {
        this.expandAction(item, 'archiving', 'Chat was archived.');
    };
    ReportPage.prototype.download = function (item) {
        this.expandAction(item, 'downloading', 'Login was downloaded.');
    };
    ReportPage.prototype.expandAction = function (item, _, text) {
        // TODO item.setElementClass(action, true);
        var _this = this;
        setTimeout(function () {
            var toast = _this.toastCtrl.create({
                message: text
            });
            toast.present();
            // TODO item.setElementClass(action, false);
            item.close();
            setTimeout(function () { return toast.dismiss(); }, 2000);
        }, 1500);
    };
    ReportPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-report',template:/*ion-inline-start:"/Users/cuongdq/IONIC/ionic-invoices/src/pages/report/report.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title>Item Reorder</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content class="outer-content">\n\n  <ion-list class="chat-sliding-demo">\n    <ion-list-header>\n      Chats\n    </ion-list-header>\n\n    <ion-item-sliding *ngFor="let chat of chats" #item>\n      <ion-item>\n        <ion-avatar item-start>\n          <img [src]="chat.img">\n        </ion-avatar>\n        <h2>{{chat.name}}</h2>\n        <p>{{chat.message}}</p>\n        <ion-note item-end>\n          {{chat.time}}\n        </ion-note>\n      </ion-item>\n\n      <ion-item-options>\n        <button ion-button color="secondary" (click)="more(item)">\n          <ion-icon name="menu"></ion-icon>\n          More\n        </button>\n        <button ion-button color="dark" (click)="mute(item)">\n          <ion-icon name="volume-off"></ion-icon>\n          Mute\n        </button>\n        <button ion-button color="danger" (click)="delete(item)">\n          <ion-icon name="trash"></ion-icon>\n          Delete\n        </button>\n      </ion-item-options>\n\n      <ion-item-options side="left" (ionSwipe)="archive(item)">\n        <button ion-button color="primary" expandable (click)="archive(item)">\n          <ion-icon name="archive" class="expand-hide"></ion-icon>\n          <div class="expand-hide">Archive</div>\n          <ion-spinner id="archive-spinner"></ion-spinner>\n        </button>\n      </ion-item-options>\n    </ion-item-sliding>\n  </ion-list>\n\n  <ion-list class="login-sliding-demo">\n    <ion-list-header>\n      Logins\n    </ion-list-header>\n\n    <ion-item-sliding *ngFor="let login of logins" #item>\n      <ion-item>\n        <ion-icon [name]="login.icon" item-start></ion-icon>\n        <h2>{{login.name}}</h2>\n        <p>{{login.username}}</p>\n      </ion-item>\n      <ion-item-options side="left">\n        <button ion-button color="danger">\n          <ion-icon name="trash"></ion-icon>\n        </button>\n      </ion-item-options>\n      <ion-item-options (ionSwipe)="download(item)" icon-start>\n        <button ion-button color="dark" (click)="more(item)">\n          <ion-icon name="volume-off"></ion-icon>\n          Mute\n        </button>\n        <button ion-button color="light" expandable (click)="download(item)">\n          <ion-icon name="download" class="expand-hide"></ion-icon>\n          <div class="expand-hide">Download</div>\n          <ion-spinner id="download-spinner"></ion-spinner>\n        </button>\n      </ion-item-options>\n    </ion-item-sliding>\n\n  </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"/Users/cuongdq/IONIC/ionic-invoices/src/pages/report/report.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* ToastController */]])
    ], ReportPage);
    return ReportPage;
}());

//# sourceMappingURL=report.js.map

/***/ }),

/***/ 302:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(303);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(323);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 323:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common_http__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_splash_screen__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_status_bar__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_component__ = __webpack_require__(377);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_home_home__ = __webpack_require__(378);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_login_phone_login_phone__ = __webpack_require__(379);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_customer_customer__ = __webpack_require__(300);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_invoice_invoice__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_report_report__ = __webpack_require__(301);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_tabs_tabs__ = __webpack_require__(299);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ionic_native_in_app_browser__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_angular_webstorage_service__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__services_apiStorageService__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__services_apiAuthService__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__services_apiImageService__ = __webpack_require__(298);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__services_apiResourceServices__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__interceptors_requestInterceptor__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__interceptors_responseInterceptor__ = __webpack_require__(499);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__ionic_native_sqlite__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__services_apiSqliteService__ = __webpack_require__(251);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

























var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_9__pages_login_phone_login_phone__["a" /* LoginPhonePage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_customer_customer__["a" /* CustomerPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_invoice_invoice__["a" /* InvoicePage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_report_report__["a" /* ReportPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_home_home__["a" /* HomePage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["b" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["e" /* ReactiveFormsModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_common_http__["c" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_15_angular_webstorage_service__["b" /* StorageServiceModule */],
                __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* MyApp */], {}, {
                    links: []
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_9__pages_login_phone_login_phone__["a" /* LoginPhonePage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_customer_customer__["a" /* CustomerPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_invoice_invoice__["a" /* InvoicePage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_report_report__["a" /* ReportPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_home_home__["a" /* HomePage */],
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_6__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_22__ionic_native_sqlite__["a" /* SQLite */],
                __WEBPACK_IMPORTED_MODULE_14__ionic_native_in_app_browser__["a" /* InAppBrowser */],
                __WEBPACK_IMPORTED_MODULE_17__services_apiAuthService__["a" /* ApiAuthService */],
                __WEBPACK_IMPORTED_MODULE_18__services_apiImageService__["a" /* ApiImageService */],
                __WEBPACK_IMPORTED_MODULE_16__services_apiStorageService__["a" /* ApiStorageService */],
                __WEBPACK_IMPORTED_MODULE_23__services_apiSqliteService__["a" /* ApiSqliteService */],
                __WEBPACK_IMPORTED_MODULE_19__services_apiResourceServices__["a" /* ApiResourceService */],
                __WEBPACK_IMPORTED_MODULE_20__interceptors_requestInterceptor__["a" /* RequestInterceptor */],
                {
                    provide: __WEBPACK_IMPORTED_MODULE_4__angular_common_http__["a" /* HTTP_INTERCEPTORS */],
                    useClass: __WEBPACK_IMPORTED_MODULE_20__interceptors_requestInterceptor__["a" /* RequestInterceptor */],
                    multi: true
                },
                {
                    provide: __WEBPACK_IMPORTED_MODULE_4__angular_common_http__["a" /* HTTP_INTERCEPTORS */],
                    useClass: __WEBPACK_IMPORTED_MODULE_21__interceptors_responseInterceptor__["a" /* ResponseInterceptor */],
                    multi: true
                },
                {
                    provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */],
                    useClass: __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["c" /* IonicErrorHandler */]
                }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 377:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_invoice_invoice__ = __webpack_require__(136);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




// import { TabsPage } from '../pages/tabs/tabs';
// import { LoginPhonePage } from '../pages/login-phone/login-phone';
// import { HomePage } from '../pages/home/home';

var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen) {
        var _this = this;
        this.isWeb = false;
        platform.ready().then(function () {
            statusBar.styleDefault();
            splashScreen.hide();
            if (platform.is('mobileweb')
                || platform.platforms()[0] == 'core') {
                //version web
                _this.isWeb = true;
            }
            _this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_invoice_invoice__["a" /* InvoicePage */];
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/cuongdq/IONIC/ionic-invoices/src/app/app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"/Users/cuongdq/IONIC/ionic-invoices/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 378:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(39);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var HomePage = /** @class */ (function () {
    function HomePage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"/Users/cuongdq/IONIC/ionic-invoices/src/pages/home/home.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      Ionic Blank\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  The world is your oyster.\n  <p>\n    If you get lost, the <a href="http://ionicframework.com/docs/v2">docs</a> will be your guide.\n  </p>\n</ion-content>\n'/*ion-inline-end:"/Users/cuongdq/IONIC/ionic-invoices/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 379:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPhonePage; });
/* unused harmony export forbiddenNameValidator */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_apiAuthService__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_apiResourceServices__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_apiStorageService__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_apiImageService__ = __webpack_require__(298);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__tabs_tabs__ = __webpack_require__(299);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var LoginPhonePage = /** @class */ (function () {
    function LoginPhonePage(formBuilder, auth, resources, alertCtrl, apiStorageService, apiImageService, loadingCtrl, navCtrl) {
        this.formBuilder = formBuilder;
        this.auth = auth;
        this.resources = resources;
        this.alertCtrl = alertCtrl;
        this.apiStorageService = apiStorageService;
        this.apiImageService = apiImageService;
        this.loadingCtrl = loadingCtrl;
        this.navCtrl = navCtrl;
        this.slideIndex = 0;
        this.isImageViewer = false;
        this.resourceImages = []; //: { imageViewer: any, file: any, name: string }[] = [];
    }
    LoginPhonePage.prototype.ngOnInit = function () {
        var _this = this;
        this.slides.lockSwipes(true);
        this.phoneFormGroup = this.formBuilder.group({
            phone: ['',
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required,
                    //Validators.pattern("^[0-9]*$"),
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].pattern(/^([1-9]{1})([0-9]{8})/),
                    phoneNumberValidator,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(9),
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(9)
                ]]
        });
        this.keyFormGroup = this.formBuilder.group({
            key: ['',
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(6),
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(6)
                ]
            ],
        });
        this.userFromGroup = this.formBuilder.group({
            password: ['',
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(3)
                ]
            ],
            nickname: ['',
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(5),
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(30)
                ]
            ],
            name: ['',
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].minLength(6),
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].maxLength(50)
                ]
            ],
            email: '',
            address: ''
        });
        this.imageFormGroup = this.formBuilder.group({
            image: ['',
                [
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required
                ]
            ],
        });
        if (this.apiStorageService.getToken()) {
            this.auth.authorize(this.apiStorageService.getToken())
                .then(function (status) {
                _this.auth.getServerPublicRSAKey()
                    .then(function (pk) {
                    var userInfo = _this.auth.getUserInfo();
                    console.log('Save token user', userInfo);
                    //kiem tra token chua khai nickname, va image thi phai nhay vao slide khai thong tin
                    if (userInfo)
                        //cho phep truy cap thi gui token kem theo
                        _this.auth.injectToken(); //Tiêm token cho các phiên làm việc lấy số liệu cần xác thực
                    _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_7__tabs_tabs__["a" /* TabsPage */]);
                })
                    .catch(function (err) {
                    console.log('Public key err', err);
                });
            })
                .catch(function (err) {
                console.log('Token invalid: ', err);
                _this.auth.deleteToken();
            });
        }
    };
    LoginPhonePage.prototype.onSubmit = function () {
        var _this = this;
        var phone = this.phoneFormGroup.value.phone;
        this.auth.requestIsdn(JSON.stringify({
            phone: phone
        }))
            .then(function (data) {
            var a;
            a = data;
            console.log('server response:', a);
            console.log('token', a.token);
            console.log('data.database_out', a.database_out); //hack
            if (a.database_out.status == 1 && a.token) {
                _this.token = a.token;
                _this.goToSlide(1); //ve form confirmKey
            }
            else if (phone === '123456789') {
                _this.presentAlert('Số điện thoại ' + phone + ' chỉ dùng để debug.<br> vui lòng nhập key OTP debug : ' + a.database_out.message + ' để tiếp tục');
                _this.token = a.token;
                _this.goToSlide(1); //ve form confirmKey
            }
            else {
                //neu ho nhap so dien thoai nhieu lan sai so spam thi ??
                _this.presentAlert('Số điện thoại ' + phone + ' không hợp lệ.<br> Vui lòng liên hệ Quản trị hệ thống');
            }
        })
            .catch(function (err) {
            _this.presentAlert('Lỗi xác thực <br>' + JSON.stringify(err ? err.error : 'Unknow!'));
        });
    };
    LoginPhonePage.prototype.onSubmitKey = function () {
        var _this = this;
        var key = this.keyFormGroup.value.key;
        //console.log(key);
        this.auth.confirmKey(JSON.stringify({
            key: key,
            token: this.token
        }))
            .then(function (token) {
            _this.token = token;
            _this.auth.saveToken(token); //luu tru tren xac thuc va xuong dia
            //yeu cau cung cap anh dai dien
            //mat khau luu tru
            _this.auth.getServerPublicRSAKey()
                .then(function (pk) {
                console.log('Public key ok khoi tao user, mat khau ');
                //kiem tra login bang pass, neu co user thi 
                _this.goToSlide(2);
                //neu chua co user thi den 
            })
                .catch(function (err) {
                console.log('Public key err', err);
            });
        })
            .catch(function (err) {
            _this.presentAlert('Mã OTP của bạn không đúng vui lòng kiểm tra lại trên số điện thoại của bạn <br>');
            _this.goToSlide(0); //ve form phone
        });
    };
    LoginPhonePage.prototype.onSubmitUserInfo = function () {
        //gui thong tin len may chu de dang ky user
        this.auth.sendUserInfo(JSON.stringify({}));
        this.goToSlide(3);
    };
    LoginPhonePage.prototype.onSubmitImage = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Đang cập nhập ảnh...'
        });
        loading.present();
        this.auth.sendImageBase64(JSON.stringify({}));
        //may chu cho phep se cap mot token server proxy
        //console.log('token proxy',this.token);
        //gui token nay len server resource chung thuc
        this.resources.authorizeFromResource(this.token)
            .then(function (data) {
            //console.log('data from resource',data);
            var login;
            login = data;
            if (login.status
                && login.user_info
                && login.token) {
                _this.apiStorageService.saveToken(_this.token);
                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_7__tabs_tabs__["a" /* TabsPage */]);
            }
            else {
                _this.presentAlert('Dữ liệu xác thực không đúng <br>' + JSON.stringify(data));
                _this.goToSlide(0);
            }
            loading.dismiss();
        })
            .catch(function (err) {
            //console.log('err',err);
            _this.presentAlert('Lỗi xác thực - authorizeFromResource');
            _this.goToSlide(0);
            loading.dismiss();
        });
    };
    LoginPhonePage.prototype.goToSlide = function (i) {
        this.slides.lockSwipes(false);
        this.slides.slideTo(i, 500);
        this.slides.lockSwipes(true);
    };
    LoginPhonePage.prototype.slideChanged = function () {
        this.slideIndex = this.slides.getActiveIndex();
    };
    LoginPhonePage.prototype.goBack = function () {
        this.goToSlide(0);
    };
    LoginPhonePage.prototype.presentAlert = function (msg) {
        var alert = this.alertCtrl.create({
            title: 'For Administrator',
            subTitle: msg,
            buttons: ['Dismiss']
        }).present();
    };
    LoginPhonePage.prototype.fileChange = function (event) {
        var _this = this;
        if (event.target && event.target.files) {
            var files = event.target.files;
            for (var key in files) {
                if (!isNaN(parseInt(key))) {
                    this.apiImageService.resizeImage(files[key].name, files[key], 300)
                        .then(function (data) {
                        _this.resourceImages.push(data);
                        _this.isImageViewer = true;
                    })
                        .catch(function (err) {
                        console.log(err);
                    });
                }
            } //
        }
    };
    LoginPhonePage.prototype.deleteImage = function (evt) {
        this.resourceImages = this.resourceImages.filter(function (value, index, arr) { return value != evt; });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Slides */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Slides */])
    ], LoginPhonePage.prototype, "slides", void 0);
    LoginPhonePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-login-phone',template:/*ion-inline-start:"/Users/cuongdq/IONIC/ionic-invoices/src/pages/login-phone/login-phone.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>AUTHENTICATION - XÁC THỰC</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="login-form-background">\n    <ion-slides (ionSlideDidChange)="slideChanged()">\n        <!-- #id=0 -->\n        <ion-slide>\n            <div class="wrapper">\n                <form class="login-form" (ngSubmit)="onSubmit()" [formGroup]="phoneFormGroup">\n                    <ion-item>\n                        <ion-label floating>Nhập số điện thoại (*)</ion-label>\n                        <ion-input type="text" formControlName="phone"></ion-input>\n                    </ion-item>\n                    <p *ngIf="phoneFormGroup.controls.phone.invalid && phoneFormGroup.controls.phone.touched">\n                        <span class="error">Vui lòng nhập số điện thoại di động gồm 9 chữ số KHÔNG CÓ số 0 ở đầu</span>\n                    </p>\n                    <ion-buttons start>\n                        <button ion-button type="submit" icon-end round [disabled]="!phoneFormGroup.controls.phone.valid">\n                            Yêu cầu xác thực\n                            <ion-icon name="share-alt"></ion-icon>\n                        </button>\n                    </ion-buttons>\n                </form>\n            </div>\n        </ion-slide>\n\n        <!-- #id=1 -->\n        <ion-slide>\n            <div class="wrapper">\n                <form class="login-form" (ngSubmit)="onSubmitKey()" [formGroup]="keyFormGroup">\n                    <ion-item>\n                        <ion-label floating>Nhập mã OTP gửi đến điện thoại (*)</ion-label>\n                        <ion-input type="text" formControlName="key"></ion-input>\n                    </ion-item>\n                    <p *ngIf="keyFormGroup.controls.key.invalid && keyFormGroup.controls.key.touched">\n                        <span class="error">Vui lòng nhập mã OTP có 6 chữ cái và số không có số 0</span>\n                    </p>\n                    <ion-buttons start>\n                        <button ion-button type="submit" icon-end round [disabled]="!keyFormGroup.controls.key.valid">\n                            Xác thực OTP\n                            <ion-icon name="share-alt"></ion-icon>\n                        </button>\n                    </ion-buttons>\n                </form>\n            </div>\n        </ion-slide>\n\n        <!-- #id=2 dang ky user, pass, ho ten, dia chi, email,  -->\n        <ion-slide>\n            <div class="wrapper user-info">\n                <form class="login-form" (ngSubmit)="onSubmitUserInfo()" [formGroup]="userFromGroup">\n                    <ion-item>\n                        <ion-label floating>Password - Mật khẩu(*)</ion-label>\n                        <ion-input type="password" formControlName="password"></ion-input>\n                    </ion-item>\n                    <p *ngIf="userFromGroup.controls.password.invalid && userFromGroup.controls.password.touched">\n                        <span class="error">Vui lòng nhập mật khẩu tối thiểu 6 chữ số chứa ít nhất 1 chữ hoa, 1 chữ\n                            thường và 1 ký tự đặc biệt</span>\n                    </p>\n                    <ion-item>\n                        <ion-label floating>Nick Name - Tên hiển thị(*)</ion-label>\n                        <ion-input type="nickname" formControlName="nickname"></ion-input>\n                    </ion-item>\n                    <p *ngIf="userFromGroup.controls.nickname.invalid && userFromGroup.controls.nickname.touched">\n                        <span class="error">Vui lòng nhập tên bí danh (nickname) để gợi nhớn tối thiểu 10 ký tự</span>\n                    </p>\n                    <ion-item>\n                        <ion-label floating>Full Name - Họ và tên đầy đủ(*)</ion-label>\n                        <ion-input type="name" formControlName="name"></ion-input>\n                    </ion-item>\n                    <p *ngIf="userFromGroup.controls.name.invalid && userFromGroup.controls.name.touched">\n                        <span class="error">Vui lòng nhập họ và tên đầy đủ bằng tiếng việt có dấu rõ ràng</span>\n                    </p>\n                    <ion-item>\n                        <ion-label floating>Email - Hộp thư điện tử</ion-label>\n                        <ion-input type="email" formControlName="email"></ion-input>\n                    </ion-item>\n                    <p *ngIf="userFromGroup.controls.email.invalid && userFromGroup.controls.email.touched">\n                        <span class="error">nhập định dạng email chính xác</span>\n                    </p>\n                    <ion-item>\n                        <!-- (địa chỉ tự động sinh ra theo location) -->\n                        <ion-label floating>Address - Địa chỉ đầy đủ</ion-label>\n                        <ion-input type="address" formControlName="address"></ion-input>\n                    </ion-item>\n                    <p *ngIf="userFromGroup.controls.address.invalid && userFromGroup.controls.address.touched">\n                        <span class="error">Vui lòng nhập địa chỉ rõ ràng theo vị trí liên lạc của bạn</span>\n                    </p>\n\n                    <ion-buttons start>\n                        <button ion-button type="submit" icon-end round>\n                            Cập nhập\n                            <ion-icon name="share-alt"></ion-icon>\n                        </button>\n                    </ion-buttons>\n\n                </form>\n            </div>\n\n        </ion-slide>\n\n        <!-- #id=3 dang ky anh dai dien  -->\n        <ion-slide>\n            <div class="wrapper">\n                <form class="login-form" (ngSubmit)="onSubmitImage()" [formGroup]="imageFormGroup">\n\n                    <ion-item *ngIf="isImageViewer">\n                        <ion-row>\n                            <ion-col *ngFor="let obj of resourceImages" col-12>\n                                <ion-card>\n                                    <img [src]="obj?.imageViewer" style="width: 100%; height: 100%;" />\n                                </ion-card>\n                            </ion-col>\n                        </ion-row>\n                    </ion-item>\n\n                    <ion-item>\n                        <ion-buttons start>\n                            <button ion-button type="button" icon-end round>\n                                <input type="file" accept="image/*" formControlName="image" (change)="fileChange($event)">\n                                Avantar - Ảnh đại diện\n                                <ion-icon name="images"></ion-icon>\n                            </button>\n                        </ion-buttons>\n                    </ion-item>\n\n                    <ion-buttons start>\n                        <button ion-button type="submit" icon-end round>\n                            Cập nhập\n                            <ion-icon name="share-alt"></ion-icon>\n                        </button>\n                    </ion-buttons>\n\n                </form>\n            </div>\n        </ion-slide>\n\n    </ion-slides>\n\n    <div class="gradient"></div>\n\n</ion-content>'/*ion-inline-end:"/Users/cuongdq/IONIC/ionic-invoices/src/pages/login-phone/login-phone.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_3__services_apiAuthService__["a" /* ApiAuthService */],
            __WEBPACK_IMPORTED_MODULE_4__services_apiResourceServices__["a" /* ApiResourceService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_5__services_apiStorageService__["a" /* ApiStorageService */],
            __WEBPACK_IMPORTED_MODULE_6__services_apiImageService__["a" /* ApiImageService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */]])
    ], LoginPhonePage);
    return LoginPhonePage;
}());

function phoneNumberValidator(formControl) {
    if (formControl.value.charAt(0) != "0")
        return null;
    else
        return { phone: formControl.value };
}
//custom validators
function forbiddenNameValidator(nameRe) {
    return function (control) {
        var forbidden = nameRe.test(control.value);
        return forbidden ? { 'forbiddenName': { value: control.value } } : null;
    };
}
//# sourceMappingURL=login-phone.js.map

/***/ }),

/***/ 385:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 387:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 422:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 423:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 46:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApiStorageService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_webstorage_service__ = __webpack_require__(250);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


var STORAGE_KEY = 'Cng@3500888';
var sessionStorageAvailable = Object(__WEBPACK_IMPORTED_MODULE_1_angular_webstorage_service__["c" /* isStorageAvailable */])(sessionStorage);
var ApiStorageService = /** @class */ (function () {
    function ApiStorageService(storage) {
        this.storage = storage;
    }
    ApiStorageService_1 = ApiStorageService;
    ApiStorageService.prototype.doSomethingAwesome = function () {
        var awesomenessLevel = this.storage.get(STORAGE_KEY) || 1337;
        this.storage.set(STORAGE_KEY, awesomenessLevel + 1);
        return awesomenessLevel;
    };
    ApiStorageService.prototype.save = function (key, value) {
        this.storage.set(key, value);
    };
    ApiStorageService.prototype.read = function (key) {
        return this.storage.get(key);
    };
    ApiStorageService.prototype.delete = function (key) {
        this.storage.remove(key);
    };
    ApiStorageService.prototype.getStatus = function () {
        return "Session storage available: " + sessionStorageAvailable;
    };
    ApiStorageService.prototype.saveToken = function (value) {
        this.save('token', value);
    };
    ApiStorageService.prototype.getToken = function () {
        ApiStorageService_1.token = this.read('token');
        return ApiStorageService_1.token;
    };
    ApiStorageService.prototype.deleteToken = function () {
        ApiStorageService_1.token = null;
        this.delete('token');
    };
    ApiStorageService.prototype.saveUserRooms = function (user, rooms) {
        this.save('#rooms#' + user.username, JSON.stringify(rooms));
    };
    ApiStorageService.prototype.deleteUserRooms = function (user) {
        this.delete('#rooms#' + user.username);
    };
    ApiStorageService.prototype.getUserRooms = function (user) {
        try {
            var rooms = JSON.parse(this.read('#rooms#' + user.username));
            return rooms ? rooms : [];
        }
        catch (e) {
            return [];
        }
    };
    ApiStorageService.prototype.saveUserLastTime = function (user, time) {
        this.save('#last_time#' + user.username, time.toString());
    };
    ApiStorageService.prototype.deleteUserLastTime = function (user) {
        this.delete('#last_time#' + user.username);
    };
    ApiStorageService.prototype.getUserLastTime = function (user) {
        try {
            var time = parseInt(this.read('#last_time#' + user.username));
            return time;
        }
        catch (e) {
            return 0;
        }
    };
    ApiStorageService.prototype.saveUserRoomMessages = function (user, room) {
        this.save('#message' + room.name + '#' + user.username, JSON.stringify(room.messages));
        this.saveUserLastTime(user, new Date().getTime());
    };
    ApiStorageService.prototype.getUserRoomMessages = function (user, room) {
        try {
            var messages = JSON.parse(this.read('#message' + room.name + '#' + user.username));
            return messages ? messages : [];
        }
        catch (e) {
            return [];
        }
    };
    /**
     * Chuyển đổi một mảng có cấu trúc thành cấu trúc cây (như oracle)
     * Phục vụ quản lý theo tiêu chí hình cây
     * @param arrIn
     * @param option
     * @param level
     */
    ApiStorageService.prototype.createTree = function (arrIn, option, level) {
        var _this = this;
        var myLevl = level ? level : 0;
        var myOption = option ? option : { id: 'id', parentId: 'parentId', startWith: null };
        var roots = arrIn.filter(function (x) { return x[option.parentId] != x[option.id] && x[option.parentId] == option.startWith; });
        //console.log('roots',roots);
        if (roots.length > 0) {
            myLevl++;
            roots.forEach(function (el) {
                //console.log('myId',el[option.id], myLevl);
                el.$level = myLevl;
                el.$children = arrIn.filter(function (x) { return x[option.parentId] != x[option.id] && x[option.parentId] == el[option.id]; });
                if (el.$children.length > 0) {
                    el.$children.forEach(function (ch) {
                        ch.$level = myLevl + 1;
                        //console.log('myId child',ch[option.id], ch.$level);
                        myOption.startWith = ch[option.id];
                        ch.$children = _this.createTree(arrIn, myOption, ch.$level);
                    });
                }
                else {
                    el.$isleaf = 1;
                    el.$children = undefined;
                }
            });
            return roots;
        }
        else {
            arrIn.forEach(function (el) {
                el.$level = myLevl;
                el.$isleaf = 1;
            });
            return arrIn; //khong tao duoc cay vi khong tim thay
        }
    };
    //public static resourceServer = ''; 
    ApiStorageService.resourceServer = 'https://qld-invoices.herokuapp.com';
    //public static resourceServer = 'http://localhost:8080'; 
    //public static resourceServer = 'https://c3.mobifone.vn';
    ApiStorageService.authenticationServer = 'https://c3.mobifone.vn/api/ext-auth';
    ApiStorageService = ApiStorageService_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_1_angular_webstorage_service__["a" /* LOCAL_STORAGE */])),
        __metadata("design:paramtypes", [Object])
    ], ApiStorageService);
    return ApiStorageService;
    var ApiStorageService_1;
}());

//# sourceMappingURL=apiStorageService.js.map

/***/ }),

/***/ 499:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ResponseInterceptor; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_do__ = __webpack_require__(500);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_do___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_do__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http___ = __webpack_require__(59);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ResponseInterceptor = /** @class */ (function () {
    function ResponseInterceptor() {
    }
    ResponseInterceptor.prototype.intercept = function (request, next) {
        return next.handle(request).do(function (event) {
            if (event instanceof __WEBPACK_IMPORTED_MODULE_2__angular_common_http___["e" /* HttpResponse */]) {
                //console.log('May chu cho phep va truy cap voi event:');
                //console.log(event);
            }
        }, function (err) {
            if (err instanceof __WEBPACK_IMPORTED_MODULE_2__angular_common_http___["d" /* HttpErrorResponse */]) {
                console.log('May chu Khong cho phep hoac loi:');
                console.log(err);
            }
        });
    };
    ResponseInterceptor = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], ResponseInterceptor);
    return ResponseInterceptor;
}());

//# sourceMappingURL=responseInterceptor.js.map

/***/ }),

/***/ 78:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApiResourceService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__apiStorageService__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__interceptors_requestInterceptor__ = __webpack_require__(137);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ApiResourceService = /** @class */ (function () {
    function ApiResourceService(httpClient, reqInterceptor //muon thay doi token gui kem thi ghi token moi
    ) {
        this.httpClient = httpClient;
        this.reqInterceptor = reqInterceptor; //muon thay doi token gui kem thi ghi token moi
        this.resourceServer = __WEBPACK_IMPORTED_MODULE_2__apiStorageService__["a" /* ApiStorageService */].resourceServer;
    }
    /**
     * Tao file pdf de in an
     * trả về danh mục các file hóa đơn đã tạo trên máy chủ
     * [{201901_print_all.pdf}]
     * @param billCycle
     */
    ApiResourceService.prototype.createPdfInvoices = function (billCycle) {
        return this.httpClient.post(this.resourceServer + '/db/pdf-invoices', JSON.stringify({
            bill_cycle: billCycle.bill_cycle,
            cust_id: billCycle.cust_id,
            background: billCycle.background
        }))
            .toPromise();
    };
    /**
     * get hoa don (phai tao truoc, neu khong se không có file)
     * @param yyyymm_cust_id
     */
    ApiResourceService.prototype.getPdfInvoices = function (yyyymm_cust_id) {
        var httpOptions = {
            'responseType': 'arraybuffer'
            //'responseType'  : 'blob' as 'json'        //This also worked
        };
        return this.httpClient.get(this.resourceServer + '/db/pdf-invoices/' + yyyymm_cust_id, httpOptions)
            .toPromise();
    };
    /**
     * billCycle =
     * {
     * bill_cycle:
     * bill_date:
     * invoice_no:
     * cust_id:
     * }
     */
    ApiResourceService.prototype.createInvoices = function (billCycle) {
        return this.httpClient.post(this.resourceServer + '/db/create-invoices', JSON.stringify({
            bill_cycle: billCycle.bill_cycle,
            bill_date: billCycle.bill_date,
            invoice_no: billCycle.invoice_no,
            cust_id: billCycle.cust_id
        }))
            .toPromise();
    };
    /**
     * yyyymm_custId = 201901 hoac 201901/R000000001
     */
    ApiResourceService.prototype.getInvoices = function (yyyymm_custId) {
        return this.httpClient.get(this.resourceServer + '/db/json-invoices/' + yyyymm_custId)
            .toPromise()
            .then(function (results) {
            if (results) {
                return results;
            }
            else {
                throw [];
            }
        });
    };
    /**
     * lay ky cuoc da tao trong csdl
     */
    ApiResourceService.prototype.getBillCycle = function () {
        return this.httpClient.get(this.resourceServer + '/db/json-bill-cycles')
            .toPromise()
            .then(function (results) {
            if (results) {
                return results;
            }
            else {
                throw [];
            }
        });
    };
    ApiResourceService.prototype.getAllCutomers = function () {
        return this.httpClient.get(this.resourceServer + '/db/json-customers')
            .toPromise()
            .then(function (results) {
            if (results) {
                return results;
            }
            else {
                throw [];
            }
        });
    };
    ApiResourceService.prototype.getParamters = function () {
        return this.httpClient.get(this.resourceServer + '/db/json-parameters')
            .toPromise()
            .then(function (results) {
            if (results) {
                return results;
            }
            else {
                throw [];
            }
        });
    };
    /**
     * truyen len {token:'...'}
     * @param jsonString
     */
    ApiResourceService.prototype.authorizeFromResource = function (token) {
        var _this = this;
        this.reqInterceptor.setRequestToken(token); //neu thanh cong thi cac phien sau se gan them bear
        return this.httpClient.post(this.resourceServer + '/auth/authorize-token', JSON.stringify({ check: true }))
            .toPromise()
            .then(function (data) {
            _this.token = token;
            return data;
        })
            .catch(function (err) {
            _this.token = null;
            _this.reqInterceptor.setRequestToken(null);
            throw err;
        });
    };
    ApiResourceService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["b" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_3__interceptors_requestInterceptor__["a" /* RequestInterceptor */] //muon thay doi token gui kem thi ghi token moi
        ])
    ], ApiResourceService);
    return ApiResourceService;
}());

//# sourceMappingURL=apiResourceServices.js.map

/***/ })

},[302]);
//# sourceMappingURL=main.js.map