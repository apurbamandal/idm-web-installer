import {Component, OnInit, Input} from '@angular/core';
import {EmitterService} from "../../shared/services/emitter/emitter.service";

declare var $: any;

@Component({
  selector: 'idm-feed-back',
  templateUrl: './feed-back.component.html',
  styleUrls: ['./feed-back.component.css']
})
export class FeedBackComponent implements OnInit {
  feedBackEmittor: any;
  displayMessage: any;
  messageType: boolean;
  showFeedBack: boolean;
  treeNotification: boolean

  constructor(private EmitterService: EmitterService) {
    this.eventListener();
    this.showFeedBack = false;
    this.treeNotification = false;

  }

  eventListener() {
    this.feedBackEmittor = this.EmitterService.get('feedBackMessage');
    this.feedBackEmittor.subscribe(data => {
      if (data.message.hasOwnProperty('succeeded') || data.message.hasOwnProperty('failed')) {
        this.displayMessage = data.message;
        this.treeNotification = true;
        if (data.message.hasOwnProperty('success')) {
          this.messageType = data.message.success;
        }
      }
      else {
        this.treeNotification = false;
        this.displayMessage = data.message;
        if (data.status == 200) {
          this.messageType = true;
        }
        else {
          this.messageType = false;
        }
      }

      if (data.message) {
        // this.showFeedBack = true;
        $(".alert").show();
      }
      window.setTimeout(function () {
        $(".alert").hide();
      }, 4000000);

    });
  }

  ngOnInit() {
    $(".alert").hide();
  }

}
