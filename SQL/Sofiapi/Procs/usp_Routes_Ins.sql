use Sofiapi
go

create or alter proc [dbo].[usp_Routes_Ins]
(
@AppName nvarchar(max),
@RoutePath nvarchar(2048),
@RouteCommand nvarchar(max),
@AllowNoParameters bit = 0,
@PublicRoute bit,
@PermissionList nvarchar(max) = NULL,
@UserName nvarchar(max)
)
as
begin

INSERT INTO [dbo].[Routes]
           ([AppName]
           ,[RoutePath]
           ,[RouteCommand]
		   ,[AllowNoParameters]
           ,[PublicRoute]
           ,[PermissionList]
           ,[CreateDt]
           ,[CreatedBy])
     VALUES
           (@AppName
           ,@RoutePath
           ,@RouteCommand
		   ,@AllowNoParameters
           ,@PublicRoute
           ,@PermissionList
           ,GETUTCDATE()
           ,@UserName)
end
go


