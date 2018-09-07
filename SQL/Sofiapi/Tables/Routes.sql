use Sofiapi
go
if not exists (select * from sysobjects where name = 'Routes')
begin
	
	create table [dbo].[Routes]
	(RouteID int identity(1,1),
	 AppName nvarchar(max),
	 RoutePath nvarchar(2048),
	 RouteCommand nvarchar(max),
	 RouteType int,						-- 1 Create, 2 Update, 3 Delete, 4 Select, 5 Upsert
	 AllowNoParameters bit,				-- specifies if the route can be invoked without any parameters
	 PublicRoute bit,					-- flag if route is publicly accessible
	 PermissionList nvarchar(max) NULL,	-- string of allowed roles
	 CreateDt datetime,
	 CreatedBy nvarchar(max),
	 ModifiedDt datetime NULL,
	 ModifiedBy datetime NULL
	)

	-- store routing information
end
go
