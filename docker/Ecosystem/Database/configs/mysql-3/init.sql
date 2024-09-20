-- Create databases
CREATE DATABASE IF NOT EXISTS vault;
CREATE DATABASE IF NOT EXISTS helix;

-- Create users and grant least privileges
-- Administrator with all privileges on all databases
CREATE USER 'administrator'@'%' IDENTIFIED BY '${MYSQL_ADMINISTRATOR_PASSWORD}';
GRANT ALL PRIVILEGES ON *.* TO 'administrator'@'%' WITH GRANT OPTION;

-- Developer with basic privileges on helix and vault databases
CREATE USER 'developer'@'%' IDENTIFIED BY '${MYSQL_DEVELOPER_PASSWORD}';
GRANT SELECT, INSERT, UPDATE, DELETE ON helix.* TO 'developer'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON vault.* TO 'developer'@'%';

-- Helix user with all privileges on helix database
CREATE USER 'helix'@'%' IDENTIFIED BY '${MYSQL_HELIX_PASSWORD}';
GRANT ALL PRIVILEGES ON helix.* TO 'helix'@'%';

-- Vault user with all privileges on vault database
CREATE USER 'vault'@'%' IDENTIFIED BY '${MYSQL_VAULT_PASSWORD}';
GRANT ALL PRIVILEGES ON vault.* TO 'vault'@'%';

-- Create user for mysqld_exporter with minimum permissions
CREATE USER 'exporter'@'%' IDENTIFIED BY '${MYSQL_EXPORTER_PASSWORD}';
GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO 'exporter'@'%';

-- Create user for ProxySQL monitoring
CREATE USER 'proxysql'@'%' IDENTIFIED BY '${MYSQL_PROXYSQL_PASSWORD}';
GRANT SELECT, REPLICATION CLIENT ON *.* TO 'proxysql'@'%';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;
