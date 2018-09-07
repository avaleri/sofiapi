use Sofiapi
go

create or alter proc [dbo].[usp_Routes_SelByPath]
(@RoutePath nvarchar(2048)
)
as
begin
	if exists (select * from [dbo].[Routes]
	where RoutePath = @RoutePath)
	begin

		declare @RouteCommand nvarchar(max)

		select @RouteCommand = RouteCommand
		FROM [dbo].[Routes]
		where RoutePath = @RoutePath
		-- get proc name

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
		where RoutePath = @RoutePath
		-- get proc data

		SELECT
		ROUTINE_NAME,
		ORDINAL_POSITION,
		PARAMETER_MODE,
		PARAMETER_NAME,
		ip.DATA_TYPE
		FROM
			INFORMATION_SCHEMA.ROUTINES ir
			LEFT OUTER JOIN
			INFORMATION_SCHEMA.PARAMETERS ip
			ON ir.ROUTINE_NAME = ip.SPECIFIC_NAME
		WHERE
		ir.ROUTINE_TYPE = 'PROCEDURE' and
		ir.ROUTINE_NAME = @RouteCommand
		-- get proc parameters

	end
end
go

