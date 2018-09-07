use Sofiapi
go

create or alter proc [dbo].[usp_Routes_Sel]
(@RouteID int)
as
begin

SELECT [RouteID]
      ,[AppName]
      ,[RoutePath]
      ,[RouteCommand]
      ,[RouteType]
      ,[PublicRoute]
      ,[PermissionList]
      ,[CreateDt]
      ,[CreatedBy]
      ,[ModifiedDt]
      ,[ModifiedBy]
FROM [dbo].[Routes]
where RouteID = @RouteID

end
go
