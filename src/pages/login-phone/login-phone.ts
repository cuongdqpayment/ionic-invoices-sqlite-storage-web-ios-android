import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, Slides } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { ApiAuthService } from '../../services/apiAuthService';

import { ApiResourceService } from '../../services/apiResourceServices';

import { ApiStorageService } from '../../services/apiStorageService';
import { ApiImageService } from '../../services/apiImageService';
import { TabsPage } from '../tabs/tabs';


@Component({
  selector: 'page-login-phone',
  templateUrl: 'login-phone.html'
})
export class LoginPhonePage {
  @ViewChild(Slides) slides: Slides;
  slideIndex = 0;
  token:any;

  phoneFormGroup: FormGroup;
  keyFormGroup: FormGroup;
  userFromGroup: FormGroup;
  imageFormGroup: FormGroup;


  isImageViewer: boolean = false;
  resourceImages=[]//: { imageViewer: any, file: any, name: string }[] = [];

  constructor( private formBuilder: FormBuilder,
               private auth : ApiAuthService,
               private resources : ApiResourceService,
               private alertCtrl: AlertController,
               private apiStorageService: ApiStorageService,
               private apiImageService: ApiImageService,
               private loadingCtrl: LoadingController,
               private navCtrl: NavController) {}


  ngOnInit(){

    this.slides.lockSwipes(true);

    this.phoneFormGroup = this.formBuilder.group({
      phone: ['',
        [
          Validators.required,
          //Validators.pattern("^[0-9]*$"),
          Validators.pattern(/^([1-9]{1})([0-9]{8})/),
          phoneNumberValidator,
          Validators.minLength(9),
          Validators.maxLength(9)]]
    })

    this.keyFormGroup = this.formBuilder.group({
      key: ['',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6)
        ]
      ],
    })


    this.userFromGroup = this.formBuilder.group({
      password: ['',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],
      nickname: ['',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30)
        ]
      ],
      name: ['',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50)
        ]
      ],
      email: '',
      address: ''
    })


    this.imageFormGroup = this.formBuilder.group({
      image: ['', //base64
        [
          Validators.required
        ]
      ],
    })

    if (this.apiStorageService.getToken()){
      this.auth.authorize
      (this.apiStorageService.getToken())
      .then(status=>{

          this.auth.getServerPublicRSAKey()
          .then(pk => {
            
            let userInfo = this.auth.getUserInfo();
            console.log('Save token user', userInfo);
            //kiem tra token chua khai nickname, va image thi phai nhay vao slide khai thong tin
            if (
              userInfo
              // &&userInfo.image
              // &&userInfo.nickname
              )
            //cho phep truy cap thi gui token kem theo
            this.auth.injectToken(); //Tiêm token cho các phiên làm việc lấy số liệu cần xác thực

            this.navCtrl.setRoot(TabsPage);
          })
          .catch(err=>{
            console.log('Public key err', err);
          });
      })
      .catch(err=>{
        console.log('Token invalid: ', err);
        this.auth.deleteToken();
      });
    }

  }

  onSubmit() {
    let phone = this.phoneFormGroup.value.phone;
    this.auth.requestIsdn(JSON.stringify({
      phone:phone
      }))
    .then(data=>{
      let a;
      a = data;
      console.log('server response:', a); 
      console.log('token', a.token);      
      console.log('data.database_out', a.database_out); //hack
      if (a.database_out.status==1&&a.token){
        this.token = a.token;
        this.goToSlide(1); //ve form confirmKey
      }else if (phone==='123456789') {
        this.presentAlert('Số điện thoại '+phone+' chỉ dùng để debug.<br> vui lòng nhập key OTP debug : '+ a.database_out.message +' để tiếp tục' );
        this.token = a.token;
        this.goToSlide(1); //ve form confirmKey
      }else {
        //neu ho nhap so dien thoai nhieu lan sai so spam thi ??
        this.presentAlert('Số điện thoại '+phone+' không hợp lệ.<br> Vui lòng liên hệ Quản trị hệ thống');
      }
    })
    .catch(err=>{

      this.presentAlert('Lỗi xác thực <br>' + JSON.stringify(err?err.error:'Unknow!'));
    })
  }

  onSubmitKey(){
    let key = this.keyFormGroup.value.key;
    //console.log(key);
    
    this.auth.confirmKey(JSON.stringify({
      key:key,
      token:this.token
      }))
    .then(token=>{
        this.token = token;
        this.auth.saveToken(token); //luu tru tren xac thuc va xuong dia
        
        //yeu cau cung cap anh dai dien
        //mat khau luu tru
        this.auth.getServerPublicRSAKey()
        .then(pk => {
          
          console.log('Public key ok khoi tao user, mat khau ');
          //kiem tra login bang pass, neu co user thi 
          this.goToSlide(2);
          //neu chua co user thi den 
        })
        .catch(err=>{
          console.log('Public key err', err);
        });

    })
    .catch(err=>{
      this.presentAlert('Mã OTP của bạn không đúng vui lòng kiểm tra lại trên số điện thoại của bạn <br>'
               );
      this.goToSlide(0); //ve form phone
    })
  }


  onSubmitUserInfo(){
    
    //gui thong tin len may chu de dang ky user
    this.auth.sendUserInfo(JSON.stringify({}));
    
    this.goToSlide(3);
    
  }
  
  onSubmitImage(){

    let loading = this.loadingCtrl.create({
      content: 'Đang cập nhập ảnh...'
    });
    loading.present();

    this.auth.sendImageBase64(JSON.stringify({}));
    //may chu cho phep se cap mot token server proxy
    //console.log('token proxy',this.token);
    //gui token nay len server resource chung thuc
    this.resources.authorizeFromResource(this.token)
    .then(data=>{
      //console.log('data from resource',data);
      let login;
      login = data;
      if (login.status
        &&login.user_info
        &&login.token
        ){
        this.apiStorageService.saveToken(this.token);
        this.navCtrl.setRoot(TabsPage);
      }else{
        this.presentAlert('Dữ liệu xác thực không đúng <br>' + JSON.stringify(data))
        this.goToSlide(0);
      }
      loading.dismiss();

    })
    .catch(err=>{
      //console.log('err',err);
      this.presentAlert('Lỗi xác thực - authorizeFromResource')
      this.goToSlide(0);
      loading.dismiss();

    });

  }



  goToSlide(i) {
    this.slides.lockSwipes(false);
    this.slides.slideTo(i, 500);
    this.slides.lockSwipes(true);
  }

  slideChanged() {
    this.slideIndex = this.slides.getActiveIndex();
  }

  goBack(){
    this.goToSlide(0);
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'For Administrator',
      subTitle: msg,
      buttons: ['Dismiss']
    }).present();
  }

  fileChange(event) {
    if (event.target && event.target.files) {
      const files: { [key: string]: File } = event.target.files;
      for (let key in files) { //index, length, item
        if (!isNaN(parseInt(key))) {
          this.apiImageService.resizeImage(files[key].name,files[key],300)
          .then(data=>{
            this.resourceImages.push(data);
            this.isImageViewer = true;
          })
          .catch(err=>{
            console.log(err);
          })
        }
      }//
    }
  }

  deleteImage(evt) {
    this.resourceImages = this.resourceImages.filter((value, index, arr) => { return value != evt;});
  }
}

function phoneNumberValidator(formControl: FormControl) {
  if (formControl.value.charAt(0) != "0") return null;
  else return { phone: formControl.value };
}

//custom validators
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {'forbiddenName': {value: control.value}} : null;
  };
}

