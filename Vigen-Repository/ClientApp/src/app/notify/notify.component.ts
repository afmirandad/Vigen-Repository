import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as SignalR from '@microsoft/signalr';
import { ApiConfiguration } from '../api/api-configuration';
import { BaseService } from '../api/base-service';
import {LoginComponent} from 'src/app/login/login.component';
import { SingletonUser } from '../api/MyServices/singletonUser';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css']
})
export class NotifyComponent extends BaseService implements OnInit {

  constructor(
    config: ApiConfiguration,
    http: HttpClient,
    //private login:LoginComponent
  ) {
    super(config, http);
  }

  ngOnInit(): void {
    const connection = new SignalR.HubConnectionBuilder()
    .configureLogging(SignalR.LogLevel.Critical)
    .withUrl(this.rootUrl+"/notifyhub")
    .build();

    connection.start().then(() => {
      console.log("SignalR Connected!");
    }).catch(err=>{
      console.error(err.toString());
    });

    connection.on("recibeNotify", notify=>{
      var not:String[]=Object.values(notify);
      if(SingletonUser.getInstance().type==String(not[5])){
        this.showAlert(not);
      }
      console.log(SingletonUser.getInstance().type+" "+String(not[5]));
    });
  }
  showAlert(notify:String[]) {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: notify[2],
      showConfirmButton: false,
      timer: 1500
    })
  }

}
