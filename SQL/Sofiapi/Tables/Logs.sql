use sofiapi
go

if not exists (select * from sysobjects where name = 'Logs')
begin

create table [dbo].[Logs]
(LogID int identity(1,1) NOT NULL,
 Application nvarchar(50) NOT NULL,
 TimeUtc datetime NOT NULL,
 Host nvarchar(63) NOT NULL,
 LogType nvarchar(20) NOT NULL,
 Source nvarchar(2048) NOT NULL,
 Message nvarchar(max) NOT NULL,
 UserName nvarchar(max) NOT NULL,
 StatusCode int NOT NULL,
 Headers nvarchar(max) NOT NULL,
 Cookies nvarchar(max) NOT NULL,
 QueryString nvarchar(max) NOT NULL,
 Body nvarchar(max) NOT NULL,
 Context nvarchar(max) NOT NULL
)

end
go