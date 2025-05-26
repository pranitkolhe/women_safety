create database Safety;
use Safety;

create table device(
   id int auto_increment primary key,
   is_enable boolean default false,
   phone varchar(10) not null
);

create table location(
	id int auto_increment primary key,
    device_id int not null,
    latitude DECIMAL(10, 8),
	longitude DECIMAL(11, 8),
	FOREIGN KEY (device_id) REFERENCES device(id)
);

create table sos(
	id int auto_increment primary key,
    last_location_id int not null,
    device_id int not null,
    is_done bool default false,
    FOREIGN KEY (last_location_id) REFERENCES location(id),
    FOREIGN KEY (device_id) REFERENCES device(id)
);

insert into device (phone) values("9638527410");
insert into location (device_id,latitude,longitude) values (1 , 18.52014595137803, 73.85945320999632);
insert into sos (last_location_id , device_id) values (3,1);
select * from device;
select * from location;
select * from sos;
