curl -o /tmp/a.iso http://blr-iam-jenkins.labs.blr.novell.com:8080/view/IDM_4.7.0/view/Install/job/IDMLinuxInstaller_idm4.7.0/$1/artifact/Identity_Manager_4.7_Linux.iso &> /tmp/download.log
mount -o loop /tmp/a.iso /mnt
mkdir /tmp/idm/
cp -r /mnt/* /tmp/idm/
rm -rf /tmp/download.log
sed -i -e "/MIN_CPU=/ s/=.*/=0/" -e "/MIN_MEM=/ s/=.*/=0/" -e "/MIN_DISK_OPT=/ s/=.*/=0/" -e "/MIN_DISK_VAR=/ s/=.*/=0/" -e "/MIN_DISK_ETC=/ s/=.*/=0/" -e "/MIN_DISK_TMP=/ s/=.*/=0/" -e "/MIN_DISK_ROOT=/ s/=.*/=0/" /tmp/idm/user_application/sys_req.sh
cd /tmp/idm/
./install.sh -s -f /tmp/silent.properties
./configure.sh -s -f /tmp/silent.properties
rm -rf /tmp/idm
umount /mnt
rm -rf /tmp/a.iso
