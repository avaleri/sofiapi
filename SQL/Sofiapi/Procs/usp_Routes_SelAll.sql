use Sofiapi
go

create or alter proc [dbo].[usp_Routes_SelAll]
(
@SearchValue nvarchar(2048) = NULL,
@PageNo INT = 1,
@PageSize INT = 5,
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
	WHERE (@SearchValue IS NULL OR ( (RoutePath LIKE '%' + @SearchValue + '%') OR 
								     (AppName LIKE '%' + @SearchValue + '%') OR 
								     (RouteCommand LIKE '%' + @SearchValue + '%') OR
									 (PermissionList LIKE '%' + @SearchValue + '%') 
		  )) 
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
	,@PageSize 'PageSize'
   from dbo.Routes as t, CTE_TotalRows 
   WHERE EXISTS (SELECT 1 FROM CTE_Results WHERE CTE_Results.RouteID = t.RouteID)
   OPTION (RECOMPILE)
   END
GO
