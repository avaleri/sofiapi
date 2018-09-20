use sofiapi
go

create or alter proc [dbo].[usp_Logs_Ins]
(@Application nvarchar(50),
 @TimeUtc datetime,
 @Host nvarchar(63),
 @LogType nvarchar(20),
 @Source nvarchar(2048),
 @Message nvarchar(max),
 @UserName nvarchar(max),
 @StatusCode int,
 @Headers nvarchar(max),
 @Cookies nvarchar(max),
 @QueryString nvarchar(max),
 @Body nvarchar(max),
 @Context nvarchar(max)
)
as
begin

insert into Logs
([Application],
 TimeUtc,
 Host,
 LogType,
 [Source],
 [Message],
 UserName,
 StatusCode,
 Headers,
 Cookies,
 QueryString,
 Body,
 Context)
 values
(@Application,
 @TimeUtc,
 @Host,
 @LogType,
 @Source,
 @Message,
 @UserName,
 @StatusCode,
 @Headers,
 @Cookies,
 @QueryString,
 @Body,
 @Context)

 end
 go
