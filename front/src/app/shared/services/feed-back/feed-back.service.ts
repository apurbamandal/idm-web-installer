import { Injectable } from '@angular/core';
import { EmitterService } from "../emitter/emitter.service";

@Injectable()
export class FeedBackService {

  _feedBackMessage:any;
  constructor(private EmitterService:EmitterService) {
    this._feedBackMessage = this.EmitterService.get("feedBackMessage");
   }

    feedBack(message:any){
    this._feedBackMessage.emit({message});
    }
    feedBackSuccess(message:any){
    this._feedBackMessage.emit({message,status:200});
    }
    feedBackError(message:any){
    this._feedBackMessage.emit({message,status:-1});
    }
  
}