use Sofiapi
go

create or alter proc [dbo].[usp_Routes_Ins]
(
@AppName nvarchar(max),
@RoutePath nvarchar(2048),
@RouteCommand nvarchar(max),
@RouteType int,
@PublicRoute bit,
@PermissionList nvarchar(max) = NULL,
@CreateDt datetime,
@CreatedBy nvarchar(max)
)
as
begin

INSERT INTO [dbo].[Routes]
           ([AppName]
           ,[RoutePath]
           ,[RouteCommand]
           ,[RouteType]
           ,[PublicRoute]
           ,[PermissionList]
           ,[CreateDt]
           ,[CreatedBy])
     VALUES
           (@AppName
           ,@RoutePath
           ,@RouteCommand
           ,@RouteType
           ,@PublicRoute
           ,@PermissionList
           ,@CreateDt
           ,@CreatedBy)
end
GO


