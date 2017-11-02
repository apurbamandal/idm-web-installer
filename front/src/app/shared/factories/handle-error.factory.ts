import {Observable} from "rxjs";

export function handleError(error: Response | any) {
  // In a real world app, you might use a remote logging infrastructure
  let errMsg: string;
  if (error instanceof Response) {
    const body = error.json() || '';
    const err = body["error"] || JSON.stringify(body);
    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  } else {
    errMsg = error.message ? error.message : error.toString();
  }
  console.error(errMsg);
  return Observable.throw(errMsg);
}

export function handleErrorReason(error: Response | any) {
  // In a real world app, you might use a remote logging infrastructure
  let body = error.json() || {};
  let reason = "Error Something went wrong ";
  if (body.hasOwnProperty("Fault")) {
    reason = body.Fault.Reason.Text;
  }

  return Observable.throw(reason);
}


