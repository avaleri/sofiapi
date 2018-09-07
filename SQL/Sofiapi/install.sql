USE [master]
GO

/****** Object:  Database [sofiapi]    Script Date: 8/30/2018 6:29:36 PM ******/
CREATE DATABASE [sofiapi]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'sofiapi', FILENAME = N'/var/opt/mssql/data/sofiapi.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'sofiapi_log', FILENAME = N'/var/opt/mssql/data/sofiapi_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO

ALTER DATABASE [sofiapi] SET COMPATIBILITY_LEVEL = 140
GO

IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [sofiapi].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO

ALTER DATABASE [sofiapi] SET ANSI_NULL_DEFAULT OFF 
GO

ALTER DATABASE [sofiapi] SET ANSI_NULLS OFF 
GO

ALTER DATABASE [sofiapi] SET ANSI_PADDING OFF 
GO

ALTER DATABASE [sofiapi] SET ANSI_WARNINGS OFF 
GO

ALTER DATABASE [sofiapi] SET ARITHABORT OFF 
GO

ALTER DATABASE [sofiapi] SET AUTO_CLOSE OFF 
GO

ALTER DATABASE [sofiapi] SET AUTO_SHRINK OFF 
GO

ALTER DATABASE [sofiapi] SET AUTO_UPDATE_STATISTICS ON 
GO

ALTER DATABASE [sofiapi] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO

ALTER DATABASE [sofiapi] SET CURSOR_DEFAULT  GLOBAL 
GO

ALTER DATABASE [sofiapi] SET CONCAT_NULL_YIELDS_NULL OFF 
GO

ALTER DATABASE [sofiapi] SET NUMERIC_ROUNDABORT OFF 
GO

ALTER DATABASE [sofiapi] SET QUOTED_IDENTIFIER OFF 
GO

ALTER DATABASE [sofiapi] SET RECURSIVE_TRIGGERS OFF 
GO

ALTER DATABASE [sofiapi] SET  DISABLE_BROKER 
GO

ALTER DATABASE [sofiapi] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO

ALTER DATABASE [sofiapi] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO

ALTER DATABASE [sofiapi] SET TRUSTWORTHY OFF 
GO

ALTER DATABASE [sofiapi] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO

ALTER DATABASE [sofiapi] SET PARAMETERIZATION SIMPLE 
GO

ALTER DATABASE [sofiapi] SET READ_COMMITTED_SNAPSHOT OFF 
GO

ALTER DATABASE [sofiapi] SET HONOR_BROKER_PRIORITY OFF 
GO

ALTER DATABASE [sofiapi] SET RECOVERY FULL 
GO

ALTER DATABASE [sofiapi] SET  MULTI_USER 
GO

ALTER DATABASE [sofiapi] SET PAGE_VERIFY CHECKSUM  
GO

ALTER DATABASE [sofiapi] SET DB_CHAINING OFF 
GO

ALTER DATABASE [sofiapi] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO

ALTER DATABASE [sofiapi] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO

ALTER DATABASE [sofiapi] SET DELAYED_DURABILITY = DISABLED 
GO

ALTER DATABASE [sofiapi] SET QUERY_STORE = OFF
GO

USE [sofiapi]
GO

ALTER DATABASE SCOPED CONFIGURATION SET IDENTITY_CACHE = ON;
GO

ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO

ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET LEGACY_CARDINALITY_ESTIMATION = PRIMARY;
GO

ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO

ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET MAXDOP = PRIMARY;
GO

ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO

ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET PARAMETER_SNIFFING = PRIMARY;
GO

ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO

ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET QUERY_OPTIMIZER_HOTFIXES = PRIMARY;
GO

ALTER DATABASE [sofiapi] SET  READ_WRITE 
GO

use Sofiapi
go

if not exists (select * from sysobjects where name = 'Routes')
begin
	
	create table [dbo].[Routes]
	(RouteID int identity(1,1),
	 AppName nvarchar(max),
	 RoutePath nvarchar(2048),
	 RouteCommand nvarchar(max),
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

create or alter proc [dbo].[usp_Routes_Del]
(@RouteID int)
as
begin

delete from [dbo].[Routes]
where RouteID = @RouteID

end
go

create or alter proc [dbo].[usp_Routes_Ins]
(
@AppName nvarchar(max),
@RoutePath nvarchar(2048),
@RouteCommand nvarchar(max),
@AllowNoParameters bit,
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
           ,@CreateDt
           ,@CreatedBy)
end
GO

create or alter proc [dbo].[usp_Routes_Sel]
(@RouteID int)
as
begin

SELECT [RouteID]
      ,[AppName]
      ,[RoutePath]
      ,[RouteCommand]
	  ,[AllowNoParameters]
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

create or alter proc [dbo].[usp_Routes_SelAll]
(
@SearchValue nvarchar(2048) = NULL,
@PageNo INT = 1,
@PageSize INT = 10,
@SortColumn NVARCHAR(20) = 'RoutePath',
@SortOrder NVARCHAR(20) = 'ASC'
)
 AS BEGIN
 SET NOCOUNT ON;
	
 ; WITH CTE_Results AS 
(

	SELECT [RouteID]
		  ,[AppName]
		  ,[RoutePath]
		  ,[RouteCommand]
		  ,[AllowNoParameters]
		  ,[PublicRoute]
		  ,[PermissionList]
		  ,[CreateDt]
		  ,[CreatedBy]
		  ,[ModifiedDt]
		  ,[ModifiedBy]
	FROM [dbo].[Routes]
	WHERE (@SearchValue IS NULL OR RoutePath LIKE '%' + @SearchValue + '%') 
	 	    ORDER BY
   	 CASE WHEN (@SortColumn = 'RoutePath' AND @SortOrder='ASC')
                    THEN RoutePath
        END ASC,
        CASE WHEN (@SortColumn = 'RoutePath' AND @SortOrder='DESC')
                   THEN RoutePath
		END DESC,
	 CASE WHEN (@SortColumn = 'AppName' AND @SortOrder='ASC')
                    THEN AppName
        END ASC,
        CASE WHEN (@SortColumn = 'AppName' AND @SortOrder='DESC')
                   THEN AppName
		END DESC 
      OFFSET @PageSize * (@PageNo - 1) ROWS
      FETCH NEXT @PageSize ROWS ONLY
	),
CTE_TotalRows AS 
(
 select count(RouteID) as MaxRows from [Routes] WHERE (@SearchValue IS NULL OR RoutePath LIKE '%' + @SearchValue + '%')
)

select 
	MaxRows
	,[RouteID]
	,[AppName]
	,[RoutePath]
	,[RouteCommand]
	,[AllowNoParameters]
	,[PublicRoute]
	,[PermissionList]
	,[CreateDt]
	,[CreatedBy]
	,[ModifiedDt]
	,[ModifiedBy]
   from dbo.Routes as t, CTE_TotalRows 
   WHERE EXISTS (SELECT 1 FROM CTE_Results WHERE CTE_Results.RouteID = t.RouteID)
   OPTION (RECOMPILE)
   END
GO

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
			  ,[AllowNoParameters]
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

/* begin add system routes */
	truncate table Routes
	declare @CreateDt datetime,
		@CreatedBy nvarchar(max)

	set @CreateDt = getdate()
	set @CreatedBy = 'avaleri@gmail.com'

	exec usp_Routes_Ins
	@AppName = 'sofiapi',
	@RoutePath = '/api/routes/get',
	@RouteCommand = 'usp_Routes_Sel',
	@AllowNoParameters = 0,
	@PublicRoute = 1,
	@PermissionList = NULL,
	@CreateDt = @CreateDt,
	@CreatedBy = @CreatedBy

	exec usp_Routes_Ins
	@AppName = 'sofiapi',
	@RoutePath = '/api/routes/getAll',
	@RouteCommand = 'usp_Routes_SelAll',
	@AllowNoParameters = 1,
	@PublicRoute = 1,
	@PermissionList = NULL,
	@CreateDt = @CreateDt,
	@CreatedBy = @CreatedBy

	exec usp_Routes_Ins
	@AppName = 'sofiapi',
	@RoutePath = '/api/routes/add',
	@RouteCommand = 'usp_Routes_Ins',
	@AllowNoParameters = 0,
	@PublicRoute = 1,
	@PermissionList = NULL,
	@CreateDt = @CreateDt,
	@CreatedBy = @CreatedBy

	exec usp_Routes_Ins
	@AppName = 'sofiapi',
	@RoutePath = '/api/routes/delete',
	@RouteCommand = 'usp_Routes_Del',
	@AllowNoParameters = 0,
	@PublicRoute = 1,
	@PermissionList = NULL,
	@CreateDt = @CreateDt,
	@CreatedBy = @CreatedBy

/* end add system routes */