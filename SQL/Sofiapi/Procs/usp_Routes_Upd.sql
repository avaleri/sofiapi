USE [sofiapi]
GO

create or alter proc [dbo].[usp_Routes_Upd]
(
@RouteID int,
@AppName nvarchar(max),
@RoutePath nvarchar(2048),
@RouteCommand nvarchar(max),
@AllowNoParameters bit,
@PublicRoute bit,
@PermissionList nvarchar(max) = NULL,
@UserName nvarchar(max)
)
as
begin

UPDATE [dbo].[Routes]
   SET [AppName] = @AppName
      ,[RoutePath] = @RoutePath
      ,[RouteCommand] = @RouteCommand
      ,[AllowNoParameters] = @AllowNoParameters
      ,[PublicRoute] = @PublicRoute
      ,[PermissionList] = @PermissionList
      ,[ModifiedDt] = GETUTCDATE()
      ,[ModifiedBy] = @UserName
 WHERE RouteID = @RouteID
end
GO

