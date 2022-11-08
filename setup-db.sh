echo "CREATE USER 'DEV_USER'@'localhost' IDENTIFIED BY 'DEV_PWD' \
GRANT ALL PRIVILEGES ON *.* TO 'DEV_USER'@'localhost' \
ALTER USER 'DEV_USER'@'localhost' IDENTIFIED WITH mysql_native_password by 'DEV_PWD' \
FLUSH PRIVILEGES" | mysql -u$1 -p
