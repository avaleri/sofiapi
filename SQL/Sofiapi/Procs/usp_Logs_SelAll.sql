use sofiapi
go

create or alter proc [dbo].[usp_Logs_SelAll]
(
@SearchValue nvarchar(2048) = NULL,
@PageNo INT = 1,
@PageSize INT = 5,
@SortColumn NVARCHAR(20) = 'LogID',
@SortOrder NVARCHAR(20) = 'Desc'
)
 AS BEGIN
 SET NOCOUNT ON;
	
 ; WITH CTE_Results AS 
(

	SELECT  LogID,
		    [Application],
			[TimeUtc],
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
			Context
	FROM [dbo].[Logs]
	WHERE (@SearchValue IS NULL OR ( (Application LIKE '%' + @SearchValue + '%') OR 
								     (Host LIKE '%' + @SearchValue + '%') OR 
								     (Message LIKE '%' + @SearchValue + '%') OR
									 (Context LIKE '%' + @SearchValue + '%') 
		  )) 
	 	    ORDER BY
   	 CASE WHEN (@SortColumn = 'LogID' AND @SortOrder='ASC')
                    THEN LogID
        END ASC,
        CASE WHEN (@SortColumn = 'LogID' AND @SortOrder='DESC')
                   THEN LogID
		END DESC
      OFFSET @PageSize * (@PageNo - 1) ROWS
      FETCH NEXT @PageSize ROWS ONLY
	),
CTE_TotalRows AS 
(
 select count(LogID) as MaxRows from [Logs] WHERE (@SearchValue IS NULL OR ( (Application LIKE '%' + @SearchValue + '%') OR 
								     (Host LIKE '%' + @SearchValue + '%') OR 
								     (Message LIKE '%' + @SearchValue + '%') OR
									 (Context LIKE '%' + @SearchValue + '%' ) ) )
		  
)

select 
	MaxRows,
	LogID,
	[Application],
	[TimeUtc],
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
	Context
	,@PageSize 'PageSize'
   from dbo.Logs as t, CTE_TotalRows 
   WHERE EXISTS (SELECT 1 FROM CTE_Results WHERE CTE_Results.LogID = t.LogID)
   OPTION (RECOMPILE)
   END
go
