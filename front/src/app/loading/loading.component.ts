import { Component, OnInit, Input } from '@angular/core';
import {AppLoadingService} from "../shared/services/loading/app-loading.service";

@Component({
  selector: 'idm-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit{
  ngOnInit(): void {
    //throw new Error("Method not implemented.");
    //console.log(this.tableLoading);

  }

  @Input('tableLoading') tableLoading:boolean;

  constructor(private appLoadingService: AppLoadingService) {
    //console.log(this.tableLoading);
  }
  
  
  isApplicationLoading() {
    return this.appLoadingService.appLoading;
  }

  isTableDataLoading() {
    return this.appLoadingService.TableDataLoading;
  }

}
