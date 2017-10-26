import { FormControl, Validators } from '@angular/forms';

export class InstallSchema {
   vaultip = new FormControl('', []);
   ssopass = new FormControl('', []);
   appsip = new FormControl('', []);
   appsadminname = new FormControl('cn=admin,ou=sa,o=system', [Validators.required]);
   vaultadminpass = new FormControl('', []);
   vaultadminname = new FormControl('cn=admin,ou=sa,o=system', [Validators.required]);
}
