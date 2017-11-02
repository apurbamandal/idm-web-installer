import {FormControl, Validators} from '@angular/forms';

export class InstallSchema {
  vaultip = new FormControl('', []);
  boxpass = new FormControl('', []);
  ssopass = new FormControl('', []);
  boxusername = new FormControl('', []);
  vaulttreename = new FormControl('', []);
  appsip = new FormControl('', []);
  appsadminpass = new FormControl('', []);
  appsadminname = new FormControl('cn=uaadmin,ou=sa,o=data', [Validators.required]);
  vaultadminpass = new FormControl('', []);
  postgresusername = new FormControl('', []);
  postgresuserpass = new FormControl('', []);
  postgresadminpass = new FormControl('', []);
  sentinelip = new FormControl('', []);
  buildid = new FormControl('', []);
  vaultadminname = new FormControl('cn=admin,ou=sa,o=system', [Validators.required]);
}
