## zSMS

https://docs.docker.com/desktop/install/linux/ubuntu/

`sudo sysctl -w kernel.apparmor_restrict_unprivileged_userns=0`

### Lancement de la stack Supabase

`./node_modules/.bin/supabase start` (stop)

### Mise à jour de la base de données

```
./node_modules/.bin/supabase db pull
./node_modules/.bin/supabase db reset
```

### Favicon

https://askubuntu.com/a/1365053

`convert <your-image-here> -define icon:auto-resize=256,64,48,32,16 favicon.ico`
